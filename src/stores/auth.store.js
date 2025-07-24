// src/stores/auth.store.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../services/supabaseClient.js'; // Supabase client yolunuzun bu olduğundan emin olun
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user = ref(null);
  // YENİ STATE: Oturum kontrolünün yapılıp yapılmadığını tutar. Başlangıçta false.
  const isAuthReady = ref(false);

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.user_metadata?.role || 'guest'); // Rolü buradan alıyoruz

  // --- ACTIONS ---

  /**
   * ADI DEĞİŞTİ: Bu fonksiyon artık 'initialize' olarak adlandırılıyor.
   * Uygulama ilk yüklendiğinde SADECE BİR KEZ çalışır.
   * Supabase'den mevcut oturumu kontrol eder ve 'isAuthReady' durumunu 'true' yapar.
   */
  async function initialize() {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
    isAuthReady.value = true; // Kontrol bitti, uygulama hazır.
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user.value = data.user;
    router.push({ name: 'Dashboard' });
  }

  async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'user' // Varsayılan rol
            }
        }
    });
    if (error) throw error;
    user.value = data.user;
    // Kayıttan sonra hemen yönlendirme yapmak yerine,
    // kullanıcıya e-postasını kontrol etmesi gerektiğini söylemek daha iyi olabilir.
    alert('Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.');
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    router.push({ name: 'Login' });
  }

  // Supabase'in auth durum değişikliklerini (login, logout) dinle ve state'i anında güncelle.
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });

  // Store'dan dışarıya açılan (export edilen) her şey burada olmalı.
  return {
    user,
    isAuthReady, // GÜNCELLENDİ
    isAuthenticated,
    userRole,
    initialize, // GÜNCELLENDİ
    login,
    register,
    logout,
  };
});