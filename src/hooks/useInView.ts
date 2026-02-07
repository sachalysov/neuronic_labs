import { useEffect, useRef, useState } from "react"

interface UseInViewOptions {
  /** Порог видимости (0-1). По умолчанию 0.15 */
  threshold?: number
  /** Отступ от края viewport. По умолчанию "0px 0px -50px 0px" */
  rootMargin?: string
  /** Сработать только один раз. По умолчанию true */
  triggerOnce?: boolean
}

/**
 * Хук для отслеживания видимости элемента через Intersection Observer.
 * Используется для scroll-triggered анимаций.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Проверяем поддержку reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView }
}

interface UseCountUpOptions {
  /** Конечное значение */
  end: number
  /** Длительность анимации в мс. По умолчанию 2000 */
  duration?: number
  /** Суффикс (например %, +, x) */
  suffix?: string
  /** Префикс */
  prefix?: string
}

/**
 * Хук для анимации счётчика (count-up).
 * Запускается когда isInView = true.
 */
export function useCountUp(isInView: boolean, options: UseCountUpOptions) {
  const { end, duration = 2000, suffix = "", prefix = "" } = options
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // easeOutExpo для плавного замедления
      const eased = 1 - Math.pow(2, -10 * progress)
      const currentCount = Math.round(eased * end)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return `${prefix}${count}${suffix}`
}
