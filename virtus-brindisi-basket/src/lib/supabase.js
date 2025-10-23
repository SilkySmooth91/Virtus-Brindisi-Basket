import { createClient } from '@supabase/supabase-js'

// Le tue credenziali Supabase dalle variabili ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verifica che le credenziali siano configurate
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.')
}

// Crea il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
