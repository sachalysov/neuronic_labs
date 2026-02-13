import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
// Инициализация Yandex Metrika перенесена в ConsentGate - выполняется только после согласия
import { initSchemaOrg } from './lib/schema-org-data'
import { suppressThirdPartyRejectionErrors } from './lib/yandex-metrika'

suppressThirdPartyRejectionErrors()

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

// Инициализация Schema.org разметки
initSchemaOrg()

// Регистрация Service Worker для кеширования сторонних ресурсов (только в production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope)
      })
      .catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error)
      })
  })
}

// Оптимизация: StrictMode отключен в production для лучшей производительности
// В development режиме StrictMode помогает находить проблемы
const root = ReactDOM.createRoot(document.getElementById('root')!)

if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  root.render(<App />)
}

