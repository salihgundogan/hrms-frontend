import { defineStore } from 'pinia';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from './auth.store';

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
                // Supabase Sorgusu: 'Users' tablosundan tüm satırları (*) seç.
                const { data, error } = await supabase
                    .from('Users')
                    .select('*');

                if (error) {throw error};
                this.users = data;
            } catch (error) {
                console.error("Tüm kullanıcılar alınamadı:", error.message);
                this.users = [];
            } finally {
                this.isLoading = false;
            }
        },
        
        // Sadece yöneticinin kendi ekibini getiren fonksiyon
        async fetchMyTeam() {
            const authStore = useAuthStore();
            if (!authStore.user) {return};

            this.isLoading = true;
            try {
                // Supabase Sorgusu: 'Users' tablosundan, 'managerId' sütunu
                // giriş yapmış yöneticinin ID'sine eşit olan tüm satırları seç.
                const { data, error } = await supabase
                    .from('Users')
                    .select('*')
                    .eq('managerId', authStore.user.id);

                if (error) {throw error};
                this.team = data;
            } catch (error) {
                console.error("Ekip üyeleri alınamadı:", error.message);
                this.team = [];
            } finally {
                this.isLoading = false;
            }
        }
    },
});