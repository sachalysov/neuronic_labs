# Pre-rendering для SEO

Этот проект использует pre-rendering для улучшения SEO. Pre-rendering генерирует статические HTML файлы для всех публичных страниц, которые поисковые боты могут индексировать.

## Как это работает

1. **Build процесс**: После сборки проекта запускается скрипт pre-rendering
2. **Puppeteer**: Скрипт использует Puppeteer для открытия каждой страницы в headless браузере
3. **Сохранение HTML**: Полный HTML с мета-тегами сохраняется в `dist/`
4. **Отдача ботов**: Сервер определяет поисковых ботов и отдает им pre-rendered HTML

## Использование

### Автоматический pre-rendering (рекомендуется)

```bash
npm run build:prerender
```

Этот скрипт:
1. Собирает проект (`npm run build`)
2. Запускает preview сервер
3. Рендерит все страницы через Puppeteer
4. Сохраняет HTML файлы в `dist/`

### Ручной запуск pre-rendering

Если проект уже собран:

```bash
npm run prerender
```

### Запуск сервера с поддержкой ботов

Для production используйте `server.js`:

```bash
node server.js
```

Сервер автоматически определяет поисковых ботов и отдает им pre-rendered HTML.

## Настройка

### Добавление новых страниц

Отредактируйте `scripts/prerender.mjs` и добавьте новые роуты в массив `PUBLIC_ROUTES`:

```javascript
const PUBLIC_ROUTES = [
  '/',
  '/blog',
  '/your-new-page', // Добавьте сюда
]
```

### Переменные окружения

- `PRERENDER_BASE_URL` - URL для pre-rendering (по умолчанию: `http://localhost:4173`)
- `PRERENDER_OUTPUT_DIR` - Директория для сохранения (по умолчанию: `dist`)

## Поддерживаемые поисковые боты

- Googlebot
- Bingbot
- Yandexbot
- Baiduspider
- Facebook crawler
- Twitter bot
- LinkedIn bot
- И другие...

## Структура файлов

После pre-rendering структура `dist/` будет выглядеть так:

```
dist/
├── index.html              # Главная страница
├── blog/
│   └── index.html         # Страница блога
├── business-cases/
│   └── index.html         # Страница кейсов
├── partners/
│   └── index.html         # Партнерская программа
└── ...
```

## Важные замечания

1. **Мета-теги**: Убедитесь, что все страницы используют `useMeta` hook для установки мета-тегов
2. **Время загрузки**: Pre-rendering ждет 3 секунды после загрузки страницы для установки мета-тегов
3. **Динамический контент**: Страницы с динамическим контентом (например, `/blog/:slug`) требуют дополнительной настройки
4. **Обновление**: После изменения контента необходимо пересобрать проект с pre-rendering

## Troubleshooting

### Pre-rendering не работает

1. Убедитесь, что проект собран: `npm run build`
2. Проверьте, что порт 4173 свободен
3. Проверьте логи на наличие ошибок

### Мета-теги не сохраняются

1. Убедитесь, что страница использует `useMeta` hook
2. Увеличьте время ожидания в `scripts/prerender.mjs` (параметр `waitForTimeout`)

### Сервер не определяет ботов

1. Проверьте user-agent в запросе
2. Убедитесь, что `server.js` запущен
3. Проверьте логи сервера

## Альтернативные решения

Если pre-rendering не подходит, рассмотрите:

1. **SSR с Next.js** - полный SSR для React
2. **Prerender.io** - облачный сервис для pre-rendering
3. **React Snapshot** - статический pre-rendering (устарел)

## Дополнительная информация

- [Puppeteer документация](https://pptr.dev/)
- [SEO для SPA](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
