// src/services/apiUrls.js

// DÜZELTME: Artık BASE URL'i ve endpoint'leri birleştirmiyoruz.
// Her adresi tam ve bütün olarak yazarak tüm belirsizlikleri ortadan kaldırıyoruz.
// Bu, en güvenilir yöntemdir.

const BASE_URL = 'https://plain-suits-pull.loca.lt/api';

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
