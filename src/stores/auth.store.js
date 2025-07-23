// src/stores/auth.store.js

import { defineStore } from 'pinia';
import { supabase } from '../services/supabaseClient'; 
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        session: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user && state.session?.access_token,
        userRole: (state) => state.user?.profile?.role, 
    },
    actions: {
                async initialize() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                this.session = session;
                this.user = session.user;
                await this.fetchUserProfile();
            }
            supabase.auth.onAuthStateChange(async (event, session) => {
                this.session = session;
                this.user = session ? session.user : null;
                if (this.user) {
                    await this.fetchUserProfile();
                }
            });
        },
        async register(userData) {
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                name: userData.name
            }
        }
    });
    if (error) throw error;
    return data;
},

        async login(email, password) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {throw error};
            router.push('/dashboard');
        },
        async logout() {
            const { error } = await supabase.auth.signOut();
            if (error) {console.error('Logout error:', error)};
            router.push('/login');
        },
        async fetchUserProfile() {
    if (!this.user) {
      return;
    }
    try {
        // DÜZELTME: '.single()' komutunu kaldırarak, Supabase'den her zaman
        // bir dizi (array) dönmesini bekliyoruz. Bu, satır bulunamadığında
        // hata vermesini engeller, sadece boş bir dizi döndürür.
        const { data: profileData, error } = await supabase
            .from('Users')
            .select('role, profilePicture')
            .eq('id', this.user.id);

        if (error) throw error;

        // Eğer bir veya daha fazla profil bulunduysa (normalde sadece 1 tane olmalı),
        // ilkini al ve 'user' objemize birleştir.
        if (profileData && profileData.length > 0) {
            this.user = { ...this.user, profile: profileData[0] };
        } else {
            // Eğer profil bulunamadıysa, bu bir hata değildir. Sadece konsola bir uyarı yazdırırız.
            // Kullanıcı hala giriş yapmış durumdadır, sadece profil bilgileri eksiktir.
            console.warn(`Bu kullanıcı için profil bulunamadı: ${this.user.id}`);
        }
    } catch (error) {
        console.error("Profil bilgileri çekilirken hata oluştu:", error.message);
    }
},
        
        async forgotPassword(email) {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) {throw error};
            return data;
        },
        
        async resetPassword(newPassword) {
    try {
        // Bu fonksiyon, kullanıcının şifre sıfırlama linkine tıkladıktan sonra
        // gelen özel bir oturumda çalışır. Supabase, kimin şifresini
        // güncelleyeceğini bu geçici oturumdan anlar.
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {throw error};

        // Başarılı olduktan sonra, güvenlik için kullanıcıyı çıkış yaptır.
        await supabase.auth.signOut();
        
        return { message: "Şifreniz başarıyla sıfırlandı. Lütfen yeni şifrenizle giriş yapın." };

    } catch (error) {
        console.error("Şifre sıfırlama başarısız:", error);
        throw error.message || 'Bilinmeyen bir hata oluştu.';
    }
},
    },
});
