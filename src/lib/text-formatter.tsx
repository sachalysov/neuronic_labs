import React from 'react';

export function formatMessageText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let key = 0;

  // Разбиваем текст на строки для обработки заголовков
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Проверяем, является ли строка заголовком markdown
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];
      
      // Добавляем разделитель перед заголовком (кроме первого)
      if (i > 0) {
        parts.push(
          <div key={key++} className="my-3 border-t border-border/30"></div>
        );
      }
      
      // Создаем элемент заголовка с соответствующим размером
      const HeaderTag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const className = 
        level === 1 ? 'text-xl font-bold mt-2 mb-2' :
        level === 2 ? 'text-lg font-semibold mt-2 mb-2' :
        level === 3 ? 'text-base font-semibold mt-2 mb-1' :
        'text-sm font-semibold mt-1 mb-1';
      
      // Обрабатываем жирный текст внутри заголовка
      const headerContent = formatBoldText(headerText, key);
      key += headerText.split('**').length - 1;
      
      parts.push(
        React.createElement(HeaderTag, { key: key++, className }, headerContent)
      );
    } else if (line.trim()) {
      // Обычный текст - обрабатываем жирный текст и изображения
      const formattedLine = formatBoldText(line, key);
      key += line.split('**').length - 1;
      
      // Если результат - массив (может содержать изображения), обрабатываем по-другому
      if (Array.isArray(formattedLine)) {
        // Добавляем все части из массива
        parts.push(...formattedLine);
        // Добавляем перенос строки после всех частей, если это не последняя строка
        if (i < lines.length - 1) {
          parts.push(<br key={key++} />);
        }
      } else {
        // Обычный текст без изображений - оборачиваем в span
        if (i < lines.length - 1) {
          parts.push(
            <span key={key++}>
              {formattedLine}
              <br />
            </span>
          );
        } else {
          parts.push(<span key={key++}>{formattedLine}</span>);
        }
      }
    } else if (i < lines.length - 1) {
      // Пустая строка - добавляем перенос строки
      parts.push(<br key={key++} />);
    }
  }
  
  return parts.length > 0 ? <div>{parts}</div> : text;
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
  const urlMatches: Array<{ url: string; index: number; isImage: boolean }> = []
  let urlMatch
  
  // Сбрасываем lastIndex регулярного выражения перед использованием
  urlRegex.lastIndex = 0
  
  while ((urlMatch = urlRegex.exec(text)) !== null) {
    // Берем URL как есть, без trim, чтобы сохранить точную позицию
    const url = urlMatch[0]
    // Проверяем, является ли это изображением
    // Создаем новое регулярное выражение для каждого теста, чтобы избежать проблем с состоянием
    const extTest = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|heic|heif|avif|tiff|tif)(\?[^\s\)\n]*)?/i.test(url)
    const hasIndicator = imageIndicators.some(indicator => url.toLowerCase().includes(indicator))
    const isImage = extTest || hasIndicator
    if (isImage) {
      urlMatches.push({ url: url.trim(), index: urlMatch.index, isImage: true })
    }
  }
  
  // Если есть ссылки на изображения, обрабатываем их
  if (urlMatches.some(m => m.isImage)) {
    for (const urlMatch of urlMatches) {
      if (!urlMatch.isImage) continue
      
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
      
      // Добавляем изображение как блочный элемент для правильного отображения
      parts.push(
        <img
          key={key++}
          src={urlMatch.url}
          alt="Изображение"
          className="max-w-full max-h-64 rounded-lg object-contain my-2 block"
          onError={(e) => {
            // Если изображение не загрузилось, заменяем на ссылку
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
      
      lastIndex = urlMatch.index + urlMatch.url.length
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

