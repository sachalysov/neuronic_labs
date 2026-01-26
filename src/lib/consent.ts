/**
 * Утилиты для управления согласием на обработку персональных данных (152-ФЗ)
 */

const CONSENT_STORAGE_KEY = 'pdn-consent'

export type ConsentStatus = 'accepted' | 'declined' | null

/**
 * Получить текущий статус согласия
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined' || !window.localStorage) return null
  
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      return stored
    }
    return null
  } catch (e) {
    return null
  }
}

/**
 * Установить статус согласия
 */
export function setConsentStatus(status: 'accepted' | 'declined'): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status)
  } catch (e) {
    console.error('Ошибка при сохранении согласия:', e)
  }
}

/**
 * Проверить, дано ли согласие
 */
export function hasConsent(): boolean {
  return getConsentStatus() === 'accepted'
}

/**
 * Сбросить согласие (для тестирования или управления)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch (e) {
    console.error('Ошибка при сбросе согласия:', e)
  }
}
