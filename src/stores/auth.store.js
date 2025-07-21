import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { API_URLS } from '../services/apiUrls';
import router from '../router';

// en önemli fonksiyonlar pinia ile işlemler yapılır
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role,
    },
    actions: {
        async login(email, password) {
            try {
                const response = await apiClient.post(API_URLS.LOGIN, { email, password });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUser();
                router.push('/dashboard');
            } catch (error) {
                console.error("Giriş başarısız:", error);
                throw error;
            }
        },
        async fetchUser() {
            if (this.token) {
                try {
                    const response = await apiClient.get(API_URLS.GET_ME);
                    this.user = response.data.user;
                } catch (error) {
                    console.error("Kullanıcı bilgileri alınamadı:", error);
                }
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            router.push('/login');
        },
        async updateProfile(updateData) {
            try {
                // API'mizdeki PUT /api/users/me adresine istek gönderiyoruz.
                const response = await apiClient.put(API_URLS.UPDATE_ME, updateData);
                
                // Başarılı olursa, store'daki 'user' objesini sunucudan gelen
                // en güncel veriyle değiştiriyoruz. Bu, arayüzün anında güncellenmesini sağlar.
                this.user = response.data.user;
                
                // Başarı mesajını, arayüzde göstermek için geri döndürüyoruz.
                return response.data.message;
            } catch (error) {
                console.error("Profil güncellenemedi:", error);
                // Hata mesajını, arayüzde göstermek için geri fırlatıyoruz.
                throw error.response.data.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
        async changePassword(passwordData) {
        try {
            // API'mizdeki PUT /api/users/me/change-password adresine istek gönderiyoruz.
            const response = await apiClient.put(API_URLS.CHANGE_PASSWORD, passwordData);
            return response.data.message; // Başarı mesajını geri döndür
        } catch (error) {
            console.error("Şifre güncellenemedi:", error);
            throw error.response.data.message || 'Bilinmeyen bir hata oluştu.';
        }
        },
        async verifyEmail(token) {
        try {
            // Backend'deki doğrulama API'sine istek gönderiyoruz.
            const response = await apiClient.get(`/auth/verify-email/${token}`);
            return { success: true, message: response.data.message };
        } catch (error) {
            throw error.response?.data?.message || 'Doğrulama sırasında bir hata oluştu.';
        }
    }
    },
});