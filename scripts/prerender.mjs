#!/usr/bin/env node

/**
 * Скрипт для pre-rendering всех страниц для SEO
 * Использование: npm run prerender
 * 
 * Этот скрипт:
 * 1. Запускает preview сервер Vite
 * 2. Использует Puppeteer для рендеринга всех страниц
 * 3. Сохраняет статические HTML файлы в dist
 */

import puppeteer from 'puppeteer'
import { spawn, execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Список всех публичных страниц для pre-rendering
const PUBLIC_ROUTES = [
  '/',
  '/blog',
  '/business-cases',
  '/partners',
  '/contacts',
  '/conference',
  '/calculator',
  '/politika-konfidentsialnosti',
  '/publichnaya-oferta',
]

/**
 * Загружает переменные окружения из .env файла
 */
function loadEnvFile() {
  const envPath = join(rootDir, '.env')
  if (!existsSync(envPath)) return {}

  const envContent = readFileSync(envPath, 'utf-8')
  const envVars = {}

  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return
    const match = trimmedLine.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      envVars[key] = value
    }
  })

  return envVars
}

/**
 * Загружает роуты динамических страниц бизнес-кейсов из Supabase
 */
async function fetchCaseRoutes() {
  try {
    const envVars = loadEnvFile()
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('  ⚠️  Supabase env не заданы — динамические кейсы не будут преренедрены')
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('business_cases')
      .select('id')
      .order('published_at', { ascending: false })

    if (error) {
      console.warn(`  ⚠️  Ошибка Supabase при загрузке кейсов: ${error.message}`)
      return []
    }

    if (!data || data.length === 0) {
      console.log('  ℹ️  Бизнес-кейсы в Supabase не найдены')
      return []
    }

    console.log(`  📋 Найдено кейсов для пре-рендера: ${data.length}`)
    return data.map(c => `/business-cases/${c.id}`)
  } catch (err) {
    console.warn(`  ⚠️  Не удалось загрузить кейсы из Supabase: ${err.message}`)
    return []
  }
}

/**
 * Pre-render страницу и сохранить HTML
 */
async function prerenderPage(browser, route, baseUrl, outputDir) {
  const page = await browser.newPage()
  
  try {
    const url = `${baseUrl}${route}`
    console.log(`  📄 Рендеринг: ${route}`)
    
    // Устанавливаем user-agent для поисковых ботов
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    )
    
    // Принимаем согласие на cookies автоматически для pre-rendering
    await page.evaluateOnNewDocument(() => {
      // Сохраняем согласие в localStorage перед загрузкой страницы
      // Используем правильный ключ из lib/consent.ts
      localStorage.setItem('pdn-consent', 'accepted')
    })
    
    // Переходим на страницу
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })
    
    // Ждем, пока ConsentGate обработает согласие и покажет контент
    try {
      await page.waitForFunction(
        () => {
          // Проверяем, что модальное окно согласия не видно
          const consentModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-[9999]"]')
          return !consentModal || consentModal.style.display === 'none'
        },
        { timeout: 5000 }
      )
    } catch (e) {
      // Если модальное окно все еще видно, пытаемся найти и нажать кнопку принятия
      try {
        const acceptButton = await page.$('button:has-text("Принять"), button:has-text("Согласен")')
        if (acceptButton) {
          await acceptButton.click()
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (e2) {
        // Игнорируем ошибки - возможно, согласие уже принято
      }
    }
    
    // Ждем дополнительное время для загрузки динамического контента и мета-тегов
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Для страниц конкретных кейсов ждем загрузки контента из Supabase
    const isCasePage = route.startsWith('/business-cases/') && route !== '/business-cases'
    if (isCasePage) {
      try {
        await page.waitForFunction(
          () => {
            const h1 = document.querySelector('article h1')
            return h1 && h1.textContent && !h1.textContent.includes('Загрузка')
          },
          { timeout: 15000 }
        )
      } catch (e) {
        console.warn(`    ⚠️  Контент кейса не загрузился вовремя для ${route} — сохраняем что есть`)
      }
    } else {
      // Для статических страниц ждем мета-теги
      try {
        await page.waitForFunction(
          () => {
            const title = document.querySelector('title')
            const metaDescription = document.querySelector('meta[name="description"]')
            return title && title.textContent && metaDescription
          },
          { timeout: 10000 }
        )
      } catch (e) {
        console.warn(`    ⚠️  Предупреждение: мета-теги могут быть не полностью загружены для ${route}`)
      }
    }
    
    // Получаем HTML
    const html = await page.content()
    
    // Определяем путь для сохранения файла
    const filePath = route === '/' 
      ? join(outputDir, 'index.html')
      : join(outputDir, route.slice(1), 'index.html')
    
    // Создаем директорию, если её нет
    const dirPath = dirname(filePath)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    
    // Сохраняем HTML
    writeFileSync(filePath, html, 'utf-8')
    
    console.log(`    ✅ Сохранено: ${filePath.replace(rootDir, '')}`)
  } catch (error) {
    console.error(`    ❌ Ошибка при рендеринге ${route}:`, error.message)
    throw error
  } finally {
    await page.close()
  }
}

