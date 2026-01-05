import type { MetaTags } from '@/lib/meta'
import { BASE_URL, DEFAULT_SITE_NAME, normalizeUrl } from '@/lib/meta'

const DEFAULT_IMAGE = `${BASE_URL}/images/robot-hero-2.jpeg`
const DEFAULT_KEYWORDS = 'автоматизация, чат бот, создать ИИ-помощника, интеллектуальная автоматизация, ИИ в работу, ИИ агенты, автоматизация бизнеса, автоматизация бизнес процессов, автоматизация с ИИ, интеграция ИИ, ИИ в бизнес, автоматизация счетов, автоматизация рутинных задач, нейросеть для бизнеса, генерация контента ИИ, автоматизация отчётов, создать ИИ агента, ИИ продавец, нейро-продавец, чат-бот для продаж, автоматизация продаж, Telegram бот, WhatsApp автоматизация, Avito автоматизация, AI для бизнеса, внедрение ИИ, автоматизация в Москве, автоматизация в СПб, n8n автоматизация, ИИ-сотрудник, виртуальный продавец'
const DEFAULT_AUTHOR = 'NEURONIC LABS'
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

/**
 * Базовые мета-теги (общие для всех страниц)
 */
const baseMeta: Partial<MetaTags> = {
  author: DEFAULT_AUTHOR,
  robots: DEFAULT_ROBOTS,
  ogSiteName: DEFAULT_SITE_NAME,
  ogLocale: 'ru_RU',
  twitterCard: 'summary_large_image',
  language: 'Russian',
  subject: 'Автоматизация бизнеса с ИИ, создание ИИ-агентов и чат-ботов',
  classification: 'Бизнес, Автоматизация, Искусственный интеллект, Чат-боты',
  category: 'Автоматизация бизнеса, ИИ-агенты, Чат-боты',
}

/**
 * Мета-теги для главной страницы
 */
export const homeMeta: MetaTags = {
  ...baseMeta,
  title: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | Интеллектуальная автоматизация процессов | NEURONIC LABS',
  description: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу, автоматизация рутинных задач, счетов и отчётов. Нейросеть для бизнеса, генерация контента ИИ. Внедрение за 7-14 дней без кодинга.',
  keywords: DEFAULT_KEYWORDS,
  canonical: BASE_URL,
  ogType: 'website',
  ogUrl: BASE_URL,
  ogTitle: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | NEURONIC LABS',
  ogDescription: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу, автоматизация рутинных задач. Внедрение за 7-14 дней.',
  ogImage: DEFAULT_IMAGE,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: 'NEURONIC LABS - Автоматизация бизнеса с ИИ',
  twitterUrl: BASE_URL,
  twitterTitle: 'Автоматизация бизнеса с ИИ | Создать ИИ-агента и чат-бота | NEURONIC LABS',
  twitterDescription: 'Создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу.',
  twitterImage: DEFAULT_IMAGE,
}

/**
 * Мета-теги для страницы блога
 */
export const blogMeta: MetaTags = {
  ...baseMeta,
  title: 'Блог об автоматизации бизнеса и ИИ | NEURONIC LABS',
  description: 'Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях для развития вашего бизнеса.',
  keywords: 'блог об автоматизации, статьи про ИИ, автоматизация бизнеса, ИИ технологии, бизнес автоматизация',
  canonical: normalizeUrl('/blog'),
  ogType: 'website',
  ogUrl: normalizeUrl('/blog'),
  ogTitle: 'Блог об автоматизации бизнеса и ИИ | NEURONIC LABS',
  ogDescription: 'Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях.',
  ogImage: DEFAULT_IMAGE,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: 'Блог NEURONIC LABS - Статьи об автоматизации и ИИ',
  twitterUrl: normalizeUrl('/blog'),
  twitterTitle: 'Блог об автоматизации бизнеса и ИИ | NEURONIC LABS',
  twitterDescription: 'Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях.',
  twitterImage: DEFAULT_IMAGE,
}

/**
 * Создает мета-теги для статьи блога
 */
export function createBlogPostMeta(post: {
  id: string
  title: string
  excerpt?: string
  content?: string
  imageUrl?: string
  publishedAt?: string
}): MetaTags {
  const url = normalizeUrl(`/blog/${post.id}`)
  const description = post.excerpt || 
    (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : '') ||
    'Статья об автоматизации бизнеса и ИИ-технологиях'
  const image = post.imageUrl 
    ? (post.imageUrl.startsWith('http') ? post.imageUrl : normalizeUrl(post.imageUrl))
    : DEFAULT_IMAGE
  
  return {
    ...baseMeta,
    title: `${post.title} | Блог NEURONIC LABS`,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    keywords: DEFAULT_KEYWORDS,
    canonical: url,
    ogType: 'article',
    ogUrl: url,
    ogTitle: post.title,
    ogDescription: description.length > 200 ? description.substring(0, 197) + '...' : description,
    ogImage: image,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: post.title,
    twitterUrl: url,
    twitterTitle: post.title,
    twitterDescription: description.length > 200 ? description.substring(0, 197) + '...' : description,
    twitterImage: image,
  }
}

