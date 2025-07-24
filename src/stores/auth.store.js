// src/stores/auth.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../services/supabaseClient.js'; // Supabase client'ınızın doğru yolda olduğundan emin olun
import router from '../router'; // Router'ı import ediyoruz

export const useAuthStore = defineStore('auth', () => {
  // STATE: Reaktif değişkenler
  const user = ref(null);
  const loading = ref(true); // Oturum kontrolü sırasında yükleme durumu için

  // GETTER: State'den türetilmiş değer (computed property)
  const isLoggedIn = computed(() => !!user.value);

  // ACTION: State'i değiştiren fonksiyonlar
  async function fetchUser() {
    loading.value = true;
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
    loading.value = false;
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user.value = data.user;
    // Giriş başarılı olunca Dashboard'a yönlendir.
    router.push('/dashboard');
  }

  async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    user.value = data.user;
     // Kayıt başarılı olunca Dashboard'a yönlendir.
    router.push('/dashboard');
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Çıkış yapınca Login'e yönlendir.
    router.push('/login');
  }

  // Supabase'in auth durum değişikliklerini dinle.
  // Bu sayede başka bir sekmede logout yapıldığında bu sekme de etkilenir.
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });

  return {
    user,
    loading,
    isLoggedIn,
    fetchUser,
    login,
    register,
    logout,
  };
});