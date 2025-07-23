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
        redirect: '/login' // Giriş yapmamış birini her zaman login'e yönlendir
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard (Nihai ve Doğru Versiyon)
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Oturum bilgisinin Supabase'den çekilmesini bekle
    if (!authStore.isAuthReady) {
        await authStore.initialize();
    }

    const isAuthenticated = authStore.isAuthenticated;
    
    const publicPages = ['Login', 'Register', 'ForgotPassword', 'ResetPassword', 'VerifyEmail'];
    const authRequired = !publicPages.includes(to.name);

    // SENARYO 1: Korumalı bir sayfaya, giriş yapmadan girmeye çalışıyorsa -> Login'e gönder
    if (authRequired && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    // SENARYO 2: Halka açık bir sayfaya (Login gibi), zaten giriş yapmışken gitmeye çalışıyorsa -> Dashboard'a gönder
    if (!authRequired && isAuthenticated) {
        return next({ name: 'Dashboard' });
    }

    // SENARYO 3: Rol bazlı bir sayfaya, yetkisiz bir roldeyken girmeye çalışıyorsa -> Dashboard'a gönder
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
        return next({ name: 'Dashboard' });
    }
    
    // Eğer yukarıdaki kurallardan hiçbiri geçerli değilse, gitmek istediği yere gitmesine izin ver.
    next();
});

export default router;
