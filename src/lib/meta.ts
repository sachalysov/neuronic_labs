export interface MetaTags {
  title?: string
  description?: string
  keywords?: string
  author?: string
  canonical?: string
  robots?: string
  
  // Open Graph
  ogType?: string
  ogUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageWidth?: string
  ogImageHeight?: string
  ogImageAlt?: string
  ogSiteName?: string
  ogLocale?: string
  
  // Twitter
  twitterCard?: string
  twitterUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  
  // Дополнительные мета-теги
  subject?: string
  classification?: string
  category?: string
  language?: string
}

const BASE_URL = 'https://neuroniclabs.ru'
const DEFAULT_SITE_NAME = 'NEURONIC LABS'

/**
 * Устанавливает или обновляет мета-тег
 */
function setMetaTag(attribute: string, value: string, property = false) {
  if (!value) return
  
  const selector = property 
    ? `meta[property="${attribute}"]`
    : `meta[name="${attribute}"]`
  
  let element = document.querySelector(selector) as HTMLMetaElement
  
  if (!element) {
    element = document.createElement('meta')
    if (property) {
      element.setAttribute('property', attribute)
    } else {
      element.setAttribute('name', attribute)
    }
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', value)
}

/**
 * Удаляет мета-тег
 */
function removeMetaTag(attribute: string, property = false) {
  const selector = property
    ? `meta[property="${attribute}"]`
    : `meta[name="${attribute}"]`
  
  const element = document.querySelector(selector)
  if (element) {
    element.remove()
  }
}

/**
 * Устанавливает title страницы
 */
export function setTitle(title: string) {
  if (title) {
    document.title = title
  }
}

/**
 * Устанавливает canonical ссылку
 */
function setCanonical(url: string) {
  if (!url) return
  
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  
  link.setAttribute('href', url)
}

/**
 * Применяет мета-теги к документу
 */
export function applyMetaTags(meta: MetaTags) {
  // Title
  if (meta.title) {
    setTitle(meta.title)
  }
  
  // Основные мета-теги
  if (meta.description !== undefined) {
    setMetaTag('description', meta.description)
  }
  if (meta.keywords !== undefined) {
    setMetaTag('keywords', meta.keywords)
  }
  if (meta.author !== undefined) {
    setMetaTag('author', meta.author)
  }
  if (meta.robots !== undefined) {
    setMetaTag('robots', meta.robots)
  }
  if (meta.canonical !== undefined) {
    setCanonical(meta.canonical)
  }
  
  // Open Graph
  if (meta.ogType !== undefined) {
    setMetaTag('og:type', meta.ogType, true)
  }
  if (meta.ogUrl !== undefined) {
    setMetaTag('og:url', meta.ogUrl, true)
  }
  if (meta.ogTitle !== undefined) {
    setMetaTag('og:title', meta.ogTitle, true)
  }
  if (meta.ogDescription !== undefined) {
    setMetaTag('og:description', meta.ogDescription, true)
  }
  if (meta.ogImage !== undefined) {
    setMetaTag('og:image', meta.ogImage, true)
  }
  if (meta.ogImageWidth !== undefined) {
    setMetaTag('og:image:width', meta.ogImageWidth, true)
  }
  if (meta.ogImageHeight !== undefined) {
    setMetaTag('og:image:height', meta.ogImageHeight, true)
  }
  if (meta.ogImageAlt !== undefined) {
    setMetaTag('og:image:alt', meta.ogImageAlt, true)
  }
  if (meta.ogSiteName !== undefined) {
    setMetaTag('og:site_name', meta.ogSiteName, true)
  }
  if (meta.ogLocale !== undefined) {
    setMetaTag('og:locale', meta.ogLocale, true)
  }
  
  // Twitter
  if (meta.twitterCard !== undefined) {
    setMetaTag('twitter:card', meta.twitterCard)
  }
  if (meta.twitterUrl !== undefined) {
    setMetaTag('twitter:url', meta.twitterUrl)
  }
  if (meta.twitterTitle !== undefined) {
    setMetaTag('twitter:title', meta.twitterTitle)
  }
  if (meta.twitterDescription !== undefined) {
    setMetaTag('twitter:description', meta.twitterDescription)
  }
  if (meta.twitterImage !== undefined) {
    setMetaTag('twitter:image', meta.twitterImage)
  }
  
  // Дополнительные мета-теги
  if (meta.subject !== undefined) {
    setMetaTag('subject', meta.subject)
  }
  if (meta.classification !== undefined) {
    setMetaTag('classification', meta.classification)
  }
  if (meta.category !== undefined) {
    setMetaTag('category', meta.category)
  }
  if (meta.language !== undefined) {
    setMetaTag('language', meta.language)
  }
}

/**
 * Нормализует URL (добавляет базовый URL если нужно)
 */
export function normalizeUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export { BASE_URL, DEFAULT_SITE_NAME }
