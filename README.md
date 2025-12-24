# NEUROMODUL Landing

Лендинг агентства по внедрению ИИ-автоматизации в бизнес.

## 🚀 Технологии

- **Vite** - быстрый сборщик
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Tailwind CSS v4** - стилизация
- **Radix UI** - доступные UI компоненты
- **Lucide React** - иконки

## 📦 Установка

```bash
npm install
```

## 🛠️ Разработка

Запуск dev-сервера (http://localhost:5173):

```bash
npm run dev
```

## 🏗️ Сборка

Создание production сборки в папке `dist/`:

```bash
npm run build
```

Предпросмотр production сборки:

```bash
npm run preview
```

## 📁 Структура проекта

```
├── src/
│   ├── components/       # React компоненты
│   │   ├── ui/          # UI компоненты (Button, Card, Input...)
│   │   ├── chat-widget.tsx
│   │   ├── demo-chat.tsx
│   │   ├── sticky-header.tsx
│   │   └── business-cases-carousel.tsx
│   ├── pages/           # Страницы
│   │   └── HomePage.tsx
│   ├── services/        # Сервисы (API, и т.д.)
│   │   └── chat.ts
│   ├── lib/            # Утилиты
│   │   └── utils.ts
│   ├── App.tsx         # Главный компонент
│   ├── main.tsx        # Entry point
│   └── globals.css     # Глобальные стили
├── public/             # Статические файлы
├── index.html          # HTML шаблон
├── vite.config.ts      # Конфиг Vite
└── tsconfig.json       # Конфиг TypeScript
```

## 🔧 Конфигурация чата

Для работы чата создайте файл `.env` в корне проекта:

```env
VITE_CHAT_WEBHOOK_URL=https://your-webhook-url.com/api/chat
```

Без настройки webhook чат будет работать с mock-ответами.

## 📤 Деплой

После сборки (`npm run build`) папка `dist/` готова к деплою на любой статический хостинг:

- **Vercel**: `vercel --prod`
- **Netlify**: перетащите папку `dist/` в Netlify Drop
- **GitHub Pages**: настройте GitHub Actions для автодеплоя из `dist/`
- **Любой хостинг**: загрузите содержимое `dist/` на сервер

## ⚡ Особенности миграции с Next.js

Проект мигрирован с Next.js на чистый Vite + React:

- ✅ Удален Next.js и все его зависимости
- ✅ Server Actions заменены на клиентский fetch
- ✅ `next/link` заменен на обычные элементы
- ✅ Полностью статическая сборка (SPA)
- ✅ Все стили и функционал сохранены

## 📝 Лицензия

© 2025 NeuroModul. Все права защищены.

# neuronic_labs
