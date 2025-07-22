// src/services/apiUrls.js

// Bu dosya, projedeki tüm API endpoint'lerini merkezi bir yerde tutar.
// Ana adres (baseURL), apiClient.js dosyasında tanımlanmıştır.
export const API_URLS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    GET_ME: '/users/me',
    UPDATE_ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/change-password',
    GET_ALL_USERS: '/users',
    GET_MY_TEAM: '/users/my-team',
    
    LEAVES: '/leaves',
};
