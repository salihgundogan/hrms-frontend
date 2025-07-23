<!-- src/views/ProfileView.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const passwordConfirm = ref('');
const infoLoading = ref(false);
const infoSuccess = ref(null);
const infoError = ref(null);
const passwordLoading = ref(false);
const passwordSuccess = ref(null);
const passwordError = ref(null);

onMounted(() => {
    if (authStore.user) {
        name.value = authStore.user.name;
        email.value = authStore.user.email;
    }
});

async function handleProfileUpdate() {
    infoLoading.value = true;
    infoSuccess.value = null;
    infoError.value = null;
    try {
        const message = await authStore.updateProfile({ name: name.value, email: email.value });
        infoSuccess.value = message;
    } catch (error) {
        infoError.value = error;
    } finally {
        infoLoading.value = false;
    }
}

async function handleChangePassword() {
    passwordLoading.value = true;
    passwordSuccess.value = null;
    passwordError.value = null;
    try {
        const passwordData = { oldPassword: oldPassword.value, newPassword: newPassword.value, passwordConfirm: passwordConfirm.value };
        const message = await authStore.changePassword(passwordData);
        passwordSuccess.value = message;
        oldPassword.value = '';
        newPassword.value = '';
        passwordConfirm.value = '';
    } catch (error) {
        passwordError.value = error;
    } finally {
        passwordLoading.value = false;
    }
}
</script>

<template>
  <div>
    <h1 class="page-title">Profil Yönetimi</h1>
    <div class="content-card">
      <h2 class="card-title">Kişisel Bilgiler</h2>
      <form @submit.prevent="handleProfileUpdate">
        <div v-if="infoSuccess" class="success-banner">{{ infoSuccess }}</div>
        <div v-if="infoError" class="error-banner">{{ infoError }}</div>
        <div class="input-group">
          <label for="name">İsim Soyisim</label>
          <input type="text" id="name" v-model="name" required :disabled="infoLoading">
        </div>
        <div class="input-group">
          <label for="email">E-posta Adresi</label>
          <input type="email" id="email" v-model="email" required :disabled="infoLoading">
        </div>
        <button type="submit" class="submit-button" :disabled="infoLoading">
          <span v-if="!infoLoading">Bilgileri Güncelle</span>
          <span v-else>Güncelleniyor...</span>
        </button>
      </form>
    </div>
    <div class="content-card">
      <h2 class="card-title">Şifre Değiştir</h2>
      <form @submit.prevent="handleChangePassword">
        <div v-if="passwordSuccess" class="success-banner">{{ passwordSuccess }}</div>
        <div v-if="passwordError" class="error-banner">{{ passwordError }}</div>
        <div class="input-group">
          <label for="oldPassword">Mevcut Şifre</label>
          <input type="password" id="oldPassword" v-model="oldPassword" required :disabled="passwordLoading">
        </div>
        <div class="input-group">
          <label for="newPassword">Yeni Şifre</label>
          <input type="password" id="newPassword" v-model="newPassword" required :disabled="passwordLoading">
        </div>
        <div class="input-group">
          <label for="passwordConfirm">Yeni Şifre (Tekrar)</label>
          <input type="password" id="passwordConfirm" v-model="passwordConfirm" required :disabled="passwordLoading">
        </div>
        <button type="submit" class="submit-button" :disabled="passwordLoading">
          <span v-if="!passwordLoading">Şifreyi Değiştir</span>
          <span v-else>Değiştiriliyor...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-title{font-size:28px;font-weight:700;color:#111827;margin-bottom:24px}.content-card{background-color:white;padding:32px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);max-width:600px;margin-bottom:30px}.card-title{font-size:20px;font-weight:600;color:#1f2937;margin-bottom:24px}.input-group{margin-bottom:20px}.input-group label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:8px}.input-group input{width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:16px;box-sizing:border-box}.submit-button{background-color:#2563eb;color:white;border:none;padding:12px 20px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.submit-button:hover:not(:disabled){background-color:#1d4ed8}.submit-button:disabled{background-color:#9ca3af;cursor:not-allowed}.success-banner,.error-banner{padding:12px;border-radius:8px;margin-bottom:24px;text-align:center;font-size:14px}.success-banner{background-color:#d1fae5;color:#065f46}.error-banner{background-color:#fee2e2;color:#991b1b}
</style>