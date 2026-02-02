export interface MetaTags {
  title?: string
  description?: string
  keywords?: string
  author?: string
  robots?: string
  canonical?: string
  
  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  ogSiteName?: string
  ogLocale?: string
  
  // Twitter
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  
  // Дополнительные
  image?: string
  url?: string
}

const DEFAULT_META: MetaTags = {
  title: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | Интеллектуальная автоматизация процессов | NEURONIC LABS',
  description: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу, автоматизация рутинных задач, счетов и отчётов. Нейросеть для бизнеса, генерация контента ИИ. Внедрение за 7-14 дней без кодинга.',
  keywords: 'автоматизация, чат бот, создать ИИ-помощника, интеллектуальная автоматизация, ИИ в работу, ИИ агенты, автоматизация бизнеса, автоматизация бизнес процессов, автоматизация с ИИ, интеграция ИИ, ИИ в бизнес, автоматизация счетов, автоматизация рутинных задач, нейросеть для бизнеса, генерация контента ИИ, автоматизация отчётов, создать ИИ агента, ИИ продавец, нейро-продавец, чат-бот для продаж, автоматизация продаж, Telegram бот, WhatsApp автоматизация, Avito автоматизация, AI для бизнеса, внедрение ИИ, автоматизация в Москве, автоматизация в СПб, n8n автоматизация, ИИ-сотрудник, виртуальный продавец',
  author: 'NEURONIC LABS',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  canonical: 'https://neuroniclabs.ru',
  ogTitle: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | NEURONIC LABS',
  ogDescription: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу, автоматизация рутинных задач. Внедрение за 7-14 дней.',
  ogImage: 'https://neuroniclabs.ru/images/robot-hero-2.jpeg',
  ogUrl: 'https://neuroniclabs.ru',
  ogType: 'website',
  ogSiteName: 'NEURONIC LABS',
  ogLocale: 'ru_RU',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | NEURONIC LABS',
  twitterDescription: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу.',
  twitterImage: 'https://neuroniclabs.ru/images/robot-hero-2.jpeg',
}

const BASE_URL = 'https://neuroniclabs.ru'

/**
 * Устанавливает или обновляет мета-тег в head документа
 */
function setMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

/**
 * Устанавливает или обновляет property мета-тег (для Open Graph)
 */
function setPropertyTag(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

/**
 * Устанавливает title страницы
 */
function setTitle(title: string) {
  document.title = title
  setMetaTag('title', title)
}

/**
 * Устанавливает canonical URL
 */
function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  
  link.setAttribute('href', url)
}

/**
 * Устанавливает мета-теги на странице
 */
