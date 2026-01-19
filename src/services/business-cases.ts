import { supabase } from '@/lib/supabase'

export interface BusinessCase {
  id: string
  title: string
  industry: string
  description: string
  challenge: string
  solution: string
  image: string
  results: Array<{
    icon: string
    label: string
    value: string
    color: string
  }>
  content?: string // Полный контент для страницы кейса
  publishedAt?: string
}

// Преобразование данных из Supabase в формат BusinessCase
function mapSupabaseCase(caseData: any): BusinessCase {
  const id = typeof caseData.id === 'string' ? caseData.id : String(caseData.id)
  
  // Преобразуем дату в ISO строку, если нужно
  let publishedAt = caseData.published_at
  if (publishedAt instanceof Date) {
    publishedAt = publishedAt.toISOString()
  } else if (typeof publishedAt === 'string') {
    if (!publishedAt.includes('T')) {
      publishedAt = publishedAt + 'T00:00:00Z'
    }
  }
  
  // Обработка results из JSONB
  let results: Array<{ icon: string; label: string; value: string; color: string }> = []
  if (caseData.results) {
    if (Array.isArray(caseData.results)) {
      results = caseData.results
    } else if (typeof caseData.results === 'string') {
      try {
        const parsed = JSON.parse(caseData.results)
        if (Array.isArray(parsed)) {
          results = parsed
        }
      } catch {
        // Если не удалось распарсить, используем пустой массив
        results = []
      }
    }
  }
  
  return {
    id,
    title: caseData.title || 'Без названия',
    industry: caseData.industry || '',
    description: caseData.description || '',
    challenge: caseData.challenge || '',
    solution: caseData.solution || '',
    image: caseData.image_url || '',
    results,
    content: caseData.content || undefined,
    publishedAt: publishedAt || undefined,
  }
}

export async function fetchBusinessCases(): Promise<BusinessCase[]> {
  console.log('[Business Cases Service] Начало загрузки бизнес-кейсов...')
  
  // Приоритет 1: Supabase
  if (supabase) {
    try {
      console.log('[Business Cases Service] Запрос к Supabase: загрузка бизнес-кейсов...')
      const startTime = performance.now()
      
      const { data, error } = await supabase
        .from('business_cases')
        .select('*')
        .order('published_at', { ascending: false })

      const endTime = performance.now()
      console.log(`[Business Cases Service] Запрос выполнен за ${(endTime - startTime).toFixed(2)}ms`)

      if (error) {
        console.error('[Business Cases Service] Ошибка Supabase:', error)
        console.error('[Business Cases Service] Код ошибки:', error.code)
        console.error('[Business Cases Service] Сообщение:', error.message)
        console.error('[Business Cases Service] Детали ошибки:', JSON.stringify(error, null, 2))
        
        // При ошибке возвращаем пустой массив, не переходим к fallback
        console.warn('[Business Cases Service] Возвращаем пустой массив из-за ошибки')
        return []
      }
      
      if (data !== null && data !== undefined) {
        console.log(`[Business Cases Service] Получено кейсов из Supabase: ${data.length}`)
        if (data.length > 0) {
          console.log('[Business Cases Service] Пример первой записи:', {
            id: data[0].id,
            title: data[0].title,
            hasContent: !!data[0].content,
            results: data[0].results
          })
          
          const mapped = data.map(mapSupabaseCase)
          console.log(`[Business Cases Service] Успешно загружены и преобразованы ${mapped.length} кейсов из Supabase`)
          return mapped
        } else {
          console.log('[Business Cases Service] Таблица business_cases пуста, возвращаем пустой массив')
          return []
        }
      }
      
      console.warn('[Business Cases Service] Supabase вернул null/undefined, возвращаем пустой массив')
      return []
    } catch (error) {
      console.error('[Business Cases Service] Исключение при получении кейсов из Supabase:', error)
      if (error instanceof Error) {
        console.error('[Business Cases Service] Сообщение об ошибке:', error.message)
        console.error('[Business Cases Service] Stack:', error.stack)
      }
      // При исключении тоже возвращаем пустой массив
      return []
    }
  } else {
    console.warn('[Business Cases Service] Supabase клиент не инициализирован. Проверьте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY')
    return []
  }
}

export async function fetchBusinessCaseById(id: string): Promise<BusinessCase | null> {
  // Приоритет 1: Supabase
  if (supabase) {
    try {
      console.log(`[Business Cases Service] Запрос к Supabase: загрузка кейса с ID ${id}...`)
      const { data, error } = await supabase
        .from('business_cases')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[Business Cases Service] Ошибка Supabase:', error)
        console.error('[Business Cases Service] Код ошибки:', error.code)
        // При ошибке (например, кейс не найден) возвращаем null
        return null
      }
      
      if (data) {
        console.log('[Business Cases Service] Кейс найден в Supabase')
        return mapSupabaseCase(data)
      }
      
      console.log('[Business Cases Service] Кейс не найден в Supabase')
      return null
    } catch (error) {
      console.error('[Business Cases Service] Ошибка при получении кейса из Supabase:', error)
      if (error instanceof Error) {
        console.error('[Business Cases Service] Сообщение об ошибке:', error.message)
      }
      return null
    }
  } else {
    console.warn('[Business Cases Service] Supabase клиент не инициализирован. Проверьте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY')
    return null
  }
}

