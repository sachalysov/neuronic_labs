import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Init] ❌ Supabase credentials not configured. Blog posts will use fallback data.')
  } else {
    console.log('[Supabase Init] ✅ Supabase клиент инициализирован.')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null

