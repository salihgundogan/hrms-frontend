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
    // 1. Rota Grubu: Layout'un DIŞINDA kalan, HERKESE AÇIK sayfalar
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
        path: '/reset-password', // DÜZELTME: Supabase token'ı URL'de değil, hash'te (#) gönderir.
        name: 'ResetPassword',
        component: ResetPasswordView
    },

    // 2. Rota Grubu: MainLayout'un İÇİNDE gösterilecek olan, GİRİŞ GEREKTİREN sayfalar
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true }, // Bu kural, aşağıdaki tüm 'children' için geçerlidir.
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

// Navigation Guard (Kimlik ve Yetki Kontrolü)
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    // Giriş yapmış bir kullanıcı, halka açık sayfalara (login, register vb.) gitmeye çalışırsa,
    // onu doğrudan dashboard'a yönlendir.
    const publicPages = ['/login', '/register', '/forgot-password'];
    if (publicPages.includes(to.path) && isAuthenticated) {
        return next({ name: 'Dashboard' });
    }

    // Giriş gerektiren bir sayfaya, giriş yapmamış bir kullanıcı erişmeye çalışırsa...
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    // Belirli bir rol gerektiren bir sayfaya, yetkisiz bir kullanıcı erişmeye çalışırsa...
    if (to.meta.roles && authStore.userRole && !to.meta.roles.includes(authStore.userRole)) {
        return next('/dashboard');
    }

    // Her şey yolundaysa, devam et.
    next();
});

export default router;
