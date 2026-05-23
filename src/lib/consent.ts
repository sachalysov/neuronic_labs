/**
 * Утилиты для управления согласием на обработку персональных данных (152-ФЗ) и cookies
 */

const COOKIES_CONSENT_STORAGE_KEY = 'cookies-consent'
const PERSONAL_DATA_CONSENT_STORAGE_KEY = 'personal-data-consent'

export type ConsentStatus = 'accepted' | 'declined' | null

/**
 * Получить текущий статус согласия на cookies
 */
export function getCookiesConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined' || !window.localStorage) return null
  
  try {
    const stored = localStorage.getItem(COOKIES_CONSENT_STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      return stored
    }
    return null
  } catch {
    return null
  }
}

/**
 * Установить статус согласия на cookies
 */
export function setCookiesConsentStatus(status: 'accepted' | 'declined'): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.setItem(COOKIES_CONSENT_STORAGE_KEY, status)
  } catch (e) {
    console.error('Ошибка при сохранении согласия на cookies:', e)
  }
}

/**
 * Получить текущий статус согласия на обработку персональных данных
 */
export function getPersonalDataConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined' || !window.localStorage) return null
  
  try {
    const stored = localStorage.getItem(PERSONAL_DATA_CONSENT_STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      return stored
    }
    return null
  } catch {
    return null
  }
}

/**
 * Установить статус согласия на обработку персональных данных
 */
export function setPersonalDataConsentStatus(status: 'accepted' | 'declined'): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.setItem(PERSONAL_DATA_CONSENT_STORAGE_KEY, status)
  } catch (e) {
    console.error('Ошибка при сохранении согласия на обработку персональных данных:', e)
  }
}

/**
 * Проверить, дано ли согласие на cookies
 */
export function hasCookiesConsent(): boolean {
  return getCookiesConsentStatus() === 'accepted'
}

/**
 * Проверить, дано ли согласие на обработку персональных данных
 */
export function hasPersonalDataConsent(): boolean {
  return getPersonalDataConsentStatus() === 'accepted'
}

/**
 * Сбросить согласие на cookies (для тестирования или управления)
 */
export function resetCookiesConsent(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.removeItem(COOKIES_CONSENT_STORAGE_KEY)
  } catch (e) {
    console.error('Ошибка при сбросе согласия на cookies:', e)
  }
}

/**
 * Сбросить согласие на обработку персональных данных (для тестирования или управления)
 */
export function resetPersonalDataConsent(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  
  try {
    localStorage.removeItem(PERSONAL_DATA_CONSENT_STORAGE_KEY)
  } catch (e) {
    console.error('Ошибка при сбросе согласия на обработку персональных данных:', e)
  }
}

// Обратная совместимость - старые функции для общего согласия (теперь для cookies)
/**
 * Получить текущий статус согласия (legacy - теперь для cookies)
 */
export function getConsentStatus(): ConsentStatus {
  return getCookiesConsentStatus()
}

/**
 * Установить статус согласия (legacy - теперь для cookies)
 */
export function setConsentStatus(status: 'accepted' | 'declined'): void {
  setCookiesConsentStatus(status)
}

/**
 * Проверить, дано ли согласие (legacy - теперь для cookies)
 */
export function hasConsent(): boolean {
  return hasCookiesConsent()
}

/**
 * Сбросить согласие (legacy - теперь для cookies)
 */
export function resetConsent(): void {
  resetCookiesConsent()
}
