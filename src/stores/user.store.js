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
                // DÜZELTME: Tablo adı küçük harfle 'users' olarak değiştirildi.
                const { data, error } = await supabase
                    .from('users')
                    .select('*');

                if (error) { throw error };
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
            if (!authStore.user) { return };

            this.isLoading = true;
            try {
                // DÜZELTME: Tablo adı küçük harfle 'users' olarak değiştirildi.
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('managerId', authStore.user.id);

                if (error) { throw error };
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