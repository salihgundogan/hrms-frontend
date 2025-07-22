import axios from 'axios';
import { API_URLS } from './apiUrls.js';
import { useAuthStore } from '../stores/auth.store';

// axios nesnesini oluşturduk
const apiClient = axios.create({
    headers: { 'Content-Type': 'application/json' },
});

// her isteğin öncesinde doğrulama
apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

// cevap geldikten sonra doğrulama. eğer yetki yoksa (expired olabilir) 401 ve login ekranı
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                const authStore = useAuthStore();
                console.log("Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor...");
                authStore.logout();
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;