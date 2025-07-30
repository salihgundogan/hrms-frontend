import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth.store';
import './style.css'; // veya main.css

// Uygulamayı asenkron bir fonksiyon içinde başlatalım
async function startApp() {
    const app = createApp(App);

    // Önce Pinia'yı kur
    app.use(createPinia());

    // ÖNEMLİ: Auth store'u çağır ve ilk kontrolün bitmesini BEKLE
    const authStore = useAuthStore();
    await authStore.initialize();

    // Oturum kontrolü bittikten SONRA router'ı kur ve uygulamayı mount et
    app.use(router);
    app.mount('#app');
}

// Uygulamayı başlat
startApp();