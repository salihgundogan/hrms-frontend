<!-- src/views/RegisterView.vue (Nihai Versiyon) -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);
const successMessage = ref(null);

async function handleRegister() {
  error.value = null;
  successMessage.value = null;
  isLoading.value = true;
  try {
    const userData = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    await authStore.register(userData);
    successMessage.value = "Kayıt başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin.";
  } catch (err) {
    error.value = err.message || 'Bilinmeyen bir hata oluştu.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="title">Yeni Hesap Oluştur</h1>
      <p class="subtitle">İK Portalı'na katılın.</p>
      <form @submit.prevent="handleRegister">
        <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
        <div v-if="error" class="error-banner">{{ error }}</div>
        <div class="input-group">
          <label for="name">İsim Soyisim</label>
          <input type="text" id="name" v-model="name" required :disabled="isLoading">
        </div>
        <div class="input-group">
          <label for="email">E-posta Adresi</label>
          <input type="email" id="email" v-model="email" required :disabled="isLoading">
        </div>
        <div class="input-group">
          <label for="password">Şifre</label>
          <input type="password" id="password" v-model="password" required :disabled="isLoading">
        </div>
        <button type="submit" class="register-button" :disabled="isLoading">
          <span v-if="!isLoading">Kayıt Ol</span>
          <span v-else>Kaydediliyor...</span>
        </button>
      </form>
      <div class="extra-links">
        <router-link to="/login" class="link">Zaten bir hesabınız var mı? Giriş yapın</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Login sayfasındaki stillerin aynısını kullanıyoruz */
.register-container{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f3f4f6;font-family:'Inter',sans-serif;padding:20px 0;}.register-box{background-color:white;padding:48px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.05);width:100%;max-width:420px;text-align:center}.title{font-size:28px;font-weight:700;color:#111827}.subtitle{color:#6b7280;margin-top:8px;margin-bottom:32px}.input-group{text-align:left;margin-bottom:24px}.input-group label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:8px}.input-group input{width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:16px;box-sizing:border-box;transition:all .2s ease}.input-group input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(59,130,246,.2)}.register-button{width:100%;background-color:#2563eb;color:white;border:none;padding:14px 20px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease;display:flex;justify-content:center;align-items:center}.register-button:hover:not(:disabled){background-color:#1d4ed8}.register-button:disabled{background-color:#9ca3af;cursor:not-allowed}.success-banner{background-color:#d1fae5;color:#065f46;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.error-banner{background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.extra-links{margin-top:24px;font-size:14px}.link{color:#2563eb;text-decoration:none;font-weight:500;transition:color .2s ease}.link:hover{text-decoration:underline;color:#1d4ed8}
</style>
