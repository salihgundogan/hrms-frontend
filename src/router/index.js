// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Gerekli tüm bileşenleri import ediyoruz.
import MainLayout from '../layouts/MainLayout.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import VerifyEmailView from '../views/VerifyEmailView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue'; // <-- Yeni import
import ResetPasswordView from '../views/ResetPasswordView.vue';   // <-- Yeni import
import DashboardView from '../views/DashboardView.vue';
import ProfileView from '../views/ProfileView.vue';
import TeamView from '../views/TeamView.vue';
import LeaveManagementView from '../views/LeaveManagementView.vue';


const routes = [
    // 1. Rota Grubu: Layout'un DIŞINDA kalan, halka açık sayfalar
    { 
        path: '/login', 
        name: 'Login', 
        component: LoginView 
    },
    { 
        path: '/register', 
        name: 'Register', 
        component: RegisterView
    },
    { 
        path: '/verify-email/:token', 
        name: 'VerifyEmail', 
        component: VerifyEmailView
    },
    // --- YENİ EKLENEN ŞİFRE SIFIRLAMA ROTALARI ---
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: ResetPasswordView
    },
    // --------------------------------------------

    // 2. Rota Grubu: MainLayout'un İÇİNDE gösterilecek olan, giriş gerektiren sayfalar
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' }, 
            { path: 'dashboard', name: 'Dashboard', component: DashboardView },
            { path: 'profile', name: 'Profile', component: ProfileView },
            { path: 'team', name: 'Team', component: TeamView, meta: { roles: ['manager', 'hr_admin'] } },
            { path: 'admin/leaves', name: 'LeaveManagement', component: LeaveManagementView, meta: { roles: ['hr_admin'] } },
        ]
    },
    
    // Bulunmayan sayfaları yönlendirme kuralı
    { 
        path: '/:pathMatch(.*)*', 
        redirect: () => {
            const authStore = useAuthStore();
            return authStore.isAuthenticated ? '/dashboard' : '/login';
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard (Kimlik ve Yetki Kontrolü) - Bu kısım aynı kalıyor.
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const {isAuthenticated} = authStore;

    if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        return next({ name: 'Dashboard' });
    }
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }
    if (to.meta.roles && authStore.userRole && !to.meta.roles.includes(authStore.userRole)) {
        return next('/dashboard');
    }
    next();
});

export default router;
