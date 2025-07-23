import { defineStore } from 'pinia';
import { supabase } from '../services/supabaseClient';

export const useLeaveStore = defineStore('leaves', {
    state: () => ({
        leaveRequests: [],
        isLoading: false,
    }),
    actions: {
        async fetchLeaveRequests() {
            this.isLoading = true;
            try {
                // Supabase Sorgusu: 'LeaveRequests' tablosundan tüm satırları seç.
                // '*' yerine, '*, employee:Users(name, email)' gibi bir ifadeyle,
                // ilişkili kullanıcı bilgilerini de tek bir istekte getirebiliriz.
                const { data, error } = await supabase
                    .from('LeaveRequests')
                    .select(`
                        *,
                        employee: Users ( name, email )
                    `);

                if (error) {throw error};
                this.leaveRequests = data;
            } catch (error) {
                console.error("İzin talepleri alınamadı:", error.message);
                this.leaveRequests = [];
            } finally {
                this.isLoading = false;
            }
        },
        
        async updateRequestStatus(requestId, newStatus) {
            try {
                // Supabase Sorgusu: 'LeaveRequests' tablosunda, 'id'si
                // bizim verdiğimiz ID'ye eşit olan satırı bul ve 'status' sütununu güncelle.
                const { data, error } = await supabase
                    .from('LeaveRequests')
                    .update({ status: newStatus })
                    .eq('id', requestId)
                    .select() // Güncellenmiş satırı geri döndür
                    .single(); // Sadece tek bir satırın güncellendiğinden emin ol

                if (error) {throw error};

                // Arayüzdeki listeyi anında güncelle
                const index = this.leaveRequests.findIndex(req => req.id === requestId);
                if (index !== -1) {
                    // Supabase, ilişkili veriyi (employee) update'te geri döndürmez,
                    // bu yüzden eski veriyi koruyarak sadece status'u güncelliyoruz.
                    this.leaveRequests[index].status = data.status;
                }
                
                return { success: true, message: 'Durum başarıyla güncellendi.' };
            } catch (error) {
                console.error("İzin durumu güncellenemedi:", error.message);
                throw error.message || 'Bilinmeyen bir hata oluştu.';
            }
        },
    },
});