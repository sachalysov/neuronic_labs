/**
 * Простой Express сервер для отдачи pre-rendered HTML поисковым ботам
 * Использование: node server.js
 * 
 * Этот сервер:
 * 1. Определяет, является ли запрос от поискового бота
 * 2. Если да - отдает pre-rendered HTML из dist
 * 3. Если нет - отдает обычный SPA (index.html)
 */

import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DIST_DIR = join(__dirname, 'dist')

// Список user-agent поисковых ботов
const SEARCH_BOTS = [
  'googlebot',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'sogou',
  'exabot',
  'facebot',
  'ia_archiver',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkShare',
  'W3C_Validator',
]

/**
 * Проверяет, является ли запрос от поискового бота
 */
function isSearchBot(userAgent) {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return SEARCH_BOTS.some(bot => ua.includes(bot))
}

/**
 * Получает путь к pre-rendered HTML файлу
 */
function getPrerenderedPath(url) {
  // Убираем query string и hash
  const path = url.split('?')[0].split('#')[0]
  
  if (path === '/' || path === '') {
    return join(DIST_DIR, 'index.html')
  }
  
  // Проверяем, существует ли директория с таким именем
  const dirPath = join(DIST_DIR, path.slice(1))
  const indexPath = join(dirPath, 'index.html')
  
  if (existsSync(indexPath)) {
    return indexPath
  }
  
  // Если нет pre-rendered версии, возвращаем обычный index.html
  return join(DIST_DIR, 'index.html')
}

// Middleware для определения ботов
app.use((req, res, next) => {
  const userAgent = req.get('user-agent')
  const isBot = isSearchBot(userAgent)
  
  // Сохраняем информацию о боте в request
  req.isSearchBot = isBot
  req.prerenderedPath = getPrerenderedPath(req.url)
  
  next()
})

// Статические файлы (CSS, JS, изображения и т.д.)
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  immutable: true,
}))

// Обработка всех остальных запросов
app.get('*', (req, res) => {
  let filePath
  
  if (req.isSearchBot) {
    // Для ботов - используем pre-rendered версию
    filePath = req.prerenderedPath
  } else {
    // Для обычных пользователей - обычный SPA index.html
    filePath = join(DIST_DIR, 'index.html')
  }
  
  // Проверяем существование файла
  if (!existsSync(filePath)) {
    // Если pre-rendered версия не найдена, отдаем обычный index.html
    const indexPath = join(DIST_DIR, 'index.html')
    if (existsSync(indexPath)) {
      filePath = indexPath
    } else {
      return res.status(404).send('Not found')
    }
  }
  
  try {
    // Отдаем файл
    const html = readFileSync(filePath, 'utf-8')
    
    // Добавляем заголовки для SEO
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'index, follow',
    })
    
    res.send(html)
  } catch (error) {
    console.error('Ошибка при чтении файла:', error)
    res.status(500).send('Internal server error')
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`)
  console.log(`📁 Директория: ${DIST_DIR}`)
  console.log(`🤖 Pre-rendering для поисковых ботов: включен`)
})
