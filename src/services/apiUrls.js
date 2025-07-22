// bütün endpointler burada
export const API_URLS = {
    BASE: 'https://little-dots-sneeze.loca.lt/',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email', // Verify email için de bir adres ekleyelim
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GET_ME: '/users/me',
    UPDATE_ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/change-password',
    GET_ALL_USERS: '/users',
    GET_MY_TEAM: '/users/my-team',
    LEAVES: '/leaves',
};
