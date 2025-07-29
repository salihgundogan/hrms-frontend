import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css'; // Veya sizin genel stil dosyanız

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');