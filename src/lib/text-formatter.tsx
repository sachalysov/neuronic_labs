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
      const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
      const className = 
        level === 1 ? 'text-xl font-bold mt-2 mb-2' :
        level === 2 ? 'text-lg font-semibold mt-2 mb-2' :
        level === 3 ? 'text-base font-semibold mt-2 mb-1' :
        'text-sm font-semibold mt-1 mb-1';
      
      // Обрабатываем жирный текст внутри заголовка
      const headerContent = formatBoldText(headerText, key);
      key += headerText.split('**').length - 1;
      
      parts.push(
        <HeaderTag key={key++} className={className}>
          {headerContent}
        </HeaderTag>
      );
    } else if (line.trim()) {
      // Обычный текст - обрабатываем жирный текст
      const formattedLine = formatBoldText(line, key);
      key += line.split('**').length - 1;
      
      // Добавляем перенос строки, если это не последняя строка
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
    } else if (i < lines.length - 1) {
      // Пустая строка - добавляем перенос строки
      parts.push(<br key={key++} />);
    }
  }
  
  return parts.length > 0 ? <div>{parts}</div> : text;
}

// Вспомогательная функция для обработки жирного текста
function formatBoldText(text: string, startKey: number): React.ReactNode {
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

