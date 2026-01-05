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

