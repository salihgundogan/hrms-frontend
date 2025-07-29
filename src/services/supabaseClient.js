// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase projenin URL'sini ve anon anahtarını buraya yapıştır.
const supabaseUrl = 'import.meta.env.VITE_SUPABASE_URL'
const supabaseKey = 'import.meta.env.VITE_SUPABASE_ANON_KEY'

// Supabase istemcisini (client) oluştur ve dışarıya aç.
// Bu, bizim yeni "singleton instance"ımız olacak.
export const supabase = createClient(supabaseUrl, supabaseKey)
