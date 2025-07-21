<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();
//sayfa ilk açıldığında veya yenilendiğinde bilgileri tekrar teyit et
onMounted(() => {
    if (authStore.isAuthenticated) {
        authStore.fetchUser();
    }
});
</script>

<template>
  <router-view />
</template>
