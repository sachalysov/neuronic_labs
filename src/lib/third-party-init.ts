/**
 * Инициализация сторонних сервисов после получения согласия на обработку персональных данных
 */

import { setupYandexMetrika } from './yandex-metrika'

let isInitialized = false

/**
 * Инициализировать все сторонние сервисы (вызывается только после согласия)
 */
export function initializeThirdPartyServices() {
  if (isInitialized) {
    return
  }

  // Инициализация Yandex Metrika
  setupYandexMetrika()

  // Здесь можно добавить инициализацию других сервисов:
  // - Chat widgets (Jivo, Tidio и т.д.)
  // - AI services
  // - Analytics/marketing tags

  isInitialized = true
}

/**
 * Сброс флага инициализации (для тестирования)
 */
export function resetThirdPartyInit() {
  isInitialized = false
}

