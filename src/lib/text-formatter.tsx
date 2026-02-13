import React, { useState } from 'react';
import { OptimizedImage } from '@/components/optimized-image';

// Компонент для изображения с возможностью открытия в полноэкранном режиме
function ImageWithModal({ src, alt, className, style, onError }: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, cursor: 'pointer' }}
        onClick={handleClick}
        onError={onError}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <OptimizedImage
            src={src}
            alt={alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
            onClick={(e: React.MouseEvent<HTMLImageElement>) => e.stopPropagation()}
            loading="eager"
            sizes="90vw"
          />
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '22px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export function formatMessageText(text: string): React.ReactNode {
  // Сначала обрабатываем переносы строк для параграфов
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length > 1) {
    const parts: React.ReactNode[] = [];
    let key = 0;
    paragraphs.forEach((para, index) => {
      if (para.trim()) {
        parts.push(
          <div key={key++} style={{ marginBottom: index < paragraphs.length - 1 ? '12px' : '0' }}>
            {formatMarkdown(para.trim(), key * 1000)}
          </div>
        );
      }
    });
    return parts.length > 0 ? parts : text;
  }
  
  // Обрабатываем весь текст целиком для правильной группировки изображений
  return formatMarkdown(text, 0);
}

// Основная функция для обработки markdown
function formatMarkdown(text: string, startKey: number): React.ReactNode {
  const lines = text.split('\n');
  // Обрабатываем списки:
  // - поддерживаем маркеры "-", "*", "•"
  // - поддерживаем нумерованные списки "1." и "1)"
  const hasList = lines.some(line => /^([-*•]|\d+[.)])\s+/.test(line.trim()));
  
  if (hasList) {
    const parts: React.ReactNode[] = [];
    let key = startKey;
    let currentList: Array<{ type: 'ul' | 'ol'; items: string[] }> = [];
    let lastIndex = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const match = trimmed.match(/^([-*•]|\d+[.)])\s+(.+)$/);
      
      if (match) {
        const isOrdered = /^\d+\.$/.test(match[1]);
        const itemText = match[2];
        
        // Если это начало нового списка или продолжение текущего
        if (currentList.length === 0 || 
            (currentList[currentList.length - 1].type === 'ul' && isOrdered) ||
            (currentList[currentList.length - 1].type === 'ol' && !isOrdered)) {
          // Добавляем текст до списка
          if (index > lastIndex) {
            const textBefore = lines.slice(lastIndex, index).join('\n').trim();
            if (textBefore) {
              const formatted = formatMarkdownInline(textBefore, key * 1000);
              if (Array.isArray(formatted)) {
                parts.push(...formatted);
              } else {
                parts.push(formatted);
              }
              key += 100;
            }
          }
          
          // Начинаем новый список
          currentList.push({
            type: isOrdered ? 'ol' : 'ul',
            items: [itemText]
          });
        } else {
          // Продолжаем текущий список
          currentList[currentList.length - 1].items.push(itemText);
        }
      } else {
        // Если список закончился, рендерим его
        if (currentList.length > 0) {
          currentList.forEach(list => {
            const ListTag = list.type === 'ul' ? 'ul' : 'ol';
            parts.push(
              React.createElement(
                ListTag,
                { key: key++, style: { margin: '8px 0', paddingLeft: '20px' } },
                list.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: '4px' }}>
                    {formatMarkdownInline(item, key * 1000 + itemIndex)}
                  </li>
                ))
              )
            );
            key += 100;
          });
          currentList = [];
        }
        
        // Добавляем текущую строку
        if (trimmed) {
          if (index > lastIndex || parts.length > 0) {
            parts.push(<br key={key++} />);
          }
          const formatted = formatMarkdownInline(trimmed, key * 100);
          if (Array.isArray(formatted)) {
            parts.push(...formatted);
          } else {
            parts.push(formatted);
          }
          key += 10;
        } else if (index < lines.length - 1) {
          parts.push(<br key={key++} />);
        }
        
        lastIndex = index + 1;
      }
    });
    
    // Рендерим оставшийся список
    if (currentList.length > 0) {
      currentList.forEach(list => {
        const ListTag = list.type === 'ul' ? 'ul' : 'ol';
        parts.push(
          React.createElement(
            ListTag,
            { key: key++, style: { margin: '8px 0', paddingLeft: '20px' } },
            list.items.map((item, itemIndex) => (
              <li key={itemIndex} style={{ marginBottom: '4px' }}>
                {formatMarkdownInline(item, key * 1000 + itemIndex)}
              </li>
            ))
          )
        );
        key += 100;
      });
    }
    
    return parts.length > 0 ? parts : text;
  }
  
  // Если списков нет, обрабатываем переносы строк внутри параграфа
  if (lines.length > 1) {
    const parts: React.ReactNode[] = [];
    let key = startKey;
    lines.forEach((line, index) => {
      if (line.trim()) {
        parts.push(formatMarkdownInline(line, key * 100));
        if (index < lines.length - 1) {
          parts.push(<br key={key * 100 + 1} />);
        }
        key++;
      } else if (index < lines.length - 1) {
        parts.push(<br key={key * 100 + 1} />);
        key++;
      }
    });
    return parts.length > 0 ? parts : text;
  }
  
  return formatMarkdownInline(text, startKey);
}

// Вспомогательная функция для обработки markdown внутри одной строки
function formatMarkdownInline(text: string, startKey: number): React.ReactNode {
  return formatImages(text, startKey);
}

// Вспомогательная функция для обработки жирного текста и ссылок на изображения
function formatImages(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  
  // Улучшенное регулярное выражение для поиска URL (включая URL в конце строки)
  // Ищем http/https ссылки, которые могут заканчиваться на пробел, перенос строки, скобку или конец строки
  const urlRegex = /(https?:\/\/[^\s\)\n]+)/gi
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
        // Обрабатываем markdown в части до ссылки
        const formattedBefore = formatTextMarkdown(textBefore, key)
        key += (textBefore.match(/\*\*|\*|_|\[|`/g) || []).length * 2
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
            {consecutiveImages.map((img) => {
              // Генерируем описательный alt из URL или используем дефолтный
              const getImageAlt = (url: string) => {
                const fileName = url.split('/').pop()?.split('?')[0] || ''
                const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
                if (nameWithoutExt) {
                  return `Изображение: ${nameWithoutExt.replace(/[-_]/g, ' ')}`
                }
                return 'Иллюстрация к тексту'
              }
              return (
              <ImageWithModal
                key={key++}
                src={img.url}
                alt={getImageAlt(img.url)}
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
              )
            })}
          </div>
        )
        lastIndex = nextIndex
      } else {
        // Одно изображение - отображаем как обычно, но с минимальными отступами
        // Генерируем описательный alt из URL
        const getImageAlt = (url: string) => {
          const fileName = url.split('/').pop()?.split('?')[0] || ''
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
          if (nameWithoutExt) {
            return `Изображение: ${nameWithoutExt.replace(/[-_]/g, ' ')}`
          }
          return 'Иллюстрация к тексту'
        }
        parts.push(
          <ImageWithModal
            key={key++}
            src={urlMatch.url}
            alt={getImageAlt(urlMatch.url)}
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
      const textAfter = text.substring(lastIndex)
      if (textAfter.trim()) {
        const formattedAfter = formatTextMarkdown(textAfter, key)
        key += (textAfter.match(/\*\*|\*|_|\[|`/g) || []).length * 2
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
  
  // Если ссылок на изображения нет, обрабатываем markdown в тексте
  return formatTextMarkdown(text, startKey)
}

// Функция для обработки всех markdown элементов в тексте
function formatTextMarkdown(text: string, startKey: number): React.ReactNode {
  // Обрабатываем в порядке приоритета: код блоки -> инлайн код -> ссылки -> жирный -> курсив
  return formatCodeBlocks(text, startKey);
}

// Обработка блоков кода ```
function formatCodeBlocks(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  const regex = /```([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до блока кода
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      const formatted = formatInlineCode(textBefore, key * 1000);
      if (Array.isArray(formatted)) {
        parts.push(...formatted);
      } else {
        parts.push(formatted);
      }
      key += (textBefore.match(/`/g) || []).length;
    }
    
    // Добавляем блок кода
    parts.push(
      <pre key={key++} style={{ 
        backgroundColor: '#f4f4f4', 
        padding: '8px', 
        borderRadius: '4px', 
        overflow: 'auto',
        margin: '8px 0',
        fontSize: '0.81rem',
        fontFamily: 'monospace'
      }}>
        <code>{match[1]}</code>
      </pre>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  // Обрабатываем оставшийся текст
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    const formatted = formatInlineCode(textAfter, key * 1000);
    if (Array.isArray(formatted)) {
      parts.push(...formatted);
    } else {
      parts.push(formatted);
    }
  }
  
  return parts.length > 0 ? parts : formatInlineCode(text, startKey);
}

// Обработка инлайн кода `код`
function formatInlineCode(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  // Ищем `код`, но не ```блоки```
  const regex = /(?<!`)`([^`\n]+?)`(?!`)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до кода
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      const formatted = formatLinks(textBefore, key * 1000);
      if (Array.isArray(formatted)) {
        parts.push(...formatted);
      } else {
        parts.push(formatted);
      }
      key += (textBefore.match(/\[|\*\*|\*|_/g) || []).length;
    }
    
    // Добавляем инлайн код
    parts.push(
      <code key={key++} style={{ 
        backgroundColor: '#f4f4f4', 
        padding: '2px 4px', 
        borderRadius: '3px',
        fontSize: '0.81rem',
        fontFamily: 'monospace'
      }}>
        {match[1]}
      </code>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  // Обрабатываем оставшийся текст
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    const formatted = formatLinks(textAfter, key * 1000);
    if (Array.isArray(formatted)) {
      parts.push(...formatted);
    } else {
      parts.push(formatted);
    }
  }
  
  return parts.length > 0 ? parts : formatLinks(text, startKey);
}

// Обработка ссылок [текст](url)
function formatLinks(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до ссылки
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      const formatted = formatHeaders(textBefore, key * 1000);
      if (Array.isArray(formatted)) {
        parts.push(...formatted);
      } else {
        parts.push(formatted);
      }
      key += (textBefore.match(/\*\*|\*|_|###/g) || []).length;
    }
    
    // Добавляем ссылку
    parts.push(
      <a 
        key={key++} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: '#2563eb', textDecoration: 'underline' }}
      >
        {match[1]}
      </a>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  // Обрабатываем оставшийся текст
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    const formatted = formatHeaders(textAfter, key * 1000);
    if (Array.isArray(formatted)) {
      parts.push(...formatted);
    } else {
      parts.push(formatted);
    }
  }
  
  return parts.length > 0 ? parts : formatHeaders(text, startKey);
}

// Обработка заголовков с ### для увеличения размера текста
function formatHeaders(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  
  // Обрабатываем ###текст или ### текст (с пробелом или без)
  // Ищем ### за которым следует текст до следующего ###, конца строки или конца текста
  const regex = /###([^\n#]+?)(?=###|$|\n)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до заголовка
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      const formatted = formatBoldItalic(textBefore, key * 1000);
      if (Array.isArray(formatted)) {
        parts.push(...formatted);
      } else {
        parts.push(formatted);
      }
      key += (textBefore.match(/\*\*|\*|_/g) || []).length;
    }
    
    // Обрабатываем текст после ### с увеличенным размером
    const headerText = match[1].trim();
    if (headerText) {
      parts.push(
        <span key={key++} style={{ fontSize: '1rem', fontWeight: 600 }}>
          {formatBoldItalic(headerText, key * 1000)}
        </span>
      );
      key += 100;
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Обрабатываем оставшийся текст
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    const formatted = formatBoldItalic(textAfter, key * 1000);
    if (Array.isArray(formatted)) {
      parts.push(...formatted);
    } else {
      parts.push(formatted);
    }
  }
  
  return parts.length > 0 ? parts : formatBoldItalic(text, startKey);
}

// Обработка жирного и курсивного текста
function formatBoldItalic(text: string, startKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = startKey;
  
  // Обрабатываем жирный текст **текст** и курсив *текст* или _текст_
  // Приоритет: жирный > курсив
  const regex = /(\*\*([^*]+?)\*\*)|(\*([^*\n]+?)\*)|(_([^_\n]+?)_)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до форматирования
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Обрабатываем жирный текст **текст**
    if (match[1] && match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    }
    // Обрабатываем курсив *текст* или _текст_
    else if ((match[3] && match[4]) || (match[5] && match[6])) {
      const italicText = match[4] || match[6];
      parts.push(<em key={key++}>{italicText}</em>);
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

