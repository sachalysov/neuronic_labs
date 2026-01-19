import { supabase } from '@/lib/supabase'

const BUSINESS_CASES_BUCKET = 'business-cases-images'

export interface UploadImageResult {
  url: string
  path: string
}

/**
 * Загружает изображение в Supabase Storage
 * @param file - Файл изображения
 * @param folder - Папка для сохранения (опционально)
 * @returns URL загруженного изображения и путь к файлу
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadImageResult> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    throw new Error('Файл должен быть изображением')
  }

  // Проверяем размер файла (максимум 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Размер файла не должен превышать 5MB')
  }

  // Генерируем уникальное имя файла
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = file.name.split('.').pop() || 'jpg'
  const fileName = `${timestamp}-${randomString}.${fileExtension}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  try {
    // Загружаем файл в Storage
    const { error } = await supabase.storage
      .from(BUSINESS_CASES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Не перезаписываем существующие файлы
      })

    if (error) {
      console.error('Ошибка загрузки изображения:', error)
      
      // Специальная обработка ошибки отсутствия bucket
      if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
        throw new Error(
          'Bucket "business-cases-images" не найден в Supabase Storage. ' +
          'Пожалуйста, создайте bucket через Supabase Dashboard (Storage -> New bucket) ' +
          'или выполните SQL миграцию supabase_business_cases_storage.sql'
        )
      }
      
      throw new Error(`Ошибка загрузки: ${error.message}`)
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from(BUSINESS_CASES_BUCKET)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error('Не удалось получить публичный URL изображения')
    }

    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Неизвестная ошибка при загрузке изображения')
  }
}

/**
 * Удаляет изображение из Supabase Storage
 * @param path - Путь к файлу в Storage
 */
export async function deleteImage(path: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  try {
    const { error } = await supabase.storage
      .from(BUSINESS_CASES_BUCKET)
      .remove([path])

    if (error) {
      console.error('Ошибка удаления изображения:', error)
      throw new Error(`Ошибка удаления: ${error.message}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Неизвестная ошибка при удалении изображения')
  }
}

/**
 * Извлекает путь к файлу из публичного URL Supabase Storage
 * @param url - Публичный URL изображения
 * @returns Путь к файлу в Storage или null
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Формат URL: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

