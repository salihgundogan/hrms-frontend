import { defineStore } from 'pinia';
import { supabase } from '@/services/supabaseClient';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Bu, hem kimlik hem de profil verisini tutacak
    loading: true, // Bu, SADECE uygulamanın ilk açılışındaki kontrol içindir
  }),
  actions: {
    async initialize() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Standart .select() sorgusunu kullanıyoruz.
        const { data: profile, error } = await supabase
          .from('users') // Küçük harfle, Supabase'in hint'ine uyarak.
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.error("İlk oturum kontrolünde profil bulunamadı. Hata:", error);
          await this.logout(); // Bozuk oturumu temizle
        } else {
          this.user = { ...session.user, ...profile };
        }
      }
      this.loading = false;
    },

    async login(credentials) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(credentials);
      if (loginError) throw loginError;

      if (loginData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users') // Küçük harfle.
          .select('*')
          .eq('id', loginData.user.id)
          .single();

        if (profileError || !profile) {
          // Bu, tam olarak sizin gördüğünüz hatayı oluşturacak kısımdır.
          await this.logout(); // Başarısız oturumu temizle.
          throw new Error("Giriş başarılı ancak profil veritabanında bulunamadı. Hata: " + (profileError?.message || 'Profil yok'));
        }

        this.user = { ...loginData.user, ...profile };
        return loginData;
      }
      throw new Error("Giriş sonrası kullanıcı bilgisi alınamadı.");
    },

    // ÇIKIŞ FONKSİYONU
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },

    // Oturum Kontrolü (Sayfa Yenilendiğinde Çalışır)
    async checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      this.user = session ? session.user : null;
      this.loading = false;
    },
    async register(userInfo) {
      // userInfo objesi şunları içermeli: { name, email, password }

      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            name: userInfo.name
          }
        }
      });

      if (error) {
        throw error;
      }

      return data;
    },

    // YENİ ve GÜNCELLENMİŞ Profil Çekme Fonksiyonu
    async fetchUserProfile() {
      // Eğer kullanıcı yoksa veya profil zaten yüklendiyse, tekrar çalıştırma
      if (!this.user || !this.user.id || this.profileLoaded) { return };

      try {
        console.log('Profil bilgisi RPC ile çekiliyor...');
        const { data, error } = await supabase
          .rpc('get_user_profile', { user_id: this.user.id }); // RPC ÇAĞRISI

        if (error) { throw error };

        // RPC'den dönen veri bir dizi içindedir, ilk elemanı alırız.
        const userProfile = data[0];

        if (userProfile) {
          console.log('Profil BAŞARIYLA çekildi:', userProfile);
          // Mevcut kullanıcı objesini (kimlik) ve yeni profil verisini birleştir.
          this.user = { ...this.user, ...userProfile };
          this.profileLoaded = true; // Profilin yüklendiğini işaretle
        } else {
          throw new Error('RPC çağrısı başarılı ancak profil bulunamadı.');
        }

      } catch (error) {
        console.error('Profil çekme hatası:', error);
        // Hata durumunda kullanıcıyı sistemden atalım ki sorun net görülsün.
        await this.logout();
      }
    },
    async forgotPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // DÜZELTME: Yönlendirilecek adresi doğru şekilde belirtiyoruz.
        redirectTo: 'http://localhost:5173/reset-password',
      });

      if (error) {
        console.error('Şifre sıfırlama hatası:', error);
        throw error;
      }

      return 'Şifre sıfırlama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.';
    },
    async resetPassword(newPassword) {
      // Supabase, kullanıcının e-postadaki linke tıkladığında
      // tarayıcıya özel bir kod bırakır. auth.updateUser metodu,
      // bu kodu otomatik olarak kullanarak doğru kullanıcıyı bulur ve şifresini günceller.
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        // Bir hata olursa (örn: yeni şifre çok kısa), bunu fırlatalım.
        console.error('Yeni şifre belirleme hatası:', error);
        throw error;
      }

      // Başarılı olduğunda kullanıcıya bilgi verelim.
      console.log('Şifre başarıyla sıfırlandı:', data);
      return 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.';
    },
    async updateProfile(profileData) {
      if (!this.user || !this.user.id) {
        throw new Error('Güncelleme yapmak için önce giriş yapmalısınız.');
      }

      const { data, error } = await supabase
        .rpc('update_user_profile', {
          user_id: this.user.id,
          new_name: profileData.name,
          new_email: profileData.email
        });

      if (error) {
        console.error('Profil güncelleme hatası:', error);
        throw error;
      }

      const updatedProfile = data[0];
      this.user = { ...this.user, ...updatedProfile };

      // DÜZELTME: Artık data objesi yerine, istediğimiz metni döndürüyoruz.
      return "Bilgileriniz başarıyla güncellendi.";
    },
    async changePassword(passwordData) {
      // 1. Yeni şifrelerin birbiriyle eşleştiğini kontrol edelim.
      if (passwordData.newPassword !== passwordData.passwordConfirm) {
        throw new Error('Yeni şifreler eşleşmiyor!');
      }

      // 2. Supabase'in kullanıcı şifresini güncelleme fonksiyonunu çağıralım.
      //    Supabase, mevcut şifreyi kontrol etmez, sadece giriş yapmış olan
      //    kullanıcının şifresini doğrudan günceller. Bu güvenli bir işlemdir.
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        // Bir hata olursa (örn: yeni şifre çok kısa), bunu fırlatalım.
        console.error('Şifre değiştirme hatası:', error);
        throw error;
      }

      // 3. Başarılı olduğunda kullanıcıya net bir mesaj döndürelim.
      return 'Şifreniz başarıyla değiştirildi.';
    },
  },
});