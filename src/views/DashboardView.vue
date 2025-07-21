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
  <div class="dashboard-container">
    <main class="main-content">
      <h2 class="section-title">İzin Talepleri</h2>
      
      <div v-if="!leaveStore.isLoading && leaveStore.leaveRequests.length > 0" class="table-container">
          <table class="leaves-table">
            <thead>
              <tr>
                <th v-if="authStore.userRole === 'manager' || authStore.userRole === 'hr_admin'">Çalışan</th>
                <th>Başlangıç Tarihi</th>
                <th>Bitiş Tarihi</th>
                <th>Sebep</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in leaveStore.leaveRequests" :key="request.id">
                <td v-if="authStore.userRole === 'manager' || authStore.userRole === 'hr_admin'">
                    <div>{{ request.employee?.name || 'Bilinmiyor' }}</div>
                    <div class="employee-email">{{ request.employee?.email || '' }}</div>
                </td>
                <td>{{ formatDate(request.startDate) }}</td>
                <td>{{ formatDate(request.endDate) }}</td>
                <td>{{ request.reason }}</td>
                <td>
                  <span class="status-badge" :class="`status-${request.status}`">
                    {{ request.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </main>
  </div>
</template>

<style scoped>
/* Bu stiller, profesyonel bir dashboard görünümü sağlar */
.dashboard-container{min-height:100vh;background-color:#f9fafc;font-family:'Inter',sans-serif}
.header{background-color:white;padding:0 40px;height:70px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb}.logo{font-size:20px;font-weight:700;color:#111827}
.navigation{display:flex;gap:20px}.nav-link{color:#374151;font-weight:500;text-decoration:none;transition:color .2s}
.nav-link:hover,.router-link-exact-active{color:#2563eb}.user-profile{display:flex;align-items:center;gap:20px;color:#374151}
.logout-button{background-color:#ef4444;color:white;border:none;padding:8px 16px;border-radius:6px;font-weight:500;cursor:pointer;transition:background-color .2s}
.logout-button:hover{background-color:#dc2626}.main-content{padding:40px;max-width:1200px;margin:0 auto}
.section-title{font-size:24px;font-weight:600;color:#111827;margin-bottom:24px}.loading-state,.empty-state{text-align:center;padding:60px;background-color:#fff;border-radius:8px;border:1px solid #e5e7eb;color:#6b7280}
.table-container{background-color:white;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden}.leaves-table{width:100%;border-collapse:collapse;text-align:left}
.leaves-table th,.leaves-table td{padding:16px 24px;border-bottom:1px solid #e5e7eb}.leaves-table th{background-color:#f9fafb;font-size:12px;text-transform:uppercase;color:#6b7280;font-weight:600}
.leaves-table tbody tr:last-child td{border-bottom:none}.status-badge{padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:500;text-transform:capitalize}
.status-pending{background-color:#fef3c7;color:#92400e}.status-approved{background-color:#d1fae5;color:#065f46}.status-rejected{background-color:#fee2e2;color:#991b1b}.employee-email {
  font-size: 12px;
  color: #6b7280;
}
</style>