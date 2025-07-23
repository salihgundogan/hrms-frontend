<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const email = ref('');
const isLoading = ref(false);
const error = ref(null);
const successMessage = ref(null);

async function handleForgotPassword() {
  error.value = null;
  successMessage.value = null;
  isLoading.value = true;

  try {
    const message = await authStore.forgotPassword(email.value);
    successMessage.value = message;
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="form-container">
    <div class="form-box">
      <h1 class="title">Şifremi Unuttum</h1>
      <p class="subtitle">Lütfen kayıtlı e-posta adresinizi girin. Size bir sıfırlama linki göndereceğiz.</p>
      
      <form @submit.prevent="handleForgotPassword">
        <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
        <div v-if="error" class="error-banner">{{ error }}</div>

        <!-- Sadece başarı mesajı yoksa formu göster -->
        <div v-if="!successMessage">
          <div class="input-group">
            <label for="email">E-posta Adresi</label>
            <input type="email" id="email" v-model="email" placeholder="ornek@sirket.com" required :disabled="isLoading">
          </div>
          <button type="submit" class="submit-button" :disabled="isLoading">
            <span v-if="!isLoading">Sıfırlama Linki Gönder</span>
            <span v-else>Gönderiliyor...</span>
          </button>
        </div>
      </form>
      
      <div class="extra-links">
        <router-link to="/login" class="link">Giriş ekranına geri dön</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Login sayfasındaki stillerin aynısını kullanıyoruz */
.form-container{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f3f4f6;font-family:'Inter',sans-serif}.form-box{background-color:white;padding:48px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.05)
  ;width:100%;max-width:420px;text-align:center}.title{font-size:28px;font-weight:700;color:#111827}.subtitle{color:#6b7280;margin-top:8px;margin-bottom:32px}
.input-group{text-align:left;margin-bottom:24px}.input-group label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:8px}.input-group input{width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:16px;box-sizing:border-box;transition:all .2s ease}
.input-group input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(59,130,246,.2)}.submit-button{width:100%;background-color:#2563eb;color:white;border:none;padding:14px 20px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.submit-button:hover:not(:disabled){background-color:#1d4ed8}
.submit-button:disabled{background-color:#9ca3af;cursor:not-allowed}.success-banner{background-color:#d1fae5;color:#065f46;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.error-banner{background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}
.extra-links{margin-top:24px;font-size:14px}.link{color:#2563eb;text-decoration:none;font-weight:500;transition:color .2s ease}.link:hover{text-decoration:underline;color:#1d4ed8}
</style>