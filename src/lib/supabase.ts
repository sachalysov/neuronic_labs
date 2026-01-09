import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Детальное логирование для отладки
console.log('[Supabase Init] Проверка переменных окружения...')
console.log('[Supabase Init] VITE_SUPABASE_URL:', supabaseUrl ? `✓ установлен (${supabaseUrl.substring(0, 30)}...)` : '✗ отсутствует')
console.log('[Supabase Init] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `✓ установлен (${supabaseAnonKey.substring(0, 20)}...)` : '✗ отсутствует')
console.log('[Supabase Init] Environment mode:', import.meta.env.MODE)
console.log('[Supabase Init] Environment prod:', import.meta.env.PROD)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase Init] ❌ Supabase credentials not configured. Blog posts will use fallback data.')
  console.warn('[Supabase Init] VITE_SUPABASE_URL:', supabaseUrl ? '✓ установлен' : '✗ отсутствует')
  console.warn('[Supabase Init] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ установлен' : '✗ отсутствует')
} else {
  console.log('[Supabase Init] ✅ Supabase клиент инициализирован:', supabaseUrl)
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

