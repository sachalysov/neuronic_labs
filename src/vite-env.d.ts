/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_WEBHOOK_URL?: string
  // добавьте другие env переменные здесь
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

