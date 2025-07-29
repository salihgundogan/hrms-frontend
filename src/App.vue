<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

// App.vue bileşeni ilk yüklendiği anda, oturum kontrolünü başlat.
onMounted(() => {
  authStore.initialize();
});
</script>

<template>
  <div v-if="authStore.loading" class="app-loading-screen">
    <span>Oturum bilgileri doğrulanıyor...</span>
  </div>
  
  <router-view v-else />
</template>

<style>
/* Yükleme ekranını sayfanın ortasında göstermek için */
.app-loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 1.2rem;
  color: #4a5568;
}
</style>