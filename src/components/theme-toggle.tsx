"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // Инициализация темы при загрузке
  useEffect(() => {
    // Читаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    
    // Если нет сохраненной темы, проверяем системные предпочтения
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    // Определяем начальную тему
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    
    // Применяем тему
    if (initialTheme === "dark") {
      document.documentElement.dataset.theme = "dark"
    } else {
      delete document.documentElement.dataset.theme
    }
    
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    
    // Применяем тему к HTML
    if (newTheme === "dark") {
      document.documentElement.dataset.theme = "dark"
    } else {
      delete document.documentElement.dataset.theme
    }
    
    // Сохраняем в localStorage
    localStorage.setItem("theme", newTheme)
    
    // Обновляем state
    setTheme(newTheme)
  }

  // Предотвращаем гидратацию до монтирования
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50 text-foreground/70 transition-all duration-250"
        aria-label="Переключить тему сайта"
        disabled
      >
        <div className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Загрузка...</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-secondary border border-border hover:border-primary text-foreground transition-all duration-250 hover:shadow-md shadow-sm"
      aria-label="Переключить тему сайта"
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium hidden sm:inline">Светлая тема</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium hidden sm:inline">Тёмная тема</span>
        </>
      )}
    </button>
  )
}

