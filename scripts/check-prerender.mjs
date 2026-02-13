#!/usr/bin/env node

/**
 * Скрипт для проверки, что pre-rendering работает корректно
 * Использование: node scripts/check-prerender.mjs
 */

import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const distDir = join(rootDir, 'dist')

const ROUTES = [
  { path: '/', file: 'index.html' },
  { path: '/blog', file: 'blog/index.html' },
  { path: '/business-cases', file: 'business-cases/index.html' },
  { path: '/partners', file: 'partners/index.html' },
  { path: '/contacts', file: 'contacts/index.html' },
  { path: '/conference', file: 'conference/index.html' },
  { path: '/calculator', file: 'calculator/index.html' },
  { path: '/politika-konfidentsialnosti', file: 'politika-konfidentsialnosti/index.html' },
  { path: '/publichnaya-oferta', file: 'publichnaya-oferta/index.html' },
]

function checkFile(filePath, route) {
  const fullPath = join(distDir, filePath)
  
  if (!existsSync(fullPath)) {
    console.log(`  ❌ ${route}: файл не найден (${filePath})`)
    return false
  }
  
  const content = readFileSync(fullPath, 'utf-8')
  
  // Проверяем наличие мета-тегов
  const hasTitle = /<title>.*?<\/title>/i.test(content)
  const hasDescription = /<meta\s+name=["']description["']/i.test(content)
  const hasOGTitle = /<meta\s+property=["']og:title["']/i.test(content)
  const hasOGDescription = /<meta\s+property=["']og:description["']/i.test(content)
  
  const checks = [
    { name: 'Title', passed: hasTitle },
    { name: 'Description', passed: hasDescription },
    { name: 'OG Title', passed: hasOGTitle },
    { name: 'OG Description', passed: hasOGDescription },
  ]
  
  const allPassed = checks.every(c => c.passed)
  
  if (allPassed) {
    console.log(`  ✅ ${route}: все проверки пройдены`)
  } else {
    console.log(`  ⚠️  ${route}: некоторые проверки не пройдены:`)
    checks.forEach(check => {
      if (!check.passed) {
        console.log(`     - ${check.name}: отсутствует`)
      }
    })
  }
  
  return allPassed
}

function main() {
  console.log('🔍 Проверка pre-rendered файлов...\n')
  
  if (!existsSync(distDir)) {
    console.error('❌ Директория dist не найдена. Сначала выполните: npm run build:prerender')
    process.exit(1)
  }
  
  let passed = 0
  let failed = 0
  
  ROUTES.forEach(({ path, file }) => {
    if (checkFile(file, path)) {
      passed++
    } else {
      failed++
    }
  })
  
  console.log(`\n📊 Результаты:`)
  console.log(`   ✅ Пройдено: ${passed}`)
  console.log(`   ❌ Провалено: ${failed}`)
  
  if (failed > 0) {
    console.log(`\n⚠️  Некоторые файлы не прошли проверку. Запустите: npm run build:prerender`)
    process.exit(1)
  } else {
    console.log(`\n✅ Все проверки пройдены успешно!`)
  }
}

main()
