// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase projenin URL'sini ve anon anahtarını buraya yapıştır.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL ve Anon Key ortam değişkenlerinde bulunamadı!");
}
// Supabase istemcisini (client) oluştur ve dışarıya aç.
// Bu, bizim yeni "singleton instance"ımız olacak.
export const supabase = createClient(supabaseUrl, supabaseKey)
