# Генерация Sitemap

## Описание

Скрипт `generate-sitemap.mjs` автоматически генерирует `sitemap.xml` для сайта, включая:

- **Статические страницы**: главная, блог, кейсы, партнеры, контакты и т.д.
- **Динамические страницы**: статьи блога и бизнес-кейсы из Supabase

## Использование

### Локальная генерация

```bash
# Убедитесь, что переменные окружения установлены в .env
npm run generate:sitemap
```

### Ручной запуск с переменными окружения

```bash
VITE_SUPABASE_URL="your-url" VITE_SUPABASE_ANON_KEY="your-key" node scripts/generate-sitemap.mjs
```

## Интеграция в процесс сборки

Sitemap автоматически генерируется при деплое через GitHub Actions перед сборкой проекта.

### Локальная сборка с sitemap

```bash
npm run build:full
```

Эта команда:
1. Генерирует sitemap.xml
2. Выполняет сборку с pre-rendering

## Структура sitemap.xml

Sitemap включает следующие страницы:

### Статические страницы (приоритет 0.3-1.0)
- `/` - главная (priority: 1.0, changefreq: daily)
- `/blog` - список статей (priority: 0.9, changefreq: weekly)
- `/business-cases` - список кейсов (priority: 0.9, changefreq: weekly)
- `/partners` - партнеры (priority: 0.8, changefreq: monthly)
- `/contacts` - контакты (priority: 0.8, changefreq: monthly)
- `/conference` - конференция (priority: 0.7, changefreq: monthly)
- `/calculator` - калькулятор (priority: 0.8, changefreq: monthly)
- `/politika-konfidentsialnosti` - политика конфиденциальности (priority: 0.3, changefreq: yearly)
- `/publichnaya-oferta` - публичная оферта (priority: 0.3, changefreq: yearly)

### Динамические страницы (приоритет 0.8)
- `/blog/:slug` - отдельные статьи блога
- `/business-cases/:id` - отдельные бизнес-кейсы

## Расположение файла

Sitemap сохраняется в `public/sitemap.xml` и автоматически копируется в `dist/` при сборке.

## Robots.txt

Sitemap уже указан в `public/robots.txt`:
```
Sitemap: https://neuroniclabs.ru/sitemap.xml
```

## Обновление sitemap

Sitemap автоматически обновляется при каждом деплое. Для ручного обновления:

1. Запустите `npm run generate:sitemap`
2. Файл будет создан/обновлен в `public/sitemap.xml`
3. При следующей сборке он будет включен в `dist/`

## Требования

- Node.js 18+
- Доступ к Supabase (переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY)
- Пакет `@supabase/supabase-js` (уже установлен в проекте)

## Troubleshooting

### Ошибка: "Не указаны переменные окружения"

Убедитесь, что в `.env` файле или переменных окружения установлены:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Ошибка при загрузке данных из Supabase

Скрипт продолжит работу даже если не удастся загрузить статьи или кейсы. В sitemap будут включены только статические страницы.

### Sitemap не обновляется

Проверьте:
1. Что скрипт выполняется перед сборкой
2. Что файл `public/sitemap.xml` создается
3. Что файл копируется в `dist/` при сборке
