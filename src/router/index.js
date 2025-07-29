// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Gerekli tüm bileşenleri import ediyoruz.
import MainLayout from '../layouts/MainLayout.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import VerifyEmailView from '../views/VerifyEmailView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProfileView from '../views/ProfileView.vue';
import TeamView from '../views/TeamView.vue';
import LeaveManagementView from '../views/LeaveManagementView.vue';

const routes = [
    // 1. Grup: Herkese açık sayfalar
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/verify-email/:token',
        name: 'VerifyEmail',
        component: VerifyEmailView
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView
    },
    {
        // Şifre sıfırlama sayfası da bu grupta olmalı
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPasswordView
    },

    // 2. Grup: Giriş gerektiren, ana layout içindeki sayfalar
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true }, // Bu gruptaki tüm sayfalar giriş gerektirir
        children: [
            // Kök dizine gelen isteği doğrudan dashboard'a yönlendir
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'Dashboard', component: DashboardView },
            { path: 'profile', name: 'Profile', component: ProfileView },
            { path: 'team', name: 'Team', component: TeamView, meta: { roles: ['manager', 'hr_admin'] } },
            { path: 'admin/leaves', name: 'LeaveManagement', component: LeaveManagementView, meta: { roles: ['hr_admin'] } },
        ]
    },

    // 3. Grup: Bulunmayan sayfalar (404) - Her zaman en sonda olmalı
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: () => {
            const authStore = useAuthStore();
            // Kullanıcı giriş yapmışsa dashboard'a, yapmamışsa login'e yönlendir.
            return authStore.user ? { name: 'Dashboard' } : { name: 'login' };
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// NİHAİ VE DOĞRU YÖNLENDİRME KONTROLÜ (Navigation Guard)
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isLoggedIn = !!authStore.user;

    // Kural 1: Kullanıcı GİRİŞ YAPMAMIŞ ve yetki gerektiren bir sayfaya gitmek istiyorsa
    if (to.meta.requiresAuth && !isLoggedIn) {
        return next({ name: 'login' });
    }

    // Kural 2: Kullanıcı GİRİŞ YAPMIŞ ve login, register gibi sayfalara gitmek istiyorsa
    // DÜZELTME: Bu listeden 'ResetPassword' çıkarıldı.
    if (['login', 'register', 'ForgotPassword'].includes(to.name) && isLoggedIn) {
        return next({ name: 'Dashboard' }); // Onu ana sayfasına yönlendir
    }

    // Diğer tüm durumlarda serbest geçiş ver.
    next();
});

export default router;