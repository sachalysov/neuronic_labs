import { useEffect } from "react"

/**
 * Блокирует скролл body пока активен триггер.
 * Восстанавливает позицию при снятии блокировки.
 * На десктопе (>= 768px) ничего не делает.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    if (typeof window === "undefined") return
    if (window.innerWidth >= 768) return

    const scrollY = window.scrollY
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
