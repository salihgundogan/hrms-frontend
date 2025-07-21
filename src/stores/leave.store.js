import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { API_URLS } from '../services/apiUrls';

// yine pinia ile işlemler. sayfaya izin taleplerinin gelmesi ve güncel tutulması için
export const useLeaveStore = defineStore('leaves', {
    state: () => ({
        leaveRequests: [],
        isLoading: false,
    }),
    actions: {
        async fetchLeaveRequests() {
            this.isLoading = true;
            try {
                const response = await apiClient.get(API_URLS.LEAVES);
                this.leaveRequests = response.data.data;
            } catch (error) {
                console.error("İzin talepleri alınamadı:", error);
                this.leaveRequests = [];
            } finally {
                this.isLoading = false;
            }
        },
        async updateRequestStatus(requestId, newStatus) {
            try {
                // Backend'deki PUT /api/leaves/:id/status adresine istek gönderiyoruz.
                const response = await apiClient.put(`${API_URLS.LEAVES}/${requestId}/status`, { status: newStatus });
                
                // Başarılı olursa, arayüzdeki listeyi anında güncelleyelim.
                // Sayfayı yeniden yüklemeye gerek kalmadan, güncellenen talebi bul ve değiştir.
                const index = this.leaveRequests.findIndex(req => req.id === requestId);
                if (index !== -1) {
                    this.leaveRequests[index] = response.data.data;
                }
                
                return { success: true, message: 'Durum başarıyla güncellendi.' };
            } catch (error) {
                console.error("İzin durumu güncellenemedi:", error);
                // Hata mesajını, arayüzde göstermek için geri fırlatıyoruz.
                throw error.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
    },
});