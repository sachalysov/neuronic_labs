import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Утилиты для работы с localStorage
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Игнорируем ошибки (например, переполнение хранилища)
  }
}

export const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    // Игнорируем ошибки
  }
}

// Форматирование времени
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Форматирование даты
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

// Транслитерация русского текста в латиницу для slug
const transliterationMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
}

/**
 * Генерирует URL-friendly slug из русского или английского текста
 * Пример: "Как ИИ-автоматизация увеличивает конверсию" -> "kak-ii-avtomatizaciya-uvelichivaet-konversiyu"
 */
export const generateSlug = (text: string): string => {
  if (!text) return ''
  
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все символы кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
}

