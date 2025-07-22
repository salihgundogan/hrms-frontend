// src/stores/auth.store.js

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
                const response = await apiClient.put(API_URLS.UPDATE_ME, updateData);
                this.user = response.data.user;
                return response.data.message;
            } catch (error) {
                console.error("Profil güncellenemedi:", error);
                throw error.response.data.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
        async changePassword(passwordData) {
            try {
                const response = await apiClient.put(API_URLS.CHANGE_PASSWORD, passwordData);
                return response.data.message;
            } catch (error) {
                console.error("Şifre güncellenemedi:", error);
                throw error.response.data.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
        async verifyEmail(token) {
            try {
                // DÜZELTME: Adresi artık merkezi yerden alıyoruz.
                const response = await apiClient.get(`${API_URLS.VERIFY_EMAIL}/${token}`);
                return { success: true, message: response.data.message };
            } catch (error) {
                throw error.response?.data?.message || 'Doğrulama sırasında bir hata oluştu.';
            }
        },
        async forgotPassword(email) {
            try {
                const response = await apiClient.post(API_URLS.FORGOT_PASSWORD, { email });
                return response.data.message;
            } catch (error) {
                console.error("Şifre sıfırlama isteği başarısız:", error);
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
        async resetPassword(token, password, passwordConfirm) {
            try {
                // DÜZELTME: Adresi artık merkezi yerden alıyoruz.
                const response = await apiClient.put(`${API_URLS.RESET_PASSWORD}/${token}`, { password, passwordConfirm });
                return response.data.message;
            } catch (error) {
                console.error("Şifre sıfırlama başarısız:", error);
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        }
    },
});
