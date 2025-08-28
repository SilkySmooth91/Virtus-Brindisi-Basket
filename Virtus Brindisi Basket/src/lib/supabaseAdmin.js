import { createClient } from '@supabase/supabase-js'

// Client admin con service role per operazioni CRUD
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase admin configuration. Please add VITE_SUPABASE_SERVICE_KEY to your .env file.')
}

// Client con service role per operazioni admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
