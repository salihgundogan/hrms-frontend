// src/stores/leave.store.js

import { defineStore } from 'pinia';
import { supabase } from '@/services/supabaseClient';
import { useAuthStore } from './auth.store';

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaveRequests: [],
    loading: false,
    error: null,
  }),
  actions: {
    // İzin taleplerini çeken fonksiyon
    async fetchLeaveRequests() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('leaverequests')
          .select('*, employee:users ( name, email )');

        if (error) throw error;
        this.leaveRequests = data;
      } catch (err) {
        this.error = err.message;
        console.error('İzin talepleri çekilirken hata:', err);
      } finally {
        this.loading = false;
      }
    },

    // Yeni izin talebi oluşturma fonksiyonu
    async createLeaveRequest(requestInfo) {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error("İzin talebi oluşturmak için giriş yapmalısınız.");

      const newRequest = {
        ...requestInfo,
        employeeId: authStore.user.id
      };

      const { data, error } = await supabase
        .from('leaverequests')
        .insert([newRequest])
        .select();

      if (error) throw error;

      this.leaveRequests.push(data[0]);
      return data[0];
    },

    // İzin durumunu güncelleyen DOĞRU fonksiyon
    async updateLeaveStatus(requestId, newStatus) {
      try {
        const { data, error } = await supabase
          .from('leaverequests')
          .update({ status: newStatus })
          .eq('id', requestId)
          .select()
          .single();

        if (error) throw error;

        const index = this.leaveRequests.findIndex(req => req.id === requestId);
        if (index !== -1) {
          this.leaveRequests[index].status = newStatus;
        }

        return data;

      } catch (err) {
        console.error('İzin durumu güncellenirken hata:', err.message);
        throw err;
      }
    },

    // YANLIŞ olan updateRequestStatus fonksiyonu SİLİNDİ.
  },
});