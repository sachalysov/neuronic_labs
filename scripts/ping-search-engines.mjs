#!/usr/bin/env node
/**
 * Пинг поисковиков для индексации sitemap.
 * Использование: node scripts/ping-search-engines.mjs
 */
const SITEMAP_URL = 'https://neuroniclabs.ru/sitemap.xml'

const PING_URLS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
]

async function ping(url) {
  try {
    const res = await fetch(url)
    return { url, ok: res.ok, status: res.status }
  } catch (e) {
    return { url, ok: false, error: e.message }
  }
}

async function main() {
  console.log('📤 Пинг поисковиков для индексации sitemap...\n')
  for (const url of PING_URLS) {
    const result = await ping(url)
    const name = new URL(url).hostname.replace(/^www\./, '')
    if (result.ok) {
      console.log(`✅ ${name}: OK (${result.status})`)
    } else {
      console.log(`⚠️  ${name}: ${result.error || result.status}`)
    }
  }
  console.log('\nГотово. Проверь сайт в Google Search Console и Яндекс.Вебмастер и добавь sitemap там.')
}

main()
