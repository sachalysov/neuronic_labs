import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Blog posts will use fallback data.')
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✓ установлен' : '✗ отсутствует')
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ установлен' : '✗ отсутствует')
} else {
  console.log('Supabase клиент инициализирован:', supabaseUrl)
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

