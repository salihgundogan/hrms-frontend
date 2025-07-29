import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth.store';
import './style.css'; // veya main.css

// Uygulamayı asenkron bir fonksiyon içinde başlatalım
async function startApp() {
  const app = createApp(App);
  app.use(createPinia());

  // ÖNEMLİ: Auth store'u çağır ve ilk kontrolü yap
  const authStore = useAuthStore();
  await authStore.initialize();

  app.use(router);
  app.mount('#app');
}

startApp();