import React from 'react';

export function formatMessageText(text: string): React.ReactNode {
  // Обрабатываем весь текст целиком для правильной группировки изображений
  // Это позволяет группировать изображения даже если они на разных строках
  return formatBoldText(text, 0);
}

// Вспомогательная функция для обработки жирного текста и ссылок на изображения
function formatBoldText(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  
  // Улучшенное регулярное выражение для поиска URL (включая URL в конце строки)
  // Ищем http/https ссылки, которые могут заканчиваться на пробел, перенос строки, скобку или конец строки
  const urlRegex = /(https?:\/\/[^\s\)\n]+)/gi
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|heic|heif|avif|tiff|tif)(\?[^\s\)\n]*)?/i
  const imageIndicators = ['/image', '/img', '/photo', '/picture', '/media', '/upload', '/cdn', '/storage', '/assets', '/static']
  
  // Находим все URL в тексте
  const urlMatches: Array<{ url: string; index: number; isImage: boolean; originalLength: number }> = []
  let urlMatch
  
  // Сбрасываем lastIndex регулярного выражения перед использованием
  urlRegex.lastIndex = 0
  
  while ((urlMatch = urlRegex.exec(text)) !== null) {
    // Берем URL как есть, без trim, чтобы сохранить точную позицию
    const url = urlMatch[0]
    const urlLength = url.length
    // Проверяем, является ли это изображением
    // Создаем новое регулярное выражение для каждого теста, чтобы избежать проблем с состоянием
    const extTest = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|heic|heif|avif|tiff|tif)(\?[^\s\)\n]*)?/i.test(url)
    const hasIndicator = imageIndicators.some(indicator => url.toLowerCase().includes(indicator))
    const isImage = extTest || hasIndicator
    if (isImage) {
      urlMatches.push({ 
        url: url.trim(), 
        index: urlMatch.index, 
        isImage: true,
        originalLength: urlLength // Сохраняем оригинальную длину для правильного вычисления позиций
      })
    }
  }
  
  // Если есть ссылки на изображения, обрабатываем их
  if (urlMatches.some(m => m.isImage)) {
    const imageMatches = urlMatches.filter(m => m.isImage)
    
    for (let i = 0; i < imageMatches.length; i++) {
      const urlMatch = imageMatches[i]
      
      // Добавляем текст до ссылки
      if (urlMatch.index > lastIndex) {
        const textBefore = text.substring(lastIndex, urlMatch.index)
        // Обрабатываем жирный текст в части до ссылки
        const formattedBefore = formatBoldTextOnly(textBefore, key)
        key += textBefore.split('**').length - 1
        if (Array.isArray(formattedBefore)) {
          parts.push(...formattedBefore)
        } else {
          parts.push(formattedBefore)
        }
      }
      
      // Проверяем, есть ли следующие изображения подряд (без значимого текста между ними)
      const consecutiveImages: Array<{ url: string; index: number; originalLength: number }> = [urlMatch]
      let nextIndex = urlMatch.index + urlMatch.originalLength
      
      // Ищем следующие изображения, которые идут подряд
      for (let j = i + 1; j < imageMatches.length; j++) {
        const nextMatch = imageMatches[j]
        const textBetween = text.substring(nextIndex, nextMatch.index)
        
        // Если между изображениями только пробелы, переносы строк или пусто - группируем
        // Убираем пробелы и переносы строк для проверки
        const trimmedBetween = textBetween.trim()
        if (!trimmedBetween || /^[\s\n\r]*$/.test(textBetween)) {
          consecutiveImages.push(nextMatch)
          nextIndex = nextMatch.index + nextMatch.originalLength
          i = j // Пропускаем это изображение в основном цикле
        } else {
          break // Есть текст между изображениями, не группируем
        }
      }
      
      // Если несколько изображений подряд, отображаем их в flex-контейнере
      if (consecutiveImages.length > 1) {
        parts.push(
          <div 
            key={key++} 
            className="flex flex-wrap" 
            style={{ 
              gap: '5px', 
              margin: '5px 0',
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            {consecutiveImages.map((img, idx) => (
              <img
                key={key++}
                src={img.url}
                alt="Изображение"
                className="rounded-2xl object-contain"
                style={{ 
                  flex: '0 0 calc(50% - 2.5px)',
                  maxWidth: 'calc(50% - 2.5px)',
                  maxHeight: '200px',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const link = document.createElement('a')
                  link.href = img.url
                  link.textContent = img.url
                  link.className = 'text-blue-600 underline break-all'
                  target.parentNode?.insertBefore(link, target)
                }}
              />
            ))}
          </div>
        )
        lastIndex = nextIndex
      } else {
        // Одно изображение - отображаем как обычно, но с минимальными отступами
        parts.push(
          <img
            key={key++}
            src={urlMatch.url}
            alt="Изображение"
            className="max-w-full max-h-64 rounded-2xl object-contain block"
            style={{ margin: '10px 0' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const link = document.createElement('a')
              link.href = urlMatch.url
              link.textContent = urlMatch.url
              link.className = 'text-blue-600 underline break-all'
              target.parentNode?.insertBefore(link, target)
            }}
          />
        )
        lastIndex = urlMatch.index + urlMatch.originalLength
      }
    }
    
    // Добавляем оставшийся текст после последней ссылки
    if (lastIndex < text.length) {
      const textAfter = text.substring(lastIndex).trim()
      if (textAfter) {
        const formattedAfter = formatBoldTextOnly(textAfter, key)
        key += textAfter.split('**').length - 1
        if (Array.isArray(formattedAfter)) {
          parts.push(...formattedAfter)
        } else {
          parts.push(formattedAfter)
        }
      }
    }
    
    // Если есть части, возвращаем их, иначе возвращаем исходный текст
    if (parts.length > 0) {
      return parts
    }
    
    return text
  }
  
  // Если ссылок на изображения нет, обрабатываем только жирный текст
  return formatBoldTextOnly(text, startKey)
}

// Вспомогательная функция только для обработки жирного текста (без изображений)
function formatBoldTextOnly(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\*\*(.+?)\*\*/g;
  let match;
  let key = startKey;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до совпадения
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Добавляем жирный текст
    parts.push(<strong key={key++}>{match[1]}</strong>);
    
    lastIndex = regex.lastIndex;
  }
  
  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

