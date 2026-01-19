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

const BUSINESS_CASES: BusinessCase[] = [
  {
    id: 'beauty-salon',
    title: 'Салон красоты',
    industry: 'Beauty & Wellness',
    description:
      'ИИ-ассистент принимает записи 24/7, консультирует по услугам, напоминает о визитах и обрабатывает отмены. Автоматизация освободила администраторов для работы с VIP-клиентами.',
    challenge: 'Потеря клиентов из-за занятой линии в пиковые часы',
    solution: 'Мультиканальный ИИ-ассистент с интеграцией в систему бронирования',
    image: '/modern-beauty-salon.png',
    results: [
      { icon: 'Users', label: 'Клиентов', value: '+180%', color: 'text-primary' },
      { icon: 'TrendingUp', label: 'Конверсия', value: '+65%', color: 'text-green-500' },
      { icon: 'Clock', label: 'Время ответа', value: '< 30 сек', color: 'text-blue-500' },
    ],
    content: `<h2>О проекте</h2>
      <p>Салон красоты премиум-класса столкнулся с проблемой потери клиентов в пиковые часы работы. Администраторы не успевали обрабатывать все входящие звонки, что приводило к пропущенным записям и недовольству клиентов.</p>
      
      <h2>Вызов</h2>
      <p>Основные проблемы, с которыми столкнулся салон:</p>
      <ul>
        <li><strong>Занятая линия:</strong> В пиковые часы (вечер, выходные) все линии были заняты</li>
        <li><strong>Потеря клиентов:</strong> До 40% потенциальных клиентов не могли дозвониться</li>
        <li><strong>Перегруженность администраторов:</strong> Сотрудники не успевали обрабатывать запросы</li>
        <li><strong>Нет работы в нерабочее время:</strong> Клиенты не могли записаться ночью или рано утром</li>
      </ul>
      
      <h2>Решение</h2>
      <p>Мы внедрили мультиканального ИИ-ассистента, который:</p>
      <ul>
        <li>Принимает записи через Telegram, WhatsApp и телефонные звонки 24/7</li>
        <li>Консультирует клиентов по услугам и ценам</li>
        <li>Автоматически интегрируется с системой бронирования</li>
        <li>Отправляет напоминания о визитах за день и за час</li>
        <li>Обрабатывает отмены и переносы записей</li>
        <li>Передает сложные запросы живым администраторам</li>
      </ul>
      
      <h2>Результаты</h2>
      <p>После внедрения ИИ-ассистента салон получил следующие результаты:</p>
      <ul>
        <li><strong>+180% новых клиентов</strong> - благодаря доступности 24/7</li>
        <li><strong>+65% конверсия</strong> - ИИ-ассистент грамотно обрабатывает возражения</li>
        <li><strong>&lt; 30 сек время ответа</strong> - клиенты получают мгновенные ответы</li>
        <li><strong>Освобождение администраторов</strong> - они теперь работают только с VIP-клиентами</li>
        <li><strong>Снижение пропущенных записей на 90%</strong></li>
      </ul>
      
      <h2>Технические детали</h2>
      <p>ИИ-ассистент был обучен на:</p>
      <ul>
        <li>Прайс-листе салона с описанием всех услуг</li>
        <li>Исторических диалогах с клиентами</li>
        <li>Скриптах продаж администраторов</li>
        <li>Часто задаваемых вопросах</li>
      </ul>
      <p>Интеграция выполнена с системой бронирования через API, что позволяет автоматически создавать записи и управлять расписанием.</p>`,
    publishedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cleaning-company',
    title: 'Клининговая компания',
    industry: 'Cleaning Services',
    description:
      'Внедрили ИИ-продавца, который консультирует по типам уборки, рассчитывает стоимость, формирует заявки и отправляет их менеджерам. Снизили нагрузку на колл-центр на 70%.',
    challenge: 'Высокая стоимость обработки входящих звонков',
    solution: 'ИИ-калькулятор услуг с автоматическим формированием коммерческих предложений',
    image: '/professional-cleaning-service-team.jpg',
    results: [
      { icon: 'Users', label: 'Заявок', value: '+210%', color: 'text-primary' },
      { icon: 'TrendingUp', label: 'Продажи', value: '+95%', color: 'text-green-500' },
      { icon: 'Clock', label: 'Работа', value: '24/7', color: 'text-blue-500' },
    ],
    content: `<h2>О проекте</h2>
      <p>Клининговая компания с большим объемом входящих звонков столкнулась с высокой стоимостью обработки каждого обращения. Колл-центр работал в две смены, но не справлялся с нагрузкой в пиковые периоды.</p>
      
      <h2>Вызов</h2>
      <p>Основные проблемы компании:</p>
      <ul>
        <li><strong>Высокая стоимость обработки:</strong> Каждый звонок требовал участия менеджера</li>
        <li><strong>Долгий расчет стоимости:</strong> Менеджеру требовалось время для расчета цены</li>
        <li><strong>Ограниченное время работы:</strong> Колл-центр работал только в рабочее время</li>
        <li><strong>Потеря заявок:</strong> В пиковые периоды часть звонков не обрабатывалась</li>
        <li><strong>Неравномерная нагрузка:</strong> В будни было мало звонков, в выходные - перегрузка</li>
      </ul>
      
      <h2>Решение</h2>
      <p>Мы создали ИИ-продавца с калькулятором услуг, который:</p>
      <ul>
        <li>Консультирует клиентов по типам уборки (генеральная, поддерживающая, после ремонта)</li>
        <li>Рассчитывает стоимость на основе площади, типа уборки и дополнительных услуг</li>
        <li>Формирует коммерческие предложения автоматически</li>
        <li>Отправляет заявки менеджерам для финального подтверждения</li>
        <li>Работает 24/7 через Telegram, WhatsApp и сайт</li>
        <li>Интегрирован с CRM для автоматического создания лидов</li>
      </ul>
      
      <h2>Результаты</h2>
      <p>После внедрения ИИ-продавца компания получила:</p>
      <ul>
        <li><strong>+210% заявок</strong> - благодаря доступности 24/7</li>
        <li><strong>+95% продаж</strong> - ИИ эффективно обрабатывает возражения и закрывает сделки</li>
        <li><strong>Работа 24/7</strong> - клиенты могут оставить заявку в любое время</li>
        <li><strong>-70% нагрузка на колл-центр</strong> - менеджеры обрабатывают только сложные случаи</li>
        <li><strong>Снижение стоимости обработки заявки на 80%</strong></li>
      </ul>
      
      <h2>Технические детали</h2>
      <p>ИИ-продавец включает:</p>
      <ul>
        <li>Калькулятор стоимости с учетом всех параметров уборки</li>
        <li>Базу знаний по типам уборки и услугам</li>
        <li>Интеграцию с CRM для автоматического создания лидов</li>
        <li>Систему уведомлений менеджеров о новых заявках</li>
      </ul>`,
    publishedAt: '2025-01-12T14:30:00Z',
  },
  {
    id: 'car-detailing',
    title: 'Детейлинг центр',
    industry: 'Auto Detailing',
    description:
      'ИИ-консультант помогает выбрать пакет услуг, показывает примеры работ, записывает на удобное время и отправляет напоминания. Клиенты получают мгновенные ответы и профессиональную консультацию.',
    challenge: 'Низкая конверсия из обращений в записи',
    solution: 'ИИ-консультант с визуальным каталогом услуг и онлайн-записью',
    image: '/car-detailing-center-luxury.jpg',
    results: [
      { icon: 'Users', label: 'Записей', value: '+145%', color: 'text-primary' },
      { icon: 'TrendingUp', label: 'Средний чек', value: '+42%', color: 'text-green-500' },
      { icon: 'Clock', label: 'Обработка', value: '1 мин', color: 'text-blue-500' },
    ],
    content: `<h2>О проекте</h2>
      <p>Детейлинг центр премиум-класса столкнулся с проблемой низкой конверсии из обращений в записи. Многие клиенты интересовались услугами, но не записывались из-за недостатка информации или долгого ожидания ответа.</p>
      
      <h2>Вызов</h2>
      <p>Основные проблемы центра:</p>
      <ul>
        <li><strong>Низкая конверсия:</strong> Только 20% обращений превращались в записи</li>
        <li><strong>Недостаток информации:</strong> Клиенты не понимали разницу между пакетами услуг</li>
        <li><strong>Долгое ожидание:</strong> Менеджеры не всегда могли сразу ответить</li>
        <li><strong>Нет визуализации:</strong> Клиенты не видели примеры работ</li>
        <li><strong>Сложность выбора:</strong> Много пакетов услуг, клиенты терялись</li>
      </ul>
      
      <h2>Решение</h2>
      <p>Мы создали ИИ-консультанта с визуальным каталогом, который:</p>
      <ul>
        <li>Помогает выбрать подходящий пакет услуг на основе типа автомобиля и потребностей</li>
        <li>Показывает примеры работ с фотографиями до и после</li>
        <li>Объясняет разницу между пакетами услуг</li>
        <li>Записывает на удобное время с учетом загруженности</li>
        <li>Отправляет напоминания о записи</li>
        <li>Предлагает дополнительные услуги для увеличения среднего чека</li>
      </ul>
      
      <h2>Результаты</h2>
      <p>После внедрения ИИ-консультанта центр получил:</p>
      <ul>
        <li><strong>+145% записей</strong> - благодаря улучшенной консультации</li>
        <li><strong>+42% средний чек</strong> - ИИ предлагает дополнительные услуги</li>
        <li><strong>1 мин обработка</strong> - клиенты получают мгновенные ответы</li>
        <li><strong>Конверсия выросла с 20% до 65%</strong></li>
        <li><strong>Снижение нагрузки на менеджеров на 60%</strong></li>
      </ul>
      
      <h2>Технические детали</h2>
      <p>ИИ-консультант включает:</p>
      <ul>
        <li>Визуальный каталог с примерами работ</li>
        <li>Систему рекомендаций на основе типа автомобиля</li>
        <li>Интеграцию с системой записи для проверки доступности</li>
        <li>Автоматические напоминания о записи</li>
      </ul>`,
    publishedAt: '2025-01-10T09:15:00Z',
  },
  {
    id: 'medical-clinic',
    title: 'Медицинская клиника',
    industry: 'Healthcare',
    description:
      'ИИ-регистратор записывает на прием, информирует о подготовке к процедурам, напоминает о визитах и отвечает на типовые вопросы. Разгрузили регистратуру и повысили качество сервиса.',
    challenge: 'Перегруженность регистратуры и пропущенные записи',
    solution: 'ИИ-регистратор с системой напоминаний и онлайн-консультациями',
    image: '/modern-medical-clinic-reception.png',
    results: [
      { icon: 'Users', label: 'Записей', value: '+165%', color: 'text-primary' },
      { icon: 'TrendingUp', label: 'Удержание', value: '+78%', color: 'text-green-500' },
      { icon: 'Clock', label: 'Доступность', value: '24/7', color: 'text-blue-500' },
    ],
    content: `<h2>О проекте</h2>
      <p>Медицинская клиника с большим потоком пациентов столкнулась с перегруженностью регистратуры. Регистраторы не успевали обрабатывать все звонки, что приводило к пропущенным записям и недовольству пациентов.</p>
      
      <h2>Вызов</h2>
      <p>Основные проблемы клиники:</p>
      <ul>
        <li><strong>Перегруженность регистратуры:</strong> Регистраторы не справлялись с потоком звонков</li>
        <li><strong>Пропущенные записи:</strong> До 30% звонков не обрабатывались</li>
        <li><strong>Нет работы в нерабочее время:</strong> Пациенты не могли записаться ночью</li>
        <li><strong>Повторные звонки:</strong> Пациенты забывали о записи и звонили повторно</li>
        <li><strong>Недостаток информации:</strong> Регистраторы не всегда могли ответить на все вопросы</li>
      </ul>
      
      <h2>Решение</h2>
      <p>Мы внедрили ИИ-регистратора, который:</p>
      <ul>
        <li>Записывает пациентов на прием к нужному врачу</li>
        <li>Информирует о подготовке к процедурам и анализам</li>
        <li>Отправляет напоминания о записи за день и за час</li>
        <li>Отвечает на типовые вопросы о клинике и услугах</li>
        <li>Работает 24/7 через Telegram, WhatsApp и телефон</li>
        <li>Интегрирован с системой записи клиники</li>
      </ul>
      
      <h2>Результаты</h2>
      <p>После внедрения ИИ-регистратора клиника получила:</p>
      <ul>
        <li><strong>+165% записей</strong> - благодаря доступности 24/7</li>
        <li><strong>+78% удержание</strong> - напоминания снизили количество пропущенных визитов</li>
        <li><strong>Работа 24/7</strong> - пациенты могут записаться в любое время</li>
        <li><strong>Снижение пропущенных записей на 85%</strong></li>
        <li><strong>Разгрузка регистратуры на 70%</strong></li>
      </ul>
      
      <h2>Технические детали</h2>
      <p>ИИ-регистратор включает:</p>
      <ul>
        <li>Интеграцию с системой записи клиники</li>
        <li>Базу знаний о подготовке к процедурам</li>
        <li>Систему автоматических напоминаний</li>
        <li>Соблюдение медицинской конфиденциальности</li>
      </ul>`,
    publishedAt: '2025-01-08T11:00:00Z',
  },
]

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
  }

  // Fallback: Тестовые данные
  await new Promise(resolve => setTimeout(resolve, 300))
  return BUSINESS_CASES
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
  }

  // Fallback: Тестовые данные
  await new Promise(resolve => setTimeout(resolve, 200))
  const businessCase = BUSINESS_CASES.find(c => c.id === id)
  return businessCase || null
}

