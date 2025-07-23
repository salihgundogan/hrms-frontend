// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)
app.use(createPinia())

// Auth store'u çağır ve oturum dinleyicisini BAŞLAT.
const authStore = useAuthStore();
authStore.initialize();

app.use(router)
app.mount('#app')