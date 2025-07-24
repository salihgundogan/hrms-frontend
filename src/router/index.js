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
    // --- Rota Grubu 1: Herkese Açık Sayfalar ---
    // Bu rotalar için giriş yapmak GEREKMEZ.
    // Ancak kullanıcı giriş yapmışsa, bu sayfalara girmesi engellenip Dashboard'a yönlendirilir.
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false, redirectIfAuth: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        meta: { requiresAuth: false, redirectIfAuth: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView,
        meta: { requiresAuth: false, redirectIfAuth: true }
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPasswordView,
        meta: { requiresAuth: false } // Giriş yapmış kullanıcı da şifresini sıfırlayabilir, bu yüzden redirectIfAuth: true yok.
    },
    {
        path: '/verify-email/:token',
        name: 'VerifyEmail',
        component: VerifyEmailView,
        meta: { requiresAuth: false } // E-posta doğrulama her durumda erişilebilir olmalı.
    },

    // --- Rota Grubu 2: Korumalı Sayfalar (MainLayout İçinde) ---
    // Bu ana rota ve altındaki tüm alt rotalar (children) için giriş yapmak ZORUNLUDUR.
    // 'meta: { requiresAuth: true }' kuralı tüm alt rotalara miras kalır.
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' }, // Ana dizine geleni dashboard'a yönlendir
            { path: 'dashboard', name: 'Dashboard', component: DashboardView },
            { path: 'profile', name: 'Profile', component: ProfileView },
            {
                path: 'team',
                name: 'Team',
                component: TeamView,
                meta: { roles: ['manager', 'hr_admin'] } // Ek kural: Sadece bu roller erişebilir.
            },
            {
                path: 'admin/leaves',
                name: 'LeaveManagement',
                component: LeaveManagementView,
                meta: { roles: ['hr_admin'] } // Ek kural: Sadece 'hr_admin' rolü erişebilir.
            },
        ]
    },

    // Bulunmayan herhangi bir sayfa için yönlendirme kuralı.
    // Bu kural en sonda kalmalıdır.
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// --- Navigation Guard ---
// Her sayfa geçişinden önce bu kontrol mekanizması çalışır.
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Eğer oturum durumu henüz kontrol edilmediyse (sayfa ilk açıldığında/yenilendiğinde),
    // Supabase'den oturum bilgisinin çekilmesini bekle.
    // Bu, `authStore.initialize()` fonksiyonu ile sağlanır ve sayfa yenileme sorununu çözer.
    if (!authStore.isAuthReady) {
        await authStore.initialize();
    }

    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.userRole;

    // SENARYO 1: Korumalı bir sayfaya (meta.requiresAuth === true) gidilmek isteniyor
    if (to.meta.requiresAuth) {
        if (isAuthenticated) {
            // Kullanıcı giriş yapmış. Şimdi de rol kontrolü yapalım.
            // Gidilmek istenen sayfanın bir rol kısıtlaması var mı?
            if (to.meta.roles && !to.meta.roles.includes(userRole)) {
                // Evet, rol kısıtlaması var ve kullanıcının rolü yetersiz.
                // Ana sayfaya (Dashboard'a) yönlendir.
                return next({ name: 'Dashboard' });
            }
            // Rolü yeterli veya sayfanın rol kısıtlaması yok. İzin ver.
            return next();
        } else {
            // Kullanıcı giriş yapmamış. Login sayfasına yönlendir.
            return next({ name: 'Login' });
        }
    }
    // SENARYO 2: Halka açık bir sayfaya (meta.requiresAuth === false) gidilmek isteniyor
    else if (to.meta.redirectIfAuth && isAuthenticated) {
        // Kullanıcı giriş yapmış ve Login/Register gibi bir sayfaya gitmeye çalışıyor.
        // Bunu engelleyip Dashboard'a yönlendir.
        return next({ name: 'Dashboard' });
    }
    // SENARYO 3: Diğer tüm durumlar (örneğin halka açık bir sayfaya giriş yapmadan gitmek)
    else {
        // Gitmek istediği yere gitmesine izin ver.
        next();
    }
});

export default router;