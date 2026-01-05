/**
 * Модуль для инициализации Yandex Metrika
 */

const YANDEX_METRIKA_ID = 106099175;

interface YandexMetrikaConfig {
  ssr?: boolean;
  webvisor?: boolean;
  clickmap?: boolean;
  ecommerce?: string;
  accurateTrackBounce?: boolean;
  trackLinks?: boolean;
}

declare global {
  interface Window {
    ym?: (id: number, method: string, config?: YandexMetrikaConfig) => void;
  }
}

/**
 * Инициализирует Yandex Metrika счетчик
 */
export function initYandexMetrika(config?: YandexMetrikaConfig) {
  const defaultConfig: YandexMetrikaConfig = {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Инициализация после загрузки страницы для предотвращения блокировки рендера
  if (document.readyState === 'complete') {
    if (window.ym) {
      window.ym(YANDEX_METRIKA_ID, 'init', finalConfig);
    }
  } else {
    window.addEventListener('load', function() {
      if (window.ym) {
        window.ym(YANDEX_METRIKA_ID, 'init', finalConfig);
      }
    });
  }
}

/**
 * Загружает скрипт Yandex Metrika асинхронно
 */
export function loadYandexMetrikaScript() {
  // Проверяем, не загружен ли уже скрипт
  for (let j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === 'https://mc.yandex.ru/metrika/tag.js') {
      return;
    }
  }

  // Инициализируем очередь ym до загрузки скрипта
  (window as any).ym = (window as any).ym || function() {
    ((window as any).ym.a = (window as any).ym.a || []).push(arguments);
  };
  (window as any).ym.l = new Date().getTime();

  // Создаем и добавляем скрипт
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
  
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Полная инициализация Yandex Metrika (загрузка скрипта + инициализация)
 */
export function setupYandexMetrika(config?: YandexMetrikaConfig) {
  loadYandexMetrikaScript();
  initYandexMetrika(config);
}

export { YANDEX_METRIKA_ID };