export function setMetaTags(meta: Partial<MetaTags>) {
  const merged = { ...DEFAULT_META, ...meta }
  
  // Title
  if (merged.title) {
    setTitle(merged.title)
  }
  
  // Description
  if (merged.description) {
    setMetaTag('description', merged.description)
  }
  
  // Keywords
  if (merged.keywords) {
    setMetaTag('keywords', merged.keywords)
  }
  
  // Author
  if (merged.author) {
    setMetaTag('author', merged.author)
  }
  
  // Robots
  if (merged.robots) {
    setMetaTag('robots', merged.robots)
    setMetaTag('googlebot', merged.robots)
    setMetaTag('yandex', merged.robots)
  }
  
  // Canonical
  const canonicalUrl = merged.canonical || merged.url || DEFAULT_META.canonical
  if (canonicalUrl) {
    setCanonical(canonicalUrl)
  }
  
  // Open Graph
  const ogTitle = merged.ogTitle || merged.title || DEFAULT_META.ogTitle
  const ogDescription = merged.ogDescription || merged.description || DEFAULT_META.ogDescription
  const ogImage = merged.ogImage || merged.image || DEFAULT_META.ogImage
  const ogUrl = merged.ogUrl || merged.url || DEFAULT_META.ogUrl
  
  if (ogTitle) {
    setPropertyTag('og:title', ogTitle)
  }
  if (ogDescription) {
    setPropertyTag('og:description', ogDescription)
  }
  if (ogImage) {
    setPropertyTag('og:image', ogImage)
    setPropertyTag('og:image:width', '1200')
    setPropertyTag('og:image:height', '630')
    setPropertyTag('og:image:alt', ogTitle || 'NEURONIC LABS - Автоматизация бизнеса с ИИ')
  }
  if (ogUrl) {
    setPropertyTag('og:url', ogUrl)
  }
  if (merged.ogType) {
    setPropertyTag('og:type', merged.ogType)
  }
  if (merged.ogSiteName) {
    setPropertyTag('og:site_name', merged.ogSiteName)
  }
  if (merged.ogLocale) {
    setPropertyTag('og:locale', merged.ogLocale)
  }
  
  // Twitter
  const twitterTitle = merged.twitterTitle || merged.title || DEFAULT_META.twitterTitle
  const twitterDescription = merged.twitterDescription || merged.description || DEFAULT_META.twitterDescription
  const twitterImage = merged.twitterImage || merged.image || DEFAULT_META.twitterImage
  
  if (merged.twitterCard) {
    setMetaTag('twitter:card', merged.twitterCard)
  }
  if (twitterTitle) {
    setMetaTag('twitter:title', twitterTitle)
  }
  if (twitterDescription) {
    setMetaTag('twitter:description', twitterDescription)
  }
  if (twitterImage) {
    setMetaTag('twitter:image', twitterImage)
  }
  if (merged.ogUrl || merged.url) {
    setMetaTag('twitter:url', merged.ogUrl || merged.url || DEFAULT_META.ogUrl || '')
  }
}

/**
 * Сбрасывает мета-теги к значениям по умолчанию
 */
export function resetMetaTags() {
  setMetaTags(DEFAULT_META)
}

/**
 * Хелпер для создания мета-тегов для страницы блога
 */
