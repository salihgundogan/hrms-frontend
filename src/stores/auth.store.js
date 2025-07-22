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
        async register(userData) {
            try {
                const formData = new FormData();
                formData.append('name', userData.name);
                formData.append('email', userData.email);
                formData.append('password', userData.password);
                if (userData.profileImage) {
                    formData.append('profileImage', userData.profileImage);
                }

                // DÜZELTME: Axios bir FormData objesi aldığında,
                // Content-Type başlığını tarayıcının otomatik olarak
                // doğru bir şekilde ayarlamasına izin veriyoruz.
                // Bu yüzden 'headers' bölümünü tamamen siliyoruz.
                const response = await apiClient.post(API_URLS.REGISTER, formData);
                
                return response.data.message;
            } catch (error) {
                console.error("Kayıt başarısız:", error);
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
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
        },
        async forgotPassword(email) {
            try {
                // Backend'deki /api/auth/forgot-password adresine istek gönderiyoruz.
                const response = await apiClient.post(API_URLS.FORGOT_PASSWORD, { email });
                // Başarılı olursa, sunucudan gelen mesajı geri döndürüyoruz.
                return response.data.message;
            } catch (error) {
                console.error("Şifre sıfırlama isteği başarısız:", error);
                // Hata mesajını, arayüzde göstermek için geri fırlatıyoruz.
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        },

        // --- YENİ EKLENEN ŞİFREYİ SIFIRLAMA EYLEMİ ---
        async resetPassword(token, password, passwordConfirm) {
            try {
                // Backend'deki /api/auth/reset-password/:token adresine istek gönderiyoruz.
                const response = await apiClient.put(`${API_URLS.RESET_PASSWORD}/${token}`, { password, passwordConfirm });
                // Başarılı olursa, sunucudan gelen mesajı geri döndürüyoruz.
                return response.data.message;
            } catch (error) {
                console.error("Şifre sıfırlama başarısız:", error);
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        }
    },
});