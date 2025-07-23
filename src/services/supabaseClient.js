// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase projenin URL'sini ve anon anahtarını buraya yapıştır.
const supabaseUrl = 'https://pyrqshzpturxwdjpphke.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFzaHpwdHVyeHdkanBwaGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTA2OTgsImV4cCI6MjA2ODc2NjY5OH0.NS2ltlBTVpAqyJoQEUTL9i9FZNIBdReZIPaYQO90bV0'

// Supabase istemcisini (client) oluştur ve dışarıya aç.
// Bu, bizim yeni "singleton instance"ımız olacak.
export const supabase = createClient(supabaseUrl, supabaseKey)
