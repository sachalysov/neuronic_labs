import { supabase } from '@/lib/supabase'

export interface CalculatorPrice {
  id: string
  category: string
  option_name: string
  price: number
  display_order: number
  category_order: number
  created_at?: string
  updated_at?: string
}

export interface CalculatorCategory {
  category: string
  options: CalculatorPrice[]
  category_order: number
}

/**
 * Получить все цены калькулятора из Supabase
 */
export async function getCalculatorPrices(): Promise<CalculatorCategory[]> {
  if (!supabase) {
    console.warn('Supabase не настроен, используем значения по умолчанию')
    return getDefaultPrices()
  }

  try {
    const { data, error } = await supabase
      .from('calculator_prices')
      .select('*')
      .order('category_order', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Ошибка получения цен:', error)
      return getDefaultPrices()
    }

    if (!data || data.length === 0) {
      return getDefaultPrices()
    }

    // Группируем по категориям
    const categoriesMap = new Map<string, CalculatorCategory>()
    
    data.forEach((item) => {
      const price: CalculatorPrice = {
        id: item.id,
        category: item.category,
        option_name: item.option_name,
        price: parseFloat(item.price) || 0,
        display_order: item.display_order,
        category_order: item.category_order,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }

      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          category: item.category,
          options: [],
          category_order: item.category_order,
        })
      }

      categoriesMap.get(item.category)!.options.push(price)
    })

    return Array.from(categoriesMap.values())
  } catch (error) {
    console.error('Ошибка получения цен:', error)
    return getDefaultPrices()
  }
}

/**
 * Значения по умолчанию (fallback)
 */
function getDefaultPrices(): CalculatorCategory[] {
  return [
    {
      category: 'Количество каналов продаж',
      category_order: 1,
      options: [
        { id: '1', category: 'Количество каналов продаж', option_name: '1', price: 0, display_order: 1, category_order: 1 },
        { id: '2', category: 'Количество каналов продаж', option_name: '2', price: 5000, display_order: 2, category_order: 1 },
        { id: '3', category: 'Количество каналов продаж', option_name: '3', price: 10000, display_order: 3, category_order: 1 },
        { id: '4', category: 'Количество каналов продаж', option_name: '4 и более', price: 15000, display_order: 4, category_order: 1 },
      ],
    },
    {
      category: 'Где вести учет?',
      category_order: 2,
      options: [
        { id: '5', category: 'Где вести учет?', option_name: 'Таблицы для учета (google sheets и др.)', price: 0, display_order: 1, category_order: 2 },
        { id: '6', category: 'Где вести учет?', option_name: 'CRM система (bitrix24, ycients и др.)', price: 3000, display_order: 2, category_order: 2 },
      ],
    },
    {
      category: 'Дополнительные функции',
      category_order: 3,
      options: [
        { id: '7', category: 'Дополнительные функции', option_name: 'Анализ фотографий', price: 5000, display_order: 1, category_order: 3 },
        { id: '8', category: 'Дополнительные функции', option_name: 'Ежедневный отчет о продажах', price: 3000, display_order: 2, category_order: 3 },
        { id: '9', category: 'Дополнительные функции', option_name: 'Самообучение модели', price: 8000, display_order: 3, category_order: 3 },
      ],
    },
  ]
}

/**
 * Подписаться на изменения цен через Supabase Realtime
 */
export function subscribeToCalculatorPrices(
  callback: (prices: CalculatorCategory[]) => void
): () => void {
  if (!supabase) {
    return () => {}
  }

  const channel = supabase
    .channel('calculator_prices_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calculator_prices',
      },
      async () => {
        // При любом изменении перезагружаем все цены
        const prices = await getCalculatorPrices()
        callback(prices)
      }
    )
    .subscribe()

  return () => {
    if (supabase) {
      supabase.removeChannel(channel)
    }
  }
}

