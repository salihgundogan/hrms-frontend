// src/stores/leave.store.js

import { defineStore } from 'pinia';
import { supabase } from '@/services/supabaseClient';

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaveRequests: [],
  }),
  actions: {
    // GÜNCELLENDİ: İzin taleplerini çek
    // Supabase'de tanımlayacağımız Row Level Security (RLS) kuralları sayesinde
    // bu tek fonksiyon her rol için doğru veriyi getirecektir.
    async fetchLeaveRequests() {
      // İlişkili tablodan da veri çekiyoruz: Users tablosundan isim ve email.
      const { data, error } = await supabase
        .from('LeaveRequests')
        .select('*, employee:Users ( name, email )'); 
        
      if (error) throw error;
      this.leaveRequests = data;
    },

    // GÜNCELLENDİ: Talep durumunu güncelle (Manager veya HR Admin için)
    async updateRequestStatus(requestId, newStatus) {
      const { data, error } = await supabase
        .from('LeaveRequests')
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (error) throw error;
      // Lokal state'i de güncelleyelim
      const index = this.leaveRequests.findIndex(req => req.id === requestId);
      if (index !== -1) {
        this.leaveRequests[index].status = newStatus;
      }
      return data;
    },
    
    // YENİ: Yeni izin talebi oluştur
    async createLeaveRequest(requestInfo) {
        const { data, error } = await supabase
            .from('LeaveRequests')
            .insert([requestInfo]); // requestInfo: { employeeId, startDate, endDate, reason }
        
        if (error) throw error;
        // Yeni talebi lokal listeye ekle
        this.leaveRequests.push(data[0]);
        return data;
    }
  },
});