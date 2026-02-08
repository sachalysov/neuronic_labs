import { useInView } from "@/hooks/useInView"
import { type ReactNode, type CSSProperties } from "react"

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "blur-in"
  | "slide-up"

interface AnimateOnScrollProps {
  children: ReactNode
  /** Тип анимации */
  animation?: AnimationType
  /** Задержка в мс (для stagger-эффекта) */
  delay?: number
  /** Длительность анимации в мс. По умолчанию 600 */
  duration?: number
  /** Порог видимости. По умолчанию 0.15 */
  threshold?: number
  /** Дополнительные CSS классы */
  className?: string
  /** HTML тег обёртки. По умолчанию div */
  as?: keyof React.JSX.IntrinsicElements
}

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = "",
  as: Tag = "div",
}: AnimateOnScrollProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold })

  const baseStyles: CSSProperties = {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    willChange: isInView ? "auto" : "opacity, transform",
  }

  const hiddenStyles: Record<AnimationType, CSSProperties> = {
    "fade-up": { opacity: 0, transform: "translateY(30px)" },
    "fade-down": { opacity: 0, transform: "translateY(-30px)" },
    "fade-left": { opacity: 0, transform: "translateX(-40px)" },
    "fade-right": { opacity: 0, transform: "translateX(40px)" },
    "scale-in": { opacity: 0, transform: "scale(0.9)" },
    "blur-in": { opacity: 0, filter: "blur(8px)" },
    "slide-up": { opacity: 0, transform: "translateY(60px)" },
  }

  const visibleStyles: CSSProperties = {
    opacity: 1,
    transform: "translateY(0) translateX(0) scale(1)",
    filter: "blur(0)",
  }

  const combinedStyles: CSSProperties = {
    ...baseStyles,
    ...(isInView ? visibleStyles : hiddenStyles[animation]),
  }

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={combinedStyles}>
      {children}
    </Tag>
  )
}

/**
 * Обёртка для stagger-анимации группы дочерних элементов.
 * Каждый прямой потомок AnimateOnScroll внутри получает нарастающую задержку.
 */
interface StaggerChildrenProps {
  children: ReactNode
  /** Базовая задержка между элементами в мс. По умолчанию 100 */
  staggerDelay?: number
  /** Тип анимации */
  animation?: AnimationType
  /** Длительность каждого элемента */
  duration?: number
  /** Порог видимости */
  threshold?: number
  /** Дополнительные CSS классы */
  className?: string
  /** Растягивать дочерние элементы на одинаковую высоту */
  equalHeight?: boolean
}

export function StaggerChildren({
  children,
  staggerDelay = 100,
  animation = "fade-up",
  duration = 600,
  threshold = 0.1,
  className = "",
  equalHeight = false,
}: StaggerChildrenProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold })

  const childArray = Array.isArray(children) ? children : [children]

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => {
        if (!child) return null

        const delay = index * staggerDelay
        const baseStyles: CSSProperties = {
          transitionProperty: "opacity, transform, filter",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
          willChange: isInView ? "auto" : "opacity, transform",
        }

        const hiddenMap: Record<AnimationType, CSSProperties> = {
          "fade-up": { opacity: 0, transform: "translateY(30px)" },
          "fade-down": { opacity: 0, transform: "translateY(-30px)" },
          "fade-left": { opacity: 0, transform: "translateX(-40px)" },
          "fade-right": { opacity: 0, transform: "translateX(40px)" },
          "scale-in": { opacity: 0, transform: "scale(0.9)" },
          "blur-in": { opacity: 0, filter: "blur(8px)" },
          "slide-up": { opacity: 0, transform: "translateY(60px)" },
        }

        const visibleStyles: CSSProperties = {
          opacity: 1,
          transform: "translateY(0) translateX(0) scale(1)",
          filter: "blur(0)",
        }

        return (
          <div
            key={index}
            className={equalHeight ? "flex h-full" : undefined}
            style={{
              ...baseStyles,
              ...(isInView ? visibleStyles : hiddenMap[animation]),
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
