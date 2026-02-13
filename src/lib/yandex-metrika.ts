/**
 * Модуль для инициализации Yandex Metrika
 * Подавляет ошибки партнёрского кода (adhigh, yastatic), которые не контролируются нами.
 */

const YANDEX_METRIKA_ID = 106817617;

/** Подавить необработанные reject от партнёрского кода Метрики/Bitrix (adhigh, fetchSegments, пустой JSON). Вызывать при старте приложения. */
export function suppressThirdPartyRejectionErrors() {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason?.message === 'string' ? reason.message : '';
    const stack = typeof reason?.stack === 'string' ? reason.stack : '';
    const isFailedFetch = msg.includes('Failed to fetch');
    const isJsonParseError =
      msg.includes('Unexpected end of JSON input') ||
      msg.includes("Failed to execute 'json' on 'Response'");
    const stackFromThirdParty =
      stack.includes('fetchSegments') ||
      stack.includes('setPuidSegments') ||
      stack.includes('adhigh') ||
      stack.includes('fetchActivities') ||
      (stack.includes('boot') && stack.includes('init'));
    const metrikaOrBitrixLoaded = Array.from(document.scripts).some(
      (s) => s.src.includes('mc.yandex.ru/metrika') || s.src.includes('bitrix24')
    );
    const shouldSuppressFetch =
      isFailedFetch && (stackFromThirdParty || (metrikaOrBitrixLoaded && !stack));
    const shouldSuppressJson = isJsonParseError && (stackFromThirdParty || (metrikaOrBitrixLoaded && !stack));
    if (shouldSuppressFetch || shouldSuppressJson) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

/** Удалить preload для yastatic (добавляется Метрикой), чтобы не было предупреждения "preloaded but not used" */
function removeYastaticPreload() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll<HTMLLinkElement>('link[rel="preload"][href*="yastatic.net"]').forEach((el) => el.remove());
  });
  observer.observe(document.head, { childList: true, subtree: true });
  document.querySelectorAll<HTMLLinkElement>('link[rel="preload"][href*="yastatic.net"]').forEach((el) => el.remove());
}

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
 * Загружает скрипт Yandex Metrika асинхронно с оптимизацией кеширования
 */
export function loadYandexMetrikaScript() {
  // Проверяем, не загружен ли уже скрипт
  for (let j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src.includes('mc.yandex.ru/metrika/tag.js')) {
      return;
    }
  }

  // Инициализируем очередь ym до загрузки скрипта
  (window as any).ym = (window as any).ym || function() {
    ((window as any).ym.a = (window as any).ym.a || []).push(arguments);
  };
  (window as any).ym.l = new Date().getTime();

  // Оптимизация: добавляем preload для улучшения загрузки
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'script';
  preloadLink.href = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
  preloadLink.crossOrigin = 'anonymous';
  document.head.appendChild(preloadLink);

  // Создаем и добавляем скрипт с оптимизацией кеширования
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
  
  // Добавляем обработчик для проверки загрузки из кеша
  script.onload = () => {
    // Скрипт загружен (из кеша или сети)
  };
  
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
  removeYastaticPreload();
  loadYandexMetrikaScript();
  initYandexMetrika(config);
}

export { YANDEX_METRIKA_ID };

