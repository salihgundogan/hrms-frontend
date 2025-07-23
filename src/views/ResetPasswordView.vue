<!-- src/views/ResetPasswordView.vue (Nihai Versiyon) -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { supabase } from '../services/supabaseClient';

const authStore = useAuthStore();
const router = useRouter();

const password = ref('');
const passwordConfirm = ref('');

const isLoading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const isSessionReady = ref(false); // Yeni durum: Oturum hazır mı?

// Sayfa ilk yüklendiğinde, Supabase'in 'PASSWORD_RECOVERY' olayını dinle.
onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      console.log("Şifre sıfırlama oturumu başarıyla algılandı!");
      isSessionReady.value = true; // Oturum hazır, artık formu gösterebiliriz.
    }
  });
});

async function handleResetPassword() {
  error.value = null;
  successMessage.value = null;
  isLoading.value = true;

  if (password.value !== passwordConfirm.value) {
    error.value = 'Şifreler eşleşmiyor.';
    isLoading.value = false;
    return;
  }

  try {
    const result = await authStore.resetPassword(password.value);
    successMessage.value = result.message;

    // Başarılı olduktan 3 saniye sonra kullanıcıyı login'e yönlendir.
    setTimeout(() => {
        router.push('/login');
    }, 3000);

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
      <h1 class="title">Yeni Şifre Belirle</h1>
      
      <!-- Sadece oturum hazır olduğunda formu göster -->
      <div v-if="isSessionReady">
        <p class="subtitle">Lütfen yeni şifrenizi girin.</p>
        <form @submit.prevent="handleResetPassword">
          <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
          <div v-if="error" class="error-banner">{{ error }}</div>
          <div v-if="!successMessage">
            <div class="input-group">
              <label for="password">Yeni Şifre</label>
              <input type="password" id="password" v-model="password" required :disabled="isLoading">
            </div>
            <div class="input-group">
              <label for="passwordConfirm">Yeni Şifre (Tekrar)</label>
              <input type="password" id="passwordConfirm" v-model="passwordConfirm" required :disabled="isLoading">
            </div>
            <button type="submit" class="submit-button" :disabled="isLoading">
              <span v-if="!isLoading">Şifreyi Sıfırla</span>
              <span v-else>Sıfırlanıyor...</span>
            </button>
          </div>
        </form>
      </div>
      
      <!-- Oturum beklenirken veya bir hata varsa bunu göster -->
      <div v-else>
        <p class="subtitle">Oturum bilgileri yükleniyor...</p>
      </div>
      
      <div v-if="successMessage" class="extra-links">
        <router-link to="/login" class="link">Giriş ekranına geri dön</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Login sayfasındaki stillerin aynısını kullanıyoruz */
.form-container{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f3f4f6;font-family:'Inter',sans-serif}.form-box{background-color:white;padding:48px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.05);width:100%;max-width:420px;text-align:center}.title{font-size:28px;font-weight:700;color:#111827}.subtitle{color:#6b7280;margin-top:8px;margin-bottom:32px}.input-group{text-align:left;margin-bottom:24px}.input-group label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:8px}.input-group input{width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:16px;box-sizing:border-box;transition:all .2s ease}.input-group input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(59,130,246,.2)}.submit-button{width:100%;background-color:#2563eb;color:white;border:none;padding:14px 20px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.submit-button:hover:not(:disabled){background-color:#1d4ed8}.submit-button:disabled{background-color:#9ca3af;cursor:not-allowed}.success-banner{background-color:#d1fae5;color:#065f46;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.error-banner{background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.extra-links{margin-top:24px;font-size:14px}.link{color:#2563eb;text-decoration:none;font-weight:500;transition:color .2s ease}.link:hover{text-decoration:underline;color:#1d4ed8}
</style>