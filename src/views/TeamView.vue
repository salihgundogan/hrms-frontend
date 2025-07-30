<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useUserStore } from '../stores/user.store';

const authStore = useAuthStore();
const userStore = useUserStore();

onMounted(() => {
  // DÜZELTME: Artık doğru değişken olan authStore.user.role'ü kullanıyoruz.
  // Daha da iyisi, store'daki reaktif getter'ları (isHrAdmin, isManager) kullanalım.
  if (authStore.isHrAdmin) {
    userStore.fetchAllUsers();
  } else if (authStore.isManager) {
    userStore.fetchMyTeam();
  }
});

const displayedUsers = computed(() => {
  // DÜZELTME: Burada da getter'ları kullanıyoruz.
  if (authStore.isHrAdmin) {
    return userStore.users;
  } else if (authStore.isManager) {
    return userStore.team;
  }
  return [];
});

const pageTitle = computed(() => {
  // DÜZELTME: Burada da getter'ları kullanıyoruz.
  return authStore.isHrAdmin ? 'Tüm Çalışanlar' : 'Ekibim';
});
</script>

<template>
  <div>
    <h1 class="page-title">{{ pageTitle }}</h1>
    <div class="content-card">
      <div v-if="userStore.isLoading" class="loading-state">Kullanıcılar yükleniyor...</div>
      <div v-else>
        <div v-if="!displayedUsers || displayedUsers.length === 0" class="empty-state">
          Gösterilecek kullanıcı bulunmamaktadır.
        </div>
        <div v-else class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>Profil</th>
                <th>İsim</th>
                <th>E-posta</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in displayedUsers" :key="user.id">
                <td>
                  <img v-if="user.profilePicture" :src="`http://localhost:5001${user.profilePicture}`" alt="Profil Resmi" class="avatar">
                </td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="role-badge">{{ user.role }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title{font-size:28px;font-weight:700;color:#111827;margin-bottom:24px}.content-card{background-color:white;padding:32px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}.loading-state,.empty-state{text-align:center;padding:60px;color:#6b7280}.table-container{overflow-x:auto}.users-table{width:100%;border-collapse:collapse;text-align:left}.users-table th,.users-table td{padding:16px 24px;border-bottom:1px solid #e5e7eb;vertical-align:middle}.users-table th{background-color:#f9fafb;font-size:12px;text-transform:uppercase;color:#6b7280;font-weight:600}.users-table tbody tr:last-child td{border-bottom:none}.avatar{width:40px;height:40px;border-radius:50%;object-fit:cover}.role-badge{padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:500;text-transform:capitalize;background-color:#e0e7ff;color:#4338ca}
</style>