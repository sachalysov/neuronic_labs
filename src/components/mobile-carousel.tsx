import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileCarouselProps {
  children: React.ReactNode
  className?: string
  showDots?: boolean
  showArrows?: boolean
  showProgress?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  ariaLabel?: string
}

export function MobileCarousel({
  children,
  className = "",
  showDots = true,
  showArrows = true,
  showProgress = false,
  autoplay = false,
  autoplayInterval = 5000,
  ariaLabel = "Карусель",
}: MobileCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || !emblaApi) return

    let autoplayTimer: NodeJS.Timeout

    const play = () => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }

    autoplayTimer = setInterval(play, autoplayInterval)

    return () => {
      if (autoplayTimer) clearInterval(autoplayTimer)
    }
  }, [autoplay, autoplayInterval, emblaApi])

  const progress = scrollSnaps.length > 0 
    ? ((selectedIndex + 1) / scrollSnaps.length) * 100 
    : 0

  return (
    <div className={`relative ${className}`} aria-label={ariaLabel}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {children}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && scrollSnaps.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg ${
              !canScrollPrev ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg ${
              !canScrollNext ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Progress Bar */}
      {showProgress && scrollSnaps.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/30 z-10">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-1 mt-3" role="tablist" aria-label="Индикаторы слайдов">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 !min-w-0 !min-h-0 !p-0 ${
                index === selectedIndex
                  ? "w-[5px] h-[5px] bg-primary"
                  : "w-[3px] h-[3px] bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
              aria-selected={index === selectedIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CarouselSlideProps {
  children: React.ReactNode
  className?: string
}

export function CarouselSlide({ children, className = "" }: CarouselSlideProps) {
  return (
    <div className={`flex-[0_0_100%] min-w-0 ${className}`}>
      {children}
    </div>
  )
}

