// src/services/apiClient.js
import axios from 'axios';
import { API_URLS } from './apiUrls';
import { useAuthStore } from '../stores/auth.store';

// Axios'un kendi "Singleton" instance'ını oluşturuyoruz.
const apiClient = axios.create({
    // === DEĞİŞİKLİK BURADA: baseURL'i geri ekledik ===
    // Bu, tüm isteklerin başına otomatik olarak bu adresi ekler.
    baseURL: 'https://rare-tools-smash.loca.lt/', 
    headers: { 'Content-Type': 'application/json' },
});

// Axios Interceptor'ları (Request ve Response) aynı kalacak...
apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
