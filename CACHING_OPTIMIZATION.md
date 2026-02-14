# Оптимизация кеширования для neuroniclabs.ru

## Проблема

Сторонние ресурсы (Yandex Metrika, Vigo) загружаются с внешних доменов и имеют неоптимальное кеширование:
- Yandex Metrika: кеш на 1 час (≈87 КиБ) — **решение:** скрипт загружается через прокси с нашего домена с Cache-Control 7 дней.
- Vigo: отсутствие кеширования (16 КиБ)

## Решение

### 1. Прокси Metrika (реализовано)

Скрипт Metrika загружается с нашего домена (`/metrika/tag.js?id=...`), ответ отдаётся с `Cache-Control: public, max-age=604800` (7 дней). Это устраняет предупреждение Lighthouse «Выбирайте эффективный период хранения кеша» для tag.js (~87 КиБ).

- **server.js** — маршрут GET `/metrika/tag.js` проксирует на mc.yandex.ru и выставляет длинный кеш.
- **nginx** — в `nginx.conf.example` добавлен `location /metrika/` с proxy_pass и Cache-Control.
- **Vite dev** — в `vite.config.ts` proxy `/metrika` на mc.yandex.ru для локальной разработки.

При **статическом хостинге без Node/Nginx** настройте rewrite: `/metrika/tag.js` → `https://mc.yandex.ru/metrika/tag.js` (Cloudflare, Vercel rewrites, Netlify _redirects и т.п.), иначе счётчик не загрузится.

### 2. Service Worker (уже реализовано)

Service Worker (`/public/sw.js`) кеширует сторонние ресурсы на 7 дней (резерв для advert.gif и др.):
- `https://mc.yandex.ru/metrika/tag.js`
- `https://mc.yandex.com/metrika/advert.gif`
- `https://api.vigo.one/html5/Vigo.min.js`

**Как работает:**
- Регистрируется автоматически в production режиме
- Кеширует ресурсы при первой загрузке
- Обновляет кеш каждые 7 дней
- Работает в фоне, не блокируя загрузку страницы

### 3. Оптимизация загрузки (уже реализовано)

- Добавлен `preload` для Yandex Metrika скрипта
- Скрипты загружаются асинхронно с `async` и `defer`
- Загрузка происходит только после согласия пользователя

### 4. Настройка сервера (требуется настройка на сервере)

#### Для Apache (.htaccess)

Убедитесь, что файл `.htaccess` содержит правильные заголовки кеширования (уже настроено):

```apache
# Кэширование JS и CSS на 1 год
<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

#### Для Nginx

Добавьте в конфигурацию Nginx (см. `nginx.conf.example`):

```nginx
# Cache-Control для JS и CSS
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
```

### 5. Дополнительные рекомендации

#### CDN для сторонних ресурсов (опционально)

Если возможно, используйте прокси/CDN для кеширования сторонних ресурсов:

```nginx
# Пример прокси для Yandex Metrika через ваш сервер
location /metrika/tag.js {
    proxy_pass https://mc.yandex.ru/metrika/tag.js;
    proxy_cache_valid 7d;
    add_header Cache-Control "public, max-age=604800";
}
```

#### Проверка кеширования

Проверьте заголовки кеширования через DevTools:
1. Откройте Network tab
2. Найдите запросы к `mc.yandex.ru` или `api.vigo.one`
3. Проверьте заголовки `Cache-Control` и `Expires`

#### Мониторинг

После внедрения Service Worker проверьте:
- Запросы к сторонним ресурсам должны возвращаться из кеша (Status: 200, Size: (from disk cache))
- В Application > Service Workers должен быть зарегистрирован worker
- В Application > Cache Storage должен быть кеш `neuronic-labs-v1`

## Ожидаемый результат

- **Экономия трафика:** ~151 КиБ при повторных посещениях
- **Ускорение загрузки:** Сторонние скрипты загружаются из кеша браузера
- **Улучшение метрик:** LCP и FCP улучшаются за счет кеширования

## Примечания

- Service Worker работает только в production режиме
- Кеш обновляется автоматически каждые 7 дней
- Для полной очистки кеша пользователь может очистить данные сайта в браузере
