// src/stores/auth.store.js
// src/stores/auth.store.js (Nihai Versiyon)
import { defineStore } from 'pinia';
import { supabase } from '../services/supabaseClient'; 
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        session: null,
        isResettingPassword: false, // YENİ: Şifre sıfırlama durum bayrağı

    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        userRole: (state) => state.user?.profile?.role, 
    },
    actions: {
        // Bu fonksiyon, uygulama başladığında SADECE BİR KEZ çağrılır.
        initialize() {
            supabase.auth.onAuthStateChange(async (event, session) => {
                // YENİ KONTROL: Eğer şifre sıfırlama işlemi aktifse, bu dinleyici hiçbir şey yapmasın.
                if (this.isResettingPassword) {
                    return;
                }
                
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
                    data: { name: userData.name }
                }
            });
            if (error) throw error;
            return data;
        },
        async login(email, password) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.push('/dashboard');
        },
        async logout() {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Logout error:', error);
            this.user = null;
            this.session = null;
            router.push('/login');
        },
        async fetchUserProfile() {
            if (!this.user) return;
            try {
                const { data: profile, error } = await supabase
                    .from('Users')
                    .select('role, profilePicture')
                    .eq('id', this.user.id)
                    .single();
                if (error) throw error;
                if (profile) {
                    this.user = { ...this.user, profile: profile };
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
                // 1. Bayrağı kaldır: Genel dinleyiciyi devre dışı bırak.
                this.isResettingPassword = true;
                
                // 2. Şifreyi güncelle.
                const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
                if (updateError) throw updateError;

                // 3. Güvenlik için çıkış yap.
                const { error: signOutError } = await supabase.auth.signOut();
                if (signOutError) throw signOutError;

                return { message: "Şifreniz başarıyla sıfırlandı. Lütfen yeni şifrenizle giriş yapın." };
            } catch (error) {
                console.error("Şifre sıfırlama başarısız:", error);
                throw error.message || 'Bilinmeyen bir hata oluştu.';
            } finally {
                // 4. Bayrağı indir: Genel dinleyiciyi tekrar aktif hale getir.
                this.isResettingPassword = false;
            }
        },
        
        
        

    },
});
