import React, { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'auto' | 'sync'
  sizes?: string
  width?: number
  height?: number
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  itemProp?: string
}

/**
 * Компонент для оптимизированной загрузки изображений с поддержкой WebP
 * Автоматически пытается загрузить WebP версию, при неудаче использует оригинал
 */
export function OptimizedImage({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes,
  width,
  height,
  onClick,
  onError,
  itemProp,
}: OptimizedImageProps) {
  const [webpError, setWebpError] = useState(false)
  
  // Проверяем, является ли изображение внешним URL или локальным
  const isExternal = src.startsWith('http://') || src.startsWith('https://')
  const isBase64 = src.startsWith('data:')
  const isAlreadyWebP = src.toLowerCase().endsWith('.webp')
  
  // Для внешних URL, base64 или уже WebP просто используем обычный img
  if (isExternal || isBase64 || isAlreadyWebP || webpError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        width={width}
        height={height}
        onClick={onClick as any}
        onError={onError}
        itemProp={itemProp}
      />
    )
  }

  // Для локальных изображений пытаемся использовать WebP
  const getWebPSrc = (originalSrc: string) => {
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  }

  const webpSrc = getWebPSrc(src)
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  return (
    <picture>
      {/* WebP версия - если доступна */}
      <source
        srcSet={webpSrc}
        type="image/webp"
        sizes={defaultSizes}
        onError={() => setWebpError(true)}
      />
      {/* Fallback: оригинальное изображение */}
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        width={width}
        height={height}
        onClick={onClick as any}
        onError={(e) => {
          setWebpError(true)
          onError?.(e)
        }}
        itemProp={itemProp}
      />
    </picture>
  )
}