/**
 * Запускает preview сервер и ждет его готовности
 */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'preview'], {
      cwd: rootDir,
      stdio: 'pipe',
      shell: true,
      detached: false, // Важно: не делаем detached, чтобы можно было убить дочерние процессы
    })
    
    let serverReady = false
    
    server.stdout.on('data', (data) => {
      const output = data.toString()
      if ((output.includes('Local:') || output.includes('localhost:')) && !serverReady) {
        serverReady = true
        console.log('  ✓ Preview сервер запущен\n')
        setTimeout(() => resolve(server), 2000) // Дополнительная задержка
      }
    })
    
    server.stderr.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Local:') || output.includes('localhost:')) {
        if (!serverReady) {
          serverReady = true
          console.log('  ✓ Preview сервер запущен\n')
          setTimeout(() => resolve(server), 2000)
        }
      }
    })
    
    // Таймаут на случай, если сервер уже запущен
    setTimeout(() => {
      if (!serverReady) {
        serverReady = true
        resolve(server)
      }
    }, 5000)
    
    server.on('error', reject)
  })
}

async function main() {
  console.log('🚀 Запуск pre-rendering для SEO...\n')
  
  // Проверяем, что dist существует
  const distPath = join(rootDir, 'dist')
  if (!existsSync(distPath)) {
    console.error('❌ Директория dist не найдена. Сначала выполните: npm run build')
    process.exit(1)
  }
  
  let previewServer = null
  
  try {
    // Запускаем preview сервер
    console.log('📦 Запуск preview сервера...')
    previewServer = await startPreviewServer()
    
    const baseUrl = 'http://localhost:4173'

    console.log('🔍 Загрузка динамических роутов из Supabase...')
    const caseRoutes = await fetchCaseRoutes()
    const routes = [...PUBLIC_ROUTES, ...caseRoutes]

    console.log(`\n📊 Итого страниц для пре-рендера: ${routes.length}`)
    console.log(`   - Статические: ${PUBLIC_ROUTES.length}`)
    console.log(`   - Кейсы: ${caseRoutes.length}\n`)
    
    console.log(`🔄 Начало pre-rendering ${routes.length} страниц...\n`)
    
    // Запускаем браузер
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    
    try {
      // Рендерим все страницы последовательно (для стабильности)
      for (const route of routes) {
        await prerenderPage(browser, route, baseUrl, distPath)
      }
      
      console.log(`\n✅ Pre-rendering завершен успешно! Отрендерено ${routes.length} страниц.`)
    } catch (error) {
      console.error('\n❌ Ошибка при pre-rendering:', error.message)
      process.exit(1)
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message)
    process.exit(1)
  } finally {
    // Останавливаем preview сервер
    if (previewServer) {
      try {
        console.log('\n🛑 Остановка preview сервера...')
        // Останавливаем процесс
        previewServer.kill('SIGTERM')
        
        // Ждем немного для корректной остановки
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Если процесс все еще работает, принудительно убиваем
        if (!previewServer.killed) {
          previewServer.kill('SIGKILL')
        }
        
        // Также убиваем процессы vite preview через pkill (для CI окружения)
        if (process.platform !== 'win32') {
          try {
            execSync('pkill -f "vite preview" || true', { stdio: 'ignore' })
          } catch (e) {
            // Игнорируем ошибки
          }
        }
        
        console.log('✅ Preview сервер остановлен')
      } catch (error) {
        console.warn('⚠️  Предупреждение при остановке сервера:', error.message)
      }
    }
    
    // Явно завершаем процесс после завершения всех операций
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('Критическая ошибка:', error)
  process.exit(1)
})