export function createBlogMetaTags(title: string, description?: string, image?: string, url?: string): MetaTags {
  const fullUrl = url ? `${BASE_URL}${url}` : `${BASE_URL}/blog`
  
  return {
    title: `${title} | Блог | NEURONIC LABS`,
    description: description || 'Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях',
    keywords: 'блог, статьи, автоматизация, ИИ, чат-боты, бизнес, технологии',
    canonical: fullUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage: image || `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'article',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image || `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для главной страницы
 */
export function createHomeMetaTags(): MetaTags {
  return DEFAULT_META
}

/**
 * Хелпер для создания мета-тегов для страницы кейсов
 */
export function createBusinessCaseMetaTags(title: string, description?: string, image?: string, url?: string): MetaTags {
  const fullUrl = url ? `${BASE_URL}${url}` : `${BASE_URL}/business-cases`
  
  return {
    title: `${title} | Кейсы бизнеса | NEURONIC LABS`,
    description: description || 'Реальные кейсы внедрения ИИ-автоматизации в бизнес. Узнайте, как компании увеличили продажи и оптимизировали процессы.',
    keywords: 'кейсы, бизнес-кейсы, автоматизация, ИИ, успешные проекты, внедрение ИИ',
    canonical: fullUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage: image || `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'article',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image || `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для страницы партнерской программы
 */
export function createPartnerMetaTags(): MetaTags {
  const fullUrl = `${BASE_URL}/partners`
  
  return {
    title: 'Партнерская программа | NEURONIC LABS',
    description: 'Привлекайте клиентов — получайте вознаграждение до 31 500 рублей за одного! Партнерская программа по внедрению нейро-продавцов и автоматизации бизнеса.',
    keywords: 'партнерская программа, партнерство, агентство, автоматизация, ИИ, комиссия, вознаграждение',
    canonical: fullUrl,
    ogTitle: 'Партнерская программа | NEURONIC LABS',
    ogDescription: 'Привлекайте клиентов — получайте вознаграждение до 31 500 рублей за одного!',
    ogImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'website',
    twitterTitle: 'Партнерская программа | NEURONIC LABS',
    twitterDescription: 'Привлекайте клиентов — получайте вознаграждение до 31 500 рублей за одного!',
    twitterImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для страницы контактов
 */
export function createContactsMetaTags(): MetaTags {
  const fullUrl = `${BASE_URL}/contacts`
  
  return {
    title: 'Контакты | NEURONIC LABS',
    description: 'Свяжитесь с нами любым удобным способом. Телефон, email, Telegram. NEURONIC LABS — агентство по внедрению нейро-продавцов и автоматизации бизнеса.',
    keywords: 'контакты, связаться, телефон, email, telegram, агентство, автоматизация, ИИ',
    canonical: fullUrl,
    ogTitle: 'Контакты | NEURONIC LABS',
    ogDescription: 'Свяжитесь с нами любым удобным способом. Телефон, email, Telegram.',
    ogImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'website',
    twitterTitle: 'Контакты | NEURONIC LABS',
    twitterDescription: 'Свяжитесь с нами любым удобным способом. Телефон, email, Telegram.',
    twitterImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для страницы участников конференции
 */
export function createConferenceMetaTags(): MetaTags {
  const fullUrl = `${BASE_URL}/conference`
  
  return {
    title: 'Для участников конференции | NEURONIC LABS',
    description: 'Специальные предложения для участников AI-Fest. Бесплатный аудит бизнеса и эксклюзивные материалы.',
    keywords: 'конференция, AI-Fest, участники, бесплатный аудит, автоматизация, ИИ',
    canonical: fullUrl,
    ogTitle: 'Для участников конференции | NEURONIC LABS',
    ogDescription: 'Специальные предложения для участников AI-Fest. Бесплатный аудит бизнеса и эксклюзивные материалы.',
    ogImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'website',
    twitterTitle: 'Для участников конференции | NEURONIC LABS',
    twitterDescription: 'Специальные предложения для участников AI-Fest. Бесплатный аудит бизнеса и эксклюзивные материалы.',
    twitterImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для страницы политики конфиденциальности
 */
export function createPrivacyPolicyMetaTags(): MetaTags {
  const fullUrl = `${BASE_URL}/politika-konfidentsialnosti`
  
  return {
    title: 'Политика конфиденциальности | NEURONIC LABS',
    description: 'Политика конфиденциальности и обработки персональных данных в соответствии с Федеральным законом № 152-ФЗ. Информация о сборе, использовании и защите персональных данных.',
    keywords: 'политика конфиденциальности, персональные данные, 152-ФЗ, защита данных, обработка данных',
    canonical: fullUrl,
    ogTitle: 'Политика конфиденциальности | NEURONIC LABS',
    ogDescription: 'Политика конфиденциальности и обработки персональных данных в соответствии с Федеральным законом № 152-ФЗ.',
    ogImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'website',
    twitterTitle: 'Политика конфиденциальности | NEURONIC LABS',
    twitterDescription: 'Политика конфиденциальности и обработки персональных данных в соответствии с Федеральным законом № 152-ФЗ.',
    twitterImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}

/**
 * Хелпер для создания мета-тегов для страницы публичной оферты
 */
export function createOfferMetaTags(): MetaTags {
  const fullUrl = `${BASE_URL}/publichnaya-oferta`

  return {
    title: 'Публичная оферта | Условия использования | NEURONIC LABS',
    description: 'Публичная оферта и условия предоставления услуг NEURONIC LABS. Описание услуг, условия оплаты, ответственность сторон, возврат средств.',
    keywords: 'публичная оферта, условия использования, договор оферты, услуги, NEURONIC LABS',
    canonical: fullUrl,
    ogTitle: 'Публичная оферта | Условия использования | NEURONIC LABS',
    ogDescription: 'Публичная оферта и условия предоставления услуг NEURONIC LABS. Описание услуг, условия оплаты.',
    ogImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    ogUrl: fullUrl,
    ogType: 'website',
    twitterTitle: 'Публичная оферта | Условия использования | NEURONIC LABS',
    twitterDescription: 'Публичная оферта и условия предоставления услуг NEURONIC LABS.',
    twitterImage: `${BASE_URL}/images/robot-hero-2.jpeg`,
    url: fullUrl,
  }
}