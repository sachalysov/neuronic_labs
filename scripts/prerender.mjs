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
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

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
          await page.waitForTimeout(1000)
        }
      } catch (e2) {
        // Игнорируем ошибки - возможно, согласие уже принято
      }
    }
    
    // Ждем дополнительное время для загрузки динамического контента и мета-тегов
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Ждем, пока мета-теги будут установлены
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
    const routes = PUBLIC_ROUTES
    
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
      previewServer.kill()
      console.log('\n🛑 Preview сервер остановлен')
    }
  }
}

main().catch((error) => {
  console.error('Критическая ошибка:', error)
  process.exit(1)
})
