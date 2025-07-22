// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Router'ı import ediyoruz

const app = createApp(App)

app.use(createPinia()) // Önce Pinia'yı kur
app.use(router)      // Sonra Router'ı kur

app.mount('#app')
