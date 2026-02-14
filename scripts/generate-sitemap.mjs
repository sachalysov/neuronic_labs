#!/usr/bin/env node

/**
 * Скрипт для динамической генерации sitemap.xml
 * Использование: node scripts/generate-sitemap.mjs
 * 
 * Генерирует sitemap.xml со всеми статическими и динамическими страницами:
 * - Статические страницы (главная, блог, кейсы и т.д.)
 * - Статьи блога из Supabase
 * - Бизнес-кейсы из Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Конфигурация
const BASE_URL = 'https://neuroniclabs.ru'
const SITEMAP_PATH = join(rootDir, 'public', 'sitemap.xml')

/**
 * Загружает переменные окружения из .env файла
 */
function loadEnvFile() {
  const envPath = join(rootDir, '.env')
  if (!existsSync(envPath)) {
    return {}
  }

  const envContent = readFileSync(envPath, 'utf-8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    // Пропускаем комментарии и пустые строки
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return
    }
    
    // Парсим KEY="VALUE" или KEY=VALUE
    const match = trimmedLine.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      
      // Убираем кавычки если есть
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      envVars[key] = value
    }
  })
  
  return envVars
}

// Загружаем переменные из .env файла
const envVars = loadEnvFile()

// Получаем переменные окружения (поддерживаем оба формата: VITE_ и без префикса)
// Сначала проверяем process.env (для CI/CD), затем .env файл
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Ошибка: Не указаны переменные окружения для Supabase')
  console.error('   Требуются: VITE_SUPABASE_URL (или SUPABASE_URL) и VITE_SUPABASE_ANON_KEY (или SUPABASE_ANON_KEY)')
  console.error('   Убедитесь, что они установлены:')
  console.error('   - В .env файле (для локальной разработки)')
  console.error('   - В переменных окружения CI/CD (для деплоя)')
  console.error('   - Переданы через командную строку: VITE_SUPABASE_URL=... npm run generate:sitemap')
  process.exit(1)
}

// Инициализация Supabase клиента
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Статические страницы с приоритетами и частотами обновления
// Синхронизировано с PUBLIC_ROUTES в prerender.mjs
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/business-cases', priority: '0.9', changefreq: 'weekly' },
  { path: '/partners', priority: '0.8', changefreq: 'monthly' },
  { path: '/contacts', priority: '0.8', changefreq: 'monthly' },
  { path: '/conference', priority: '0.7', changefreq: 'monthly' },
  { path: '/calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/politika-konfidentsialnosti', priority: '0.3', changefreq: 'yearly' },
  { path: '/publichnaya-oferta', priority: '0.3', changefreq: 'yearly' },
]

/**
 * Генерирует slug из заголовка
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Загружает статьи блога из Supabase
 */
async function fetchBlogPosts() {
  try {
    console.log('📝 Загрузка статей блога...')
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, published_at, updated_at')
      .order('published_at', { ascending: false })

    if (error) {
      console.warn(`⚠️  Ошибка при загрузке статей блога: ${error.message}`)
      return []
    }

    if (!data || data.length === 0) {
      console.log('   Статьи блога не найдены')
      return []
    }

    console.log(`   Найдено статей: ${data.length}`)
    return data.map(post => {
      const slug = post.slug || generateSlug(post.title)
      return {
        path: `/blog/${slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: post.updated_at || post.published_at || new Date().toISOString(),
      }
    })
  } catch (error) {
    console.warn(`⚠️  Исключение при загрузке статей блога: ${error.message}`)
    return []
  }
}

/**
 * Загружает бизнес-кейсы из Supabase
 */
async function fetchBusinessCases() {
  try {
    console.log('💼 Загрузка бизнес-кейсов...')
    const { data, error } = await supabase
      .from('business_cases')
      .select('id, title, published_at, updated_at')
      .order('published_at', { ascending: false })

    if (error) {
      console.warn(`⚠️  Ошибка при загрузке бизнес-кейсов: ${error.message}`)
      return []
    }

    if (!data || data.length === 0) {
      console.log('   Бизнес-кейсы не найдены')
      return []
    }

    console.log(`   Найдено кейсов: ${data.length}`)
    return data.map(caseItem => ({
      path: `/business-cases/${caseItem.id}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: caseItem.updated_at || caseItem.published_at || new Date().toISOString(),
    }))
  } catch (error) {
    console.warn(`⚠️  Исключение при загрузке бизнес-кейсов: ${error.message}`)
    return []
  }
}

/**
 * Форматирует дату для sitemap
 */
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString()
  const date = new Date(dateString)
  return date.toISOString()
}

/**
 * Генерирует XML для одной страницы
 */
function generateUrlXML(page) {
  const url = `${BASE_URL}${page.path}`
  const lastmod = page.lastmod ? formatDate(page.lastmod) : new Date().toISOString()
  
  return `  <url>
    <loc>${escapeXML(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
}

/**
 * Экранирует XML специальные символы
 */
function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Генерирует полный sitemap.xml
 */
function generateSitemapXML(pages) {
  const urls = pages.map(generateUrlXML).join('\n')
  const now = new Date().toISOString()
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Генерация sitemap.xml...\n')
  console.log(`📍 Базовый URL: ${BASE_URL}`)
  console.log(`📁 Путь сохранения: ${SITEMAP_PATH.replace(rootDir, '')}\n`)

  try {
    // Загружаем динамические страницы
    const [blogPosts, businessCases] = await Promise.all([
      fetchBlogPosts(),
      fetchBusinessCases(),
    ])

    // Объединяем все страницы
    const allPages = [
      ...STATIC_PAGES.map(page => ({
        ...page,
        lastmod: new Date().toISOString(),
      })),
      ...blogPosts,
      ...businessCases,
    ]

    console.log(`\n📊 Итого страниц в sitemap: ${allPages.length}`)
    console.log(`   - Статические: ${STATIC_PAGES.length}`)
    console.log(`   - Статьи блога: ${blogPosts.length}`)
    console.log(`   - Бизнес-кейсы: ${businessCases.length}\n`)

    // Генерируем XML
    const sitemapXML = generateSitemapXML(allPages)

    // Создаем директорию public если её нет
    const publicDir = join(rootDir, 'public')
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true })
    }

    // Сохраняем файл
    writeFileSync(SITEMAP_PATH, sitemapXML, 'utf-8')
    console.log(`✅ Sitemap успешно сгенерирован: ${SITEMAP_PATH.replace(rootDir, '')}`)
    console.log(`\n📝 Добавьте sitemap в robots.txt:`)
    console.log(`   Sitemap: ${BASE_URL}/sitemap.xml`)
  } catch (error) {
    console.error('\n❌ Ошибка при генерации sitemap:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
