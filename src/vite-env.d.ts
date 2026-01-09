/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_WEBHOOK_URL?: string
  readonly VITE_FORM_WEBHOOK_URL?: string
  readonly VITE_BLOG_WEBHOOK_URL?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

