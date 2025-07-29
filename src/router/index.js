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
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPasswordView
    },
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            // Kök dizine gelen isteği doğrudan dashboard'a yönlendir
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'Dashboard', component: DashboardView },
            { path: 'profile', name: 'Profile', component: ProfileView },
            { path: 'team', name: 'Team', component: TeamView, meta: { roles: ['manager', 'hr_admin'] } },
            { path: 'admin/leaves', name: 'LeaveManagement', component: LeaveManagementView, meta: { roles: ['hr_admin'] } },
        ]
    },

    // 3. Bulunmayan Sayfalar (404)
    // Bu kural en sonda olmalı
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: to => {
            const authStore = useAuthStore();
            // Eğer kullanıcı giriş yapmışsa dashboard'a, yapmamışsa login'e yönlendir.
            return authStore.user ? { name: 'Dashboard' } : { name: 'login' };
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.user;

  // main.js'deki ilk kontrolün bitmesini beklemeye gerek yok, çünkü o zaten bitti.
  // Artık sadece store'daki mevcut duruma göre karar veriyoruz.

  // Kural 1: Kullanıcı GİRİŞ YAPMAMIŞ ve yetki gerektiren bir sayfaya gitmek istiyorsa
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' });
  }

  // Kural 2: Kullanıcı GİRİŞ YAPMIŞ ve login/register gibi halka açık bir sayfaya gitmek istiyorsa
  if (['login', 'register', 'ForgotPassword', 'ResetPassword'].includes(to.name) && isLoggedIn) {
    return next({ name: 'Dashboard' }); // Ana sayfasına yönlendir
  }
  
  // Diğer tüm durumlarda serbest geçiş ver.
  next();
});
export default router;