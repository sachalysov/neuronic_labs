// Service Worker для кеширования сторонних ресурсов
// Оптимизирует кеширование Yandex Metrika и других сторонних скриптов

const CACHE_NAME = 'neuronic-labs-v1'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 дней в миллисекундах

// Ресурсы для кеширования
const CACHE_URLS = [
  // Yandex Metrika - кешируем на 7 дней
  'https://mc.yandex.ru/metrika/tag.js',
  'https://mc.yandex.com/metrika/advert.gif',
  // Vigo (если используется)
  'https://api.vigo.one/html5/Vigo.min.js',
]

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Не кешируем сразу, используем стратегию "cache on demand"
      return cache.addAll([])
    })
  )
  self.skipWaiting()
})

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Перехват запросов для кеширования сторонних ресурсов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Кешируем только сторонние ресурсы из списка
  const shouldCache = CACHE_URLS.some((cacheUrl) => {
    return url.href.startsWith(cacheUrl) || url.href.includes(cacheUrl.split('/').pop())
  })

  if (shouldCache && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Проверяем, не устарел ли кеш (7 дней)
          if (cachedResponse) {
            const cachedDate = cachedResponse.headers.get('sw-cached-date')
            if (cachedDate) {
              const cacheAge = Date.now() - parseInt(cachedDate, 10)
              if (cacheAge < CACHE_DURATION) {
                // Кеш актуален, возвращаем его
                return cachedResponse
              }
            }
          }

          // Загружаем свежую версию и кешируем
          return fetch(event.request)
            .then((response) => {
              // Клонируем ответ для кеширования
              const responseToCache = response.clone()
              
              // Добавляем заголовок с датой кеширования
              const headers = new Headers(responseToCache.headers)
              headers.set('sw-cached-date', Date.now().toString())
              
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers,
              })

              cache.put(event.request, modifiedResponse)
              return response
            })
            .catch(() => {
              // Если сеть недоступна, возвращаем кеш (даже если устарел)
              if (cachedResponse) {
                return cachedResponse
              }
            })
        })
      })
    )
  }
})
