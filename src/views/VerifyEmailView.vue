<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const route = useRoute();
const authStore = useAuthStore();

const statusMessage = ref('Hesabınız doğrulanıyor, lütfen bekleyin...');
const isSuccess = ref(false);

// Sayfa ilk yüklendiğinde, URL'den token'ı al ve doğrulama işlemini başlat.
onMounted(async () => {
    const token = route.params.token;
    if (token) {
        try {
            const result = await authStore.verifyEmail(token);
            statusMessage.value = result.message;
            isSuccess.value = true;
        } catch (error) {
            statusMessage.value = error;
            isSuccess.value = false;
        }
    } else {
        statusMessage.value = 'Geçersiz doğrulama linki.';
        isSuccess.value = false;
    }
});
</script>

<template>
  <div class="verify-container">
    <div class="verify-box">
      <h1 class="title">Hesap Doğrulama</h1>
      <p class="status-message" :class="{ 'success': isSuccess, 'error': !isSuccess }">
        {{ statusMessage }}
      </p>
      <router-link v-if="isSuccess" to="/login" class="login-link">
        Giriş Yapmak İçin Tıklayın
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.verify-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; font-family: 'Inter', sans-serif; }
.verify-box { background-color: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); width: 100%; max-width: 500px; text-align: center; }
.title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 24px; }
.status-message { font-size: 16px; margin-bottom: 32px; }
.success { color: #065f46; }
.error { color: #991b1b; }
.login-link { background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background-color 0.3s ease; }
.login-link:hover { background-color: #1d4ed8; }
</style>