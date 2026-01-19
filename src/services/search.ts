import { fetchBlogPosts, type BlogPost } from './blog'
import { fetchBusinessCases, type BusinessCase } from './business-cases'

export interface SearchResult {
  id: string
  type: 'section' | 'blog' | 'case' | 'page'
  title: string
  text: string
  url: string
  metadata?: {
    tags?: string[]
    author?: string
    publishedAt?: string
    industry?: string
  }
}

// Индексация статических страниц
const STATIC_PAGES = [
  {
    id: 'partners',
    type: 'page' as const,
    title: 'Партнерская программа',
    content: `Партнерская программа NEURONIC LABS. Привлекайте клиентов и получайте вознаграждение до 31 500 рублей за одного клиента. Комиссия 17-20% с продажи, выплаты в течение 5 рабочих дней. Для маркетинговых агентств, SMM-специалистов, коучей и других специалистов работающих с предпринимателями.`,
    url: '/partners'
  },
  {
    id: 'contacts',
    type: 'page' as const,
    title: 'Контакты',
    content: `Контакты NEURONIC LABS. Телефон: +7 993 079 91 77, +7 905 009 91 77. Email: neuroniclabs@yandex.ru, contact@neuroniclabs.ru. Telegram: @aslysov, @neuroniclabs. Агентство по внедрению нейро-продавцов и автоматизации бизнеса. Москва, Россия.`,
    url: '/contacts'
  },
  {
    id: 'blog-list',
    type: 'page' as const,
    title: 'Блог',
    content: `Блог NEURONIC LABS. Полезные статьи об автоматизации бизнеса, ИИ-технологиях, чат-ботах и эффективных решениях для бизнеса. Узнайте, как внедрить ИИ-агентов и автоматизировать бизнес-процессы.`,
    url: '/blog'
  },
  {
    id: 'business-cases-list',
    type: 'page' as const,
    title: 'Кейсы бизнеса',
    content: `Кейсы внедрения ИИ-автоматизации. Реальные примеры успешного внедрения ИИ-агентов и чат-ботов в различные отрасли: салоны красоты, клининговые компании, детейлинг центры, медицинские клиники.`,
    url: '/business-cases'
  }
]

// Статические описания секций главной страницы
const HOME_SECTIONS = [
  {
    id: 'demo-chat',
    title: 'Чат-бот',
    content: `Попробуйте ИИ-продавца прямо сейчас. Демо-версия показывает базовые возможности. Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и закрывает возражения 24/7.`
  },
  {
    id: 'product',
    title: 'О продукте',
    content: `Создаём ИИ-агента и автоматизируем бизнес-процессы за 14 дней. Интеллектуальная автоматизация с ИИ: создаём ИИ-агента, чат-бота, автоматизируем рутинные задачи, счета и отчёты. Интеграция ИИ в работу увеличивает конверсию в 2-3 раза. ИИ-сотрудник работает 24/7, мгновенные ответы клиентам, в 2-3 раза больше клиентов, сокращение фонда оплаты труда.`
  },
  {
    id: 'services',
    title: 'Сценарии использования',
    content: `Сценарии использования ИИ-автоматизации. Продажи: консультация клиентов, презентация продуктов, закрытие сделок. Поддержка: ответы на частые вопросы, решение проблем клиентов 24/7. Лидогенерация: квалификация лидов, сбор контактов, запись на встречи. Консультации: экспертные советы, подбор решений, персональные рекомендации.`
  },
  {
    id: 'process',
    title: 'Этапы работ',
    content: `Как мы работаем. Анализ бизнеса: изучаем ваши процессы, потребности клиентов и точки автоматизации. Создание ИИ-агента: создаём ИИ-помощника, чат-бота и обучаем под специфику вашего бизнеса. Интеграция ИИ в работу: интегрируем ИИ-агента с вашими системами, автоматизируем счета и отчёты. Обеспечиваем постоянную техподдержку.`
  },
  {
    id: 'about',
    title: 'О нас',
    content: `О нас NEURONIC LABS. Команда экспертов по созданию ИИ-агентов, чат-ботов и интеллектуальной автоматизации бизнес-процессов. 90+ успешно внедренных проектов. 5 лет опыта в разработке ИИ-решений. Среднее время внедрения 14 дней. Интеграция ИИ в работу, автоматизация рутинных задач, счетов и отчётов.`
  },
  {
    id: 'pricing',
    title: 'Тарифы и цены',
    content: `Тарифы и цены на внедрение ИИ-автоматизации. Выберите подходящий тариф для вашего бизнеса. Внедрение ИИ-агента и чат-бота за 14 дней. Поддержка и обновления. Интеграция с вашими системами.`
  },
  {
    id: 'testimonials',
    title: 'Отзывы клиентов',
    content: `Отзывы клиентов о работе NEURONIC LABS. Реальные отзывы от компаний, которые внедрили ИИ-автоматизацию. Результаты внедрения, увеличение конверсии, сокращение расходов, улучшение качества сервиса.`
  },
  {
    id: 'faq',
    title: 'Частые вопросы',
    content: `Часто задаваемые вопросы об ИИ-автоматизации. Как работает ИИ-агент? Сколько времени занимает внедрение? Какие каналы поддерживаются? Как происходит интеграция? Стоимость и тарифы. Техническая поддержка.`
  }
]

// Кеш для результатов поиска
let blogPostsCache: BlogPost[] | null = null
let businessCasesCache: BusinessCase[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

// Загрузка данных с кешированием
async function loadData() {
  const now = Date.now()
  if (now - cacheTimestamp < CACHE_DURATION && blogPostsCache && businessCasesCache) {
    return { posts: blogPostsCache, cases: businessCasesCache }
  }

  try {
    const [posts, cases] = await Promise.all([
      fetchBlogPosts(),
      fetchBusinessCases()
    ])
    
    blogPostsCache = posts
    businessCasesCache = cases
    cacheTimestamp = now
    
    return { posts, cases }
  } catch (error) {
    console.error('Ошибка загрузки данных для поиска:', error)
    return { 
      posts: blogPostsCache || [], 
      cases: businessCasesCache || [] 
    }
  }
}

// Нормализация текста для поиска
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // Удаляем HTML теги
    .replace(/\s+/g, ' ')
    .trim()
}

// Извлечение текста из HTML
function extractTextFromHtml(html: string, maxLength = 200): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Поиск по всем источникам
export async function search(query: string): Promise<SearchResult[]> {
  const trimmedQuery = query.trim()
  if (trimmedQuery.length < 2) {
    return []
  }

  const normalizedQuery = normalizeText(trimmedQuery)
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0)
  
  const results: SearchResult[] = []
  
  // Загружаем данные
  const { posts, cases } = await loadData()
  
  // Поиск по блогам
  posts.forEach(post => {
    const searchableText = normalizeText(
      `${post.title} ${post.excerpt || ''} ${extractTextFromHtml(post.content || '', 500)}`
    )
    const hasMatch = queryWords.every(word => searchableText.includes(word)) ||
                     normalizedQuery.length > 0 && searchableText.includes(normalizedQuery)
    
    if (hasMatch) {
      const excerpt = post.excerpt || extractTextFromHtml(post.content || '', 150)
      const matchIndex = excerpt.toLowerCase().indexOf(trimmedQuery.toLowerCase())
      const start = Math.max(0, matchIndex > -1 ? matchIndex - 40 : 0)
      const end = Math.min(excerpt.length, matchIndex > -1 ? matchIndex + trimmedQuery.length + 40 : 150)
      const snippet = excerpt.substring(start, end).trim()
      
      results.push({
        id: `blog-${post.id}`,
        type: 'blog',
        title: post.title,
        text: snippet || excerpt,
        url: `/blog/${post.slug}`,
        metadata: {
          tags: post.tags,
          author: post.author,
          publishedAt: post.publishedAt
        }
      })
    }
  })
  
  // Поиск по кейсам
  cases.forEach(businessCase => {
    const searchableText = normalizeText(
      `${businessCase.title} ${businessCase.description} ${businessCase.challenge} ${businessCase.solution} ${extractTextFromHtml(businessCase.content || '', 500)}`
    )
    const hasMatch = queryWords.every(word => searchableText.includes(word)) ||
                     normalizedQuery.length > 0 && searchableText.includes(normalizedQuery)
    
    if (hasMatch) {
      const description = businessCase.description || extractTextFromHtml(businessCase.content || '', 150)
      const matchIndex = description.toLowerCase().indexOf(trimmedQuery.toLowerCase())
      const start = Math.max(0, matchIndex > -1 ? matchIndex - 40 : 0)
      const end = Math.min(description.length, matchIndex > -1 ? matchIndex + trimmedQuery.length + 40 : 150)
      const snippet = description.substring(start, end).trim()
      
      results.push({
        id: `case-${businessCase.id}`,
        type: 'case',
        title: businessCase.title,
        text: snippet || description,
        url: `/business-cases/${businessCase.id}`,
        metadata: {
          industry: businessCase.industry
        }
      })
    }
  })
  
  // Поиск по статическим страницам
  STATIC_PAGES.forEach(page => {
    const searchableText = normalizeText(`${page.title} ${page.content}`)
    const hasMatch = queryWords.every(word => searchableText.includes(word)) ||
                     normalizedQuery.length > 0 && searchableText.includes(normalizedQuery)
    
    if (hasMatch) {
      const matchIndex = page.content.toLowerCase().indexOf(trimmedQuery.toLowerCase())
      const start = Math.max(0, matchIndex > -1 ? matchIndex - 40 : 0)
      const end = Math.min(page.content.length, matchIndex > -1 ? matchIndex + trimmedQuery.length + 40 : 150)
      const snippet = page.content.substring(start, end).trim()
      
      results.push({
        id: page.id,
        type: page.type,
        title: page.title,
        text: snippet || page.content.substring(0, 150),
        url: page.url
      })
    }
  })
  
  // Поиск по секциям главной страницы (статические описания + динамический контент если доступен)
  HOME_SECTIONS.forEach(section => {
    const searchableText = normalizeText(`${section.title} ${section.content}`)
    const hasMatch = queryWords.every(word => searchableText.includes(word)) ||
                     normalizedQuery.length > 0 && searchableText.includes(normalizedQuery)
    
    if (hasMatch) {
      // Пытаемся получить актуальный контент с главной страницы, если она загружена
      let snippet = section.content
      if (typeof window !== 'undefined') {
        const element = document.querySelector(`#${section.id}`)
        if (element) {
          const text = element.textContent || ''
          const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase())
          if (matchIndex > -1) {
            const start = Math.max(0, matchIndex - 40)
            const end = Math.min(text.length, matchIndex + trimmedQuery.length + 40)
            snippet = text.substring(start, end).trim()
          } else {
            snippet = text.substring(0, 150).trim()
          }
        } else {
          // Если элемент не найден, используем статическое описание
          const matchIndex = section.content.toLowerCase().indexOf(trimmedQuery.toLowerCase())
          const start = Math.max(0, matchIndex > -1 ? matchIndex - 40 : 0)
          const end = Math.min(section.content.length, matchIndex > -1 ? matchIndex + trimmedQuery.length + 40 : 150)
          snippet = section.content.substring(start, end).trim()
        }
      }
      
      results.push({
        id: section.id,
        type: 'section',
        title: section.title,
        text: snippet || section.content.substring(0, 150),
        url: `/#${section.id}`
      })
    }
  })
  
  // Сортировка: сначала точные совпадения, потом по типу
  results.sort((a, b) => {
    const aExact = a.title.toLowerCase().includes(normalizedQuery) ? 1 : 0
    const bExact = b.title.toLowerCase().includes(normalizedQuery) ? 1 : 0
    if (aExact !== bExact) return bExact - aExact
    
    // Приоритет типов: blog > case > section > page
    const typePriority = { blog: 4, case: 3, section: 2, page: 1 }
    return (typePriority[b.type] || 0) - (typePriority[a.type] || 0)
  })
  
  return results.slice(0, 10) // Ограничиваем 10 результатами
}

// Очистка кеша (для обновления данных)
export function clearSearchCache() {
  blogPostsCache = null
  businessCasesCache = null
  cacheTimestamp = 0
}

