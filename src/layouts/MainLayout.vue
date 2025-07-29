<script setup>
import { ref } from 'vue'; // ref'i import ettiğinizden emin olun
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// EKSİK OLAN KISIM BURASIYDI
const isSidebarExpanded = ref(true); // Kenar çubuğunun başlangıç durumunu belirler (true = açık)

// Kenar çubuğunu açıp kapatacak fonksiyon
function toggleSidebar() {
  isSidebarExpanded.value = !isSidebarExpanded.value;
}
// ===================================

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ 'expanded': isSidebarExpanded }" @mouseenter="isSidebarExpanded = true"
      @mouseleave="isSidebarExpanded = false">
      <br><br><br>
      <br><br><br>
      <br><br><br>

      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item">
          <span class="icon">🏠</span>
          <span v-if="isSidebarExpanded" class="text">Ana Sayfa</span>
        </router-link>

        <router-link to="/profile" class="nav-item">
          <span class="icon">👤</span>
          <span v-if="isSidebarExpanded" class="text">Profilim</span>
        </router-link>

        <router-link v-if="authStore.userRole === 'manager' || authStore.userRole === 'hr_admin'" to="/team"
          class="nav-item">
          <span class="icon">👥</span>
          <span v-if="isSidebarExpanded" class="text">Ekip</span>
        </router-link>

        <router-link v-if="authStore.userRole === 'hr_admin'" to="/admin/leaves" class="nav-item">
          <span class="icon">📄</span>
          <span v-if="isSidebarExpanded" class="text">İzin Yönetimi</span>
        </router-link>
      </nav>

      <!-- DÜZELTME: Sidebar Footer geri eklendi -->
      <div class="sidebar-footer">
        <div v-if="authStore.user" class="user-info">
          <img v-if="authStore.user.profilePicture" :src="`http://localhost:5001${authStore.user.profilePicture}`"
            alt="Profil Resmi" class="avatar">

          <div v-if="isSidebarExpanded" class="user-details">
            <span class="user-name">{{ authStore.user.name }}</span>
            <span class="user-role">{{ authStore.user.role }}</span>
          </div>
        </div>

        <button @click="handleLogout" class="nav-item logout-button">
          <span class="icon">🚪</span> <span v-if="isSidebarExpanded" class="text">Çıkış Yap</span>
        </button>
      </div>
    </aside>

    <!-- DÜZELTME: Ana içerik alanından header kaldırıldı -->
    <main class="content">
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* YENİ AÇIK TEMA TASARIMI */
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  width: 90px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100%;
  z-index: 10;
}

.sidebar.expanded {
  width: 260px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 250px;
  box-sizing: border-box;
  white-space: nowrap;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-weight: bold;
  font-size: 28px;
  background-color: #eef2ff;
  color: #4338ca;
  border-radius: 12px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.sidebar.expanded .logo-icon {
  background-color: transparent;
  color: #312e81;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #312e81;
}

.nav-menu {
  flex-grow: 1;
  padding-top: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  margin: 0 10px;
  color: #4b5563;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: #eef2ff;
  color: #4338ca;
}

.nav-item .icon {
  font-size: 24px;
  min-width: 40px;
  text-align: center;
}

.nav-item .text {
  margin-left: 15px;
  font-weight: 500;
}

.router-link-exact-active {
  background-color: #4338ca;
  color: white;
}

/* DÜZELTME: Sidebar Footer stilleri geri eklendi */
.sidebar-footer {
  padding: 20px 10px;
  border-top: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-details {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  color: #1f2937;
  font-weight: 600;
  white-space: nowrap;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  text-transform: capitalize;
}

.logout-button {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}

.content {
  flex-grow: 1;
  margin-left: 90px;
  transition: margin-left 0.3s ease;
}

.sidebar.expanded~.content {
  margin-left: 260px;
}

/* DÜZELTME: Header kaldırıldığı için, padding artık page-content'te */
.page-content {
  padding: 40px;
}
</style>
