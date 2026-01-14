import { supabase } from '@/lib/supabase'

export async function uploadImageToSupabase(
  file: File,
  sessionId: string
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase клиент не инициализирован')
  }

  // Генерируем уникальное имя файла
  const fileExt = file.name.split('.').pop()
  const fileName = `${sessionId}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  
  // Загружаем файл в bucket 'chat-images' (создайте его в Supabase Storage)
  const { data, error } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Ошибка загрузки изображения:', error)
    throw new Error(`Не удалось загрузить изображение: ${error.message}`)
  }

  // Получаем публичный URL
  const { data: urlData } = supabase.storage
    .from('chat-images')
    .getPublicUrl(data.path)

  if (!urlData?.publicUrl) {
    throw new Error('Не удалось получить публичный URL изображения')
  }

  return urlData.publicUrl
}

