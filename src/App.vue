<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();
// Sayfa ilk yüklendiğinde veya yenilendiğinde, token varsa kullanıcı bilgilerini tekrar çek.
// Bu, "sayfa yenilenince bilgi kaybolmasın" isteğini karşılar.
onMounted(() => {
    if (authStore.isAuthenticated) {
        authStore.fetchUser();
    }
});
</script>

<template>
  <!-- Bu, router'ın o anki sayfayı (Login, Dashboard vb.) göstereceği yerdir -->
  <router-view />
</template>

<style>
/* Genel stiller burada kalabilir veya src/style.css'e taşınabilir */
</style>
