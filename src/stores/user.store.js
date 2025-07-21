import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { API_URLS } from '../services/apiUrls';

export const useUserStore = defineStore('users', {
    state: () => ({
        users: [], // HR Admin için tüm kullanıcılar
        team: [],  // Yönetici için ekip üyeleri
        isLoading: false,
    }),
    actions: {
        // Tüm kullanıcıları getiren fonksiyon (HR Admin için)
        async fetchAllUsers() {
            this.isLoading = true;
            try {
                const response = await apiClient.get(API_URLS.GET_ALL_USERS);
                this.users = response.data.users;
            } catch (error) {
                console.error("Tüm kullanıcılar alınamadı:", error);
                this.users = [];
            } finally {
                this.isLoading = false;
            }
        },
        
        // --- YENİ EKLENEN EKİBİMİ GETİR EYLEMİ ---
        // Sadece yöneticinin kendi ekibini getiren fonksiyon
        async fetchMyTeam() {
            this.isLoading = true;
            try {
                const response = await apiClient.get(API_URLS.GET_MY_TEAM);
                this.team = response.data.users;
            } catch (error) {
                console.error("Ekip üyeleri alınamadı:", error);
                this.team = [];
            } finally {
                this.isLoading = false;
            }
        }
    },
});