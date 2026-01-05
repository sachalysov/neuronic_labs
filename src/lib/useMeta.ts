import { useEffect } from 'react'
import type { MetaTags } from './meta'
import { applyMetaTags } from './meta'

/**
 * React хук для установки мета-тегов страницы
 * 
 * @param meta - объект с мета-тегами (должен быть стабильным, используйте useMemo для динамических значений)
 */
export function useMeta(meta: MetaTags) {
  useEffect(() => {
    applyMetaTags(meta)
  }, [meta])
}
