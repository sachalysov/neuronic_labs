#!/usr/bin/env node

/**
 * Скрипт для конвертации изображений в WebP формат
 * Использование: node scripts/convert-to-webp.mjs
 * 
 * Требования:
 * - sharp установлен: npm install sharp
 * 
 * Скрипт конвертирует все JPG/JPEG/PNG изображения в public/images в WebP
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const imagesDir = join(rootDir, 'public', 'images')

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png']
const WEBP_QUALITY = 85 // Качество WebP (0-100)

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath)
    return true
  } catch (error) {
    console.error(`Ошибка при конвертации ${inputPath}:`, error.message)
    return false
  }
}

async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase()
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return
  }

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  
  // Проверяем, существует ли уже WebP версия
  try {
    await stat(webpPath)
    console.log(`  ⏭️  Пропущено (уже существует): ${webpPath.replace(rootDir, '')}`)
    return
  } catch {
    // Файл не существует, продолжаем
  }

  console.log(`  🔄 Конвертация: ${filePath.replace(rootDir, '')} -> ${webpPath.replace(rootDir, '')}`)
  const success = await convertToWebP(filePath, webpPath)
  
  if (success) {
    console.log(`  ✅ Готово: ${webpPath.replace(rootDir, '')}`)
  }
}

async function processDirectory(dir) {
  try {
    const files = await readdir(dir)
    
    for (const file of files) {
      const filePath = join(dir, file)
      const stats = await stat(filePath)
      
      if (stats.isDirectory()) {
        await processDirectory(filePath)
      } else if (stats.isFile()) {
        await processFile(filePath)
      }
    }
  } catch (error) {
    console.error(`Ошибка при обработке директории ${dir}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Начало конвертации изображений в WebP...\n')
  
  try {
    await processDirectory(imagesDir)
    console.log('\n✅ Конвертация завершена!')
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message)
    process.exit(1)
  }
}

main()
