import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import { setupYandexMetrika } from './lib/yandex-metrika'
import { initSchemaOrg } from './lib/schema-org-data'

// Отключаем автоматическое восстановление позиции скролла
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// Очищаем hash из URL перед загрузкой
if (window.location.hash) {
  window.history.replaceState(null, '', window.location.pathname)
}

// Прокручиваем в начало при загрузке
window.scrollTo(0, 0)
document.documentElement.scrollTop = 0
document.body.scrollTop = 0

// Инициализация Yandex Metrika
setupYandexMetrika()

// Инициализация Schema.org разметки
initSchemaOrg()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

