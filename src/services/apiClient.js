// src/services/apiClient.js
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

// Axios'un kendi "Singleton" instance'ını oluşturuyoruz.
// baseURL'i buradan kaldırdık, çünkü her adres apiUrls.js'de tam olarak belirtiliyor.
const apiClient = axios.create({
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
