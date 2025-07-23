<!-- src/views/LoginView.vue -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

async function handleLogin() {
  error.value = null;
  isLoading.value = true;
  try {
    // Artık Supabase'i çağıran store eylemini kullanıyoruz.
    await authStore.login(email.value, password.value);
    // Yönlendirme işlemini artık store'un kendisi yapıyor.
  } catch (err) {
    error.value = err.message || 'Bilinmeyen bir hata oluştu.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">İK Portalı</h1>
      <p class="subtitle">Devam etmek için lütfen giriş yapın.</p>
      <form @submit.prevent="handleLogin">
        <div v-if="error" class="error-banner">{{ error }}</div>
        <div class="input-group">
          <label for="email">E-posta Adresi</label>
          <input type="email" id="email" v-model="email" placeholder="ornek@sirket.com" required :disabled="isLoading">
        </div>
        <div class="input-group">
          <label for="password">Şifre</label>
          <input type="password" id="password" v-model="password" placeholder="••••••••" required :disabled="isLoading">
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Giriş Yap</span>
          <span v-else class="loader"></span>
        </button>
      </form>
      
      <!-- === GÜNCELLENEN KISIM === -->
      <div class="extra-links">
        <router-link to="/register" class="link">Hesabınız yok mu? Kayıt olun</router-link>
        <!-- DÜZELTME: Artık bu da bir router-link -->
        <router-link to="/forgot-password" class="link">Şifremi unuttum</router-link>
      </div>
      <!-- ========================== -->

    </div>
  </div>
</template>

<style scoped>
/* Stillerin çoğu aynı, sadece yeni eklenen linkler için stil var */
.login-container{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f3f4f6;font-family:'Inter',sans-serif}.login-box{background-color:white;padding:48px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.05);width:100%;max-width:420px;text-align:center}.title{font-size:28px;font-weight:700;color:#111827}.subtitle{color:#6b7280;margin-top:8px;margin-bottom:32px}.input-group{text-align:left;margin-bottom:24px}.input-group label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:8px}.input-group input{width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:16px;box-sizing:border-box;transition:all .2s ease}.input-group input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(59,130,246,.2)}.login-button{width:100%;background-color:#2563eb;color:white;border:none;padding:14px 20px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease;display:flex;justify-content:center;align-items:center}.login-button:hover:not(:disabled){background-color:#1d4ed8}.login-button:disabled{background-color:#9ca3af;cursor:not-allowed}.error-banner{background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.loader{border:4px solid #f3f3f3;border-top:4px solid #fff;border-radius:50%;width:24px;height:24px;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}

/* === YENİ EKLENEN STİLLER === */
.extra-links {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}
.link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}
.link:hover {
  text-decoration: underline;
  color: #1d4ed8;
}
</style>
