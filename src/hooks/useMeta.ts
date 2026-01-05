import { useEffect, useRef } from 'react'
import { setMetaTags, resetMetaTags, type MetaTags } from '@/lib/meta'

/**
 * Хук для установки мета-тегов страницы
 * Автоматически сбрасывает мета-теги при размонтировании компонента
 */
export function useMeta(meta: Partial<MetaTags>) {
  const prevMetaRef = useRef<string>('')
  
  useEffect(() => {
    // Создаем строку для сравнения, чтобы избежать лишних обновлений
    const metaKey = JSON.stringify({
      title: meta.title,
      description: meta.description,
      image: meta.image,
      url: meta.url,
      canonical: meta.canonical,
      ogTitle: meta.ogTitle,
      ogDescription: meta.ogDescription,
      ogImage: meta.ogImage,
      ogUrl: meta.ogUrl,
      twitterTitle: meta.twitterTitle,
      twitterDescription: meta.twitterDescription,
      twitterImage: meta.twitterImage,
    })
    
    // Обновляем только если мета-теги изменились
    if (prevMetaRef.current !== metaKey) {
      setMetaTags(meta)
      prevMetaRef.current = metaKey
    }
    
    return () => {
      // При размонтировании сбрасываем к дефолтным значениям
      resetMetaTags()
    }
  }, [meta])
}

