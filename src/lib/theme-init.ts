/**
 * Скрипт для инициализации темы при загрузке страницы
 * Выполняется ДО рендеринга React, чтобы избежать мигания
 */

export function initTheme() {
  // Читаем сохраненную тему из localStorage
  const savedTheme = localStorage.getItem("theme")
  
  // Если нет сохраненной темы, проверяем системные предпочтения
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  
  // Определяем начальную тему
  const theme = savedTheme || (prefersDark ? "dark" : "light")
  
  // Применяем тему к HTML до рендеринга
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark"
  }
}

// Вызываем немедленно, если скрипт загружен
if (typeof window !== "undefined") {
  initTheme()
}

