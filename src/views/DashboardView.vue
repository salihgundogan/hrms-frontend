<!-- src/views/DashboardView.vue -->

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useLeaveStore } from '../stores/leave.store';

const authStore = useAuthStore();
const leaveStore = useLeaveStore();

onMounted(() => {
  leaveStore.fetchLeaveRequests();
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
}
</script>

<template>
  <div>
    <h1 class="page-title">İzin Talepleri</h1>
    <div class="content-card">
      <div v-if="leaveStore.isLoading" class="loading-state">Yükleniyor...</div>
      <div v-else>
        <div v-if="leaveStore.leaveRequests.length === 0" class="empty-state">
          Henüz bir izin talebiniz yok.
        </div>
        <div v-else class="table-container">
          <table class="leaves-table">
            <thead>
              <tr>
                <th v-if="authStore.userRole !== 'employee'">Çalışan</th>
                <th>Başlangıç Tarihi</th>
                <th>Bitiş Tarihi</th>
                <th>Sebep</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in leaveStore.leaveRequests" :key="request.id">
                <td v-if="authStore.userRole !== 'employee'">
                    <div>{{ request.employee?.name || 'Bilinmiyor' }}</div>
                    <div class="employee-email">{{ request.employee?.email || '' }}</div>
                </td>
                <td>{{ formatDate(request.startDate) }}</td>
                <td>{{ formatDate(request.endDate) }}</td>
                <td>{{ request.reason }}</td>
                <td>
                  <span class="status-badge" :class="`status-${request.status}`">{{ request.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title{font-size:28px;font-weight:700;color:#111827;margin-bottom:24px}.content-card{background-color:white;padding:32px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}.loading-state,.empty-state{text-align:center;padding:60px;color:#6b7280}.table-container{overflow-x:auto}.leaves-table{width:100%;border-collapse:collapse;text-align:left}.leaves-table th,.leaves-table td{padding:16px 24px;border-bottom:1px solid #e5e7eb;vertical-align:middle}.leaves-table th{background-color:#f9fafb;font-size:12px;text-transform:uppercase;color:#6b7280;font-weight:600}.leaves-table tbody tr:last-child td{border-bottom:none}.employee-email{font-size:12px;color:#6b7280}.status-badge{padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:500;text-transform:capitalize}.status-pending{background-color:#fef3c7;color:#92400e}.status-approved{background-color:#d1fae5;color:#065f46}.status-rejected{background-color:#fee2e2;color:#991b1b}
</style>