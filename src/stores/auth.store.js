import { defineStore } from 'pinia';
import { supabase } from '@/services/supabaseClient';

export const useAuthStore = defineStore('auth', {
  // Başlangıç durumu: Kullanıcı yok, ve uygulama "yükleniyor" modunda.
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    // UYGULAMANIN İLK AÇILIŞINDA ÇALIŞACAK TEK VE EN ÖNEMLİ FONKSİYON
    async initialize() {
      try {
        // Supabase'den mevcut oturum bilgisini al.
        const { data: { session } } = await supabase.auth.getSession();
        // Oturum varsa kullanıcıyı ata, yoksa null olarak bırak.
        this.user = session?.user ?? null;
      } catch (error) {
        console.error("Oturum kontrolü sırasında hata oluştu:", error);
        this.user = null;
      } finally {
        // NE OLURSA OLSUN, İŞLEM BİTTİĞİNDE "YÜKLENİYOR" DURUMUNU BİTİR.
        // Takılı kalmayı engelleyen en kritik satır budur.
        this.loading = false;
      }
    },

    async login(credentials) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(credentials);
      if (loginError) { throw loginError };

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
      // Canlı site adresini ortam değişkeninden alıyoruz.
      const siteUrl = import.meta.env.VITE_SITE_URL;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // NİHAİ DÜZELTME:
        // Kullanıcıyı, canlı sitemizin içindeki /reset-password yoluna yönlendir.
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        console.error('Şifre sıfırlama hatası:', error);
        throw error;
      }

      return 'Şifre sıfırlama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.';
    },
    async resetPassword(newPassword) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Yeni şifre belirleme hatası:', error);
        throw error;
      }
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