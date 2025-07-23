// src/services/apiUrls.js

// Yeni localtunnel adresini buraya yazıyoruz.

// Geri kalan her şey, bu yeni adresi otomatik olarak kullanacaktır.
export const API_URLS = {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    
    GET_ME: `${BASE_URL}/users/me`,
    UPDATE_ME: `${BASE_URL}/users/me`,
    CHANGE_PASSWORD: `${BASE_URL}/users/me/change-password`,
    GET_ALL_USERS: `${BASE_URL}/users`,
    GET_MY_TEAM: `${BASE_URL}/users/my-team`,
    
    LEAVES: `${BASE_URL}/leaves`,
};
