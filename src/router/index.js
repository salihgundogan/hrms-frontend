// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

// Yeni Layout ve View bileşenlerimizi import ediyoruz
import MainLayout from '../layouts/MainLayout.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
// Henüz oluşturmadığımız ama birazdan oluşturacağımız diğer view'ları da hazırlık olarak import edelim
import ProfileView from '../views/ProfileView.vue';
import TeamView from '../views/TeamView.vue';
import LeaveManagementView from '../views/LeaveManagementView.vue';


const routes = [
    // 1. Rota Grubu: Layout'un DIŞINDA kalan sayfalar
    { 
        path: '/login', 
        name: 'Login', 
        component: LoginView 
    },

    // 2. Rota Grubu: MainLayout'un İÇİNDE gösterilecek olan sayfalar
    {
        path: '/', // Ana yol
        component: MainLayout, // Bu yola gidildiğinde MainLayout gösterilir
        meta: { requiresAuth: true }, // Bu grubun tamamı giriş gerektirir
        children: [
            // Bu sayfalar, MainLayout'un içindeki <router-view />'e yerleştirilir.
            {
                path: 'dashboard', // URL: /dashboard
                name: 'Dashboard',
                component: DashboardView,
            },
            {
                path: 'profile', // URL: /profile
                name: 'Profile',
                component: ProfileView,
            },
            {
                path: 'team', // URL: /team
                name: 'Team',
                component: TeamView,
                meta: { roles: ['manager', 'hr_admin'] } // Sadece yönetici ve İK görebilir
            },
            {
                path: 'admin/leaves', // URL: /admin/leaves
                name: 'LeaveManagement',
                component: LeaveManagementView,
                meta: { roles: ['hr_admin'] } // Sadece İK görebilir
            },
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
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.userRole;

    // Giriş gerektiren bir sayfa mı?
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    // Belirli bir rol gerektiren bir sayfa mı?
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        // Yetkisi yoksa, ana sayfaya yönlendir.
        return next('/dashboard');
    }

    // Her şey yolundaysa, devam et.
    next();
});

export default router;
