// src/stores/leave.store.js

import { defineStore } from 'pinia';
import { supabase } from '@/services/supabaseClient';
import { useAuthStore } from './auth.store'; // Auth store'u da kullanacağız

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
          // DÜZELTME: Tablo adı küçük harfle yazıldı
          .from('leaverequests')
          // İlişkili tablodan da veri çekiyoruz: users tablosundan isim ve email.
          .select('*, employee:users ( name, email )');

        if (error) {throw error};
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
      if (!authStore.user) {throw new Error("İzin talebi oluşturmak için giriş yapmalısınız.")};

      const newRequest = {
        ...requestInfo,
        employeeId: authStore.user.id // Giriş yapan kullanıcının ID'sini ekle
      };

      const { data, error } = await supabase
        // DÜZELTME: Tablo adı küçük harfle yazıldı
        .from('leaverequests')
        .insert([newRequest])
        .select();

      if (error) {throw error};

      // Yeni talebi lokal listeye de ekle
      this.leaveRequests.push(data[0]);
      return data[0];
    }, async updateRequestStatus(requestId, newStatus) {
      const { data, error } = await supabase
        .from('LeaveRequests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {throw error};
      // Lokal state'i de güncelleyelim
      const index = this.leaveRequests.findIndex(req => req.id === requestId);
      if (index !== -1) {
        this.leaveRequests[index].status = newStatus;
      }
      return data;
    },
  },
});