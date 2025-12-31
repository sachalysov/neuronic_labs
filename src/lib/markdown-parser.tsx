import React from 'react';

/**
 * Парсит markdown текст и преобразует **жирный текст** в <strong> элементы
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  // Разбиваем текст по паттерну **текст**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    // Проверяем, является ли часть жирным текстом
    if (part.startsWith('**') && part.endsWith('**')) {
      // Убираем звездочки и делаем текст жирным
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    
    // Обычный текст
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

