// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase projenin URL'sini ve anon anahtarını buraya yapıştır.
const supabaseUrl = 'https://ruutrnzeinjnacforbzt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1dXRybnplaW5qbmFjZm9yYnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzI1ODEsImV4cCI6MjA2OTM0ODU4MX0.q0foqLw8H-4rLckTfB8v8zfUoZtR9UNwh2zXAket5tk'

// Supabase istemcisini (client) oluştur ve dışarıya aç.
// Bu, bizim yeni "singleton instance"ımız olacak.
export const supabase = createClient(supabaseUrl, supabaseKey)
