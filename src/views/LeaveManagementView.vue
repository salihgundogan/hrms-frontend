<!-- src/views/LeaveManagementView.vue -->

<script setup>
import { onMounted, ref } from 'vue';
import { useLeaveStore } from '../stores/leave.store';

const leaveStore = useLeaveStore();
const requestStatus = ref({});

onMounted(() => {
  leaveStore.fetchLeaveRequests();
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
}

async function handleStatusUpdate(request, newStatus) {
  requestStatus.value[request.id] = { success: null, error: null, loading: true };
  try {
    const result = await leaveStore.updateRequestStatus(request.id, newStatus);
    requestStatus.value[request.id].success = result.message;
  } catch (error) {
    requestStatus.value[request.id].error = error;
    leaveStore.fetchLeaveRequests(); 
  } finally {
    requestStatus.value[request.id].loading = false;
  }
}
</script>

<template>
  <div>
    <h1 class="page-title">Tüm İzin Taleplerini Yönet</h1>
    <div class="content-card">
      <div v-if="leaveStore.isLoading" class="loading-state">İzin talepleri yükleniyor...</div>
      <div v-else>
        <div v-if="leaveStore.leaveRequests.length === 0" class="empty-state">Sistemde hiç izin talebi bulunmamaktadır.</div>
        <div v-else class="table-container">
          <table class="leaves-table">
            <thead>
              <tr>
                <th>Çalışan</th>
                <th>Tarih Aralığı</th>
                <th>Sebep</th>
                <th>Durum / İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in leaveStore.leaveRequests" :key="request.id">
                <td>
                  <div>{{ request.employee?.name || 'Bilinmiyor' }}</div>
                  <div class="employee-email">{{ request.employee?.email || '' }}</div>
                </td>
                <td>{{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}</td>
                <td>{{ request.reason }}</td>
                <td>
                  <div class="action-cell-content">
                    <div class="status-selector-wrapper">
                      <select :value="request.status" @change="handleStatusUpdate(request, $event.target.value)" class="status-select" :class="`status-${request.status}`">
                        <option value="pending">Beklemede</option>
                        <option value="approved">Onaylandı</option>
                        <option value="rejected">Reddedildi</option>
                      </select>
                      <div v-if="requestStatus[request.id]?.loading" class="loader"></div>
                    </div>
                    <div v-if="requestStatus[request.id]?.error" class="status-error">{{ requestStatus[request.id].error }}</div>
                    <div v-if="requestStatus[request.id]?.success" class="status-success">{{ requestStatus[request.id].success }}</div>
                  </div>
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
.page-title{font-size:28px;font-weight:700;color:#111827;margin-bottom:24px}.content-card{background-color:white;padding:32px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}.loading-state,.empty-state{text-align:center;padding:60px;color:#6b7280}.table-container{overflow-x:auto}.leaves-table{width:100%;border-collapse:collapse;text-align:left}.leaves-table th,.leaves-table td{padding:16px 24px;border-bottom:1px solid #e5e7eb;vertical-align:top}.leaves-table th{background-color:#f9fafb;font-size:12px;text-transform:uppercase;color:#6b7280;font-weight:600}.employee-email{font-size:12px;color:#6b7280}.action-cell-content{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.status-selector-wrapper{display:flex;align-items:center;gap:10px}.status-select{padding:8px 12px;border-radius:8px;border:1px solid transparent;font-size:14px;font-weight:500;text-transform:capitalize;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-position:right 12px center;background-repeat:no-repeat;background-size:16px;background-image:url("data:image/svg+xml,%3csvg xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");padding-right:36px;cursor:pointer}.status-pending{background-color:#fef3c7;color:#92400e}.status-approved{background-color:#d1fae5;color:#065f46}.status-rejected{background-color:#fee2e2;color:#991b1b}.status-error,.status-success{font-size:12px}.status-error{color:#b91c1c}.status-success{color:#065f46}.loader{border:2px solid #f3f3f3;border-top:2px solid #4b5563;border-radius:50%;width:16px;height:16px;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
</style>