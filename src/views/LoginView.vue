<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Yönlendiriciyi kullanmak için import et
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter(); // Yönlendiriciyi değişkene ata

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    // 1. Giriş işlemini bekle
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    
    // 2. EN ÖNEMLİ KISIM: Giriş başarılı olduktan sonra, Dashboard'a yönlendir.
    router.push({ name: 'Dashboard' });

  } catch (error) {
    errorMessage.value = error.message || 'Bir hata oluştu.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">İK Portalı</h1>
      <p class="subtitle">Devam etmek için lütfen giriş yapın.</p>
      
      <form @submit.prevent="handleLogin">

        <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
        
        <div class="input-group">
          <label for="email">E-posta Adresi</label>
          <input type="email" id="email" v-model="email" placeholder="ornek@sirket.com" required :disabled="loading">
        </div>
        
        <div class="input-group">
          <label for="password">Şifre</label>
           <input type="password" id="password" v-model="password" placeholder="••••••••" required :disabled="loading">
        </div>
        
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">Giriş Yap</span>
          <span v-else class="loader"></span> </button>
      </form>
      
      <div class="extra-links">
        <router-link to="/register" class="link">Hesabınız yok mu? Kayıt olun</router-link>
        <router-link to="/forgot-password" class="link">Şifremi unuttum</router-link>
      </div>

    </div>
  </div>
</template>
<style scoped>
/* Genel Konteyner ve Arka Plan */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Giriş Kutusu */
.login-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-sizing: border-box;
}

/* Başlık ve Alt Başlık */
.title {
  font-size: 28px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6a6a6e;
  margin-bottom: 30px;
}

/* Form Elemanları */
.input-group {
  text-align: left;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #3c3c3f;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdce1;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.input-group input:disabled {
  background-color: #f8f8f8;
  cursor: not-allowed;
}


/* Giriş Butonu ve Yüklenme Animasyonu */
.login-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Sabit yükseklik */
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-button:active:not(:disabled) {
  transform: scale(0.98);
}

.login-button:disabled {
  background-color: #a0c7ff;
  cursor: not-allowed;
}

/* Basit Yüklenme Animasyonu (Spinner) */
.loader {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* Ekstra Linkler */
.extra-links {
  margin-top: 25px;
  font-size: 14px;
}

.extra-links .link {
  color: #007aff;
  text-decoration: none;
  margin: 0 10px;
  transition: text-decoration 0.3s;
}

.extra-links .link:hover {
  text-decoration: underline;
}


/* Hata Mesajı Banner'ı */
.error-banner {
  background-color: #ffebee;
  border: 1px solid #ef5350;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

/* Mobil Cihazlar için Ayarlamalar */
@media (max-width: 480px) {
  .login-box {
    padding: 25px;
  }
}

</style>