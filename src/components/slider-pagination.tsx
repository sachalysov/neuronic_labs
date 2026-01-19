import { useEffect, useState } from "react"

interface SliderPaginationProps {
  containerRef: React.RefObject<HTMLDivElement | null> | React.RefObject<HTMLDivElement>
  itemCount: number
  className?: string
}

export function SliderPagination({ 
  containerRef, 
  itemCount,
  className = "" 
}: SliderPaginationProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container || itemCount <= 1) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      
      // Находим ближайший слайд
      let closestIndex = 0
      let closestDistance = Infinity

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement
        const cardLeft = card.offsetLeft
        const cardWidth = card.offsetWidth
        const cardCenter = cardLeft + cardWidth / 2
        const containerCenter = scrollLeft + containerWidth / 2
        const distance = Math.abs(containerCenter - cardCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
    }

    // Небольшая задержка для правильного расчета размеров
    setTimeout(() => {
      handleScroll()
    }, 100)

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef, itemCount])

  if (itemCount <= 1) return null

  return (
    <div 
      className={`flex justify-center gap-1 mt-3 ${className}`}
      role="tablist"
      aria-label="Индикаторы слайдов"
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <button
          key={index}
          className={`transition-all duration-300 !min-w-0 !min-h-0 !p-0 ${
            index === activeIndex
              ? "w-[20px] h-[10px] rounded-[10px] bg-primary"
              : "w-[14px] h-[7px] rounded-[10px] bg-muted-foreground/30 hover:bg-muted-foreground/50"
          }`}
          onClick={() => {
            const container = containerRef.current
            if (!container) return
            
            const child = container.children[index] as HTMLElement
            if (child) {
              const scrollLeft = child.offsetLeft - container.offsetLeft
              container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
              })
            }
          }}
          aria-label={`Перейти к слайду ${index + 1}`}
          aria-selected={index === activeIndex}
          role="tab"
        />
      ))}
    </div>
  )
}

