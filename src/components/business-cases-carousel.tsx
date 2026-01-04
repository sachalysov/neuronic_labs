"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import { TrendingUp, Users, Clock } from "lucide-react"

const businessCases = [
  {
    title: "Салон красоты",
    industry: "Beauty & Wellness",
    results: [
      { icon: Users, label: "Клиентов", value: "+180%", color: "text-primary" },
      { icon: TrendingUp, label: "Конверсия", value: "+65%", color: "text-green-500" },
      { icon: Clock, label: "Время ответа", value: "< 30 сек", color: "text-blue-500" },
    ],
    description:
      "ИИ-ассистент принимает записи 24/7, консультирует по услугам, напоминает о визитах и обрабатывает отмены. Автоматизация освободила администраторов для работы с VIP-клиентами.",
    challenge: "Потеря клиентов из-за занятой линии в пиковые часы",
    solution: "Мультиканальный ИИ-ассистент с интеграцией в систему бронирования",
    image: "/modern-beauty-salon.png",
  },
  {
    title: "Клининговая компания",
    industry: "Cleaning Services",
    results: [
      { icon: Users, label: "Заявок", value: "+210%", color: "text-primary" },
      { icon: TrendingUp, label: "Продажи", value: "+95%", color: "text-green-500" },
      { icon: Clock, label: "Работа", value: "24/7", color: "text-blue-500" },
    ],
    description:
      "Внедрили ИИ-продавца, который консультирует по типам уборки, рассчитывает стоимость, формирует заявки и отправляет их менеджерам. Снизили нагрузку на колл-центр на 70%.",
    challenge: "Высокая стоимость обработки входящих звонков",
    solution: "ИИ-калькулятор услуг с автоматическим формированием коммерческих предложений",
    image: "/professional-cleaning-service-team.jpg",
  },
  {
    title: "Детейлинг центр",
    industry: "Auto Detailing",
    results: [
      { icon: Users, label: "Записей", value: "+145%", color: "text-primary" },
      { icon: TrendingUp, label: "Средний чек", value: "+42%", color: "text-green-500" },
      { icon: Clock, label: "Обработка", value: "1 мин", color: "text-blue-500" },
    ],
    description:
      "ИИ-консультант помогает выбрать пакет услуг, показывает примеры работ, записывает на удобное время и отправляет напоминания. Клиенты получают мгновенные ответы и профессиональную консультацию.",
    challenge: "Низкая конверсия из обращений в записи",
    solution: "ИИ-консультант с визуальным каталогом услуг и онлайн-записью",
    image: "/car-detailing-center-luxury.jpg",
  },
  {
    title: "Медицинская клиника",
    industry: "Healthcare",
    results: [
      { icon: Users, label: "Записей", value: "+165%", color: "text-primary" },
      { icon: TrendingUp, label: "Удержание", value: "+78%", color: "text-green-500" },
      { icon: Clock, label: "Доступность", value: "24/7", color: "text-blue-500" },
    ],
    description:
      "ИИ-регистратор записывает на прием, информирует о подготовке к процедурам, напоминает о визитах и отвечает на типовые вопросы. Разгрузили регистратуру и повысили качество сервиса.",
    challenge: "Перегруженность регистратуры и пропущенные записи",
    solution: "ИИ-регистратор с системой напоминаний и онлайн-консультациями",
    image: "/modern-medical-clinic-reception.png",
  },
]

export function BusinessCasesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)

  // Отслеживание активного слайда и бесконечная прокрутка
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let isScrolling = false

    const getRealIndex = (index: number): number => {
      const total = businessCases.length
      if (index < total) {
        // Клоны в начале - последние слайды
        return index
      } else if (index >= total * 2) {
        // Клоны в конце - первые слайды
        return index - total * 2
      } else {
        // Реальные слайды в середине
        return index - total
      }
    }

    const handleScroll = () => {
      if (isScrolling) return

      const scrollLeft = container.scrollLeft
      
      // Определяем ближайший слайд
      let closestIndex = 0
      let closestDistance = Infinity

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement
        const cardLeft = card.offsetLeft
        const cardCenter = cardLeft + card.offsetWidth / 2
        const distance = Math.abs(scrollLeft + container.offsetWidth / 2 - cardCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      const realIndex = getRealIndex(closestIndex)
      setActiveCaseIndex(realIndex)

      // Бесконечная прокрутка: перепрыгиваем с клонов на реальные слайды
      const firstRealIndex = businessCases.length
      const lastRealIndex = businessCases.length * 2 - 1
      const firstRealCard = container.children[firstRealIndex] as HTMLElement
      const lastRealCard = container.children[lastRealIndex] as HTMLElement

      if (!firstRealCard || !lastRealCard) return

      const firstRealLeft = firstRealCard.offsetLeft
      const lastRealLeft = lastRealCard.offsetLeft
      const cardWidth = firstRealCard.offsetWidth
      const threshold = cardWidth / 2

      // Если доскроллили до начала (клоны последних слайдов)
      if (scrollLeft < firstRealLeft - threshold) {
        isScrolling = true
        container.scrollLeft = lastRealLeft - (container.offsetWidth - cardWidth) / 2
        setTimeout(() => { isScrolling = false }, 50)
      }
      // Если доскроллили до конца (клоны первых слайдов)
      else if (scrollLeft > lastRealLeft + threshold) {
        isScrolling = true
        container.scrollLeft = firstRealLeft - (container.offsetWidth - cardWidth) / 2
        setTimeout(() => { isScrolling = false }, 50)
      }
    }

    // Инициализация: скроллим к первому реальному слайду (после клонов в начале)
    const initScroll = () => {
      const firstRealIndex = businessCases.length
      const firstRealCard = container.children[firstRealIndex] as HTMLElement
      if (firstRealCard) {
        isScrolling = true
        container.scrollLeft = firstRealCard.offsetLeft - (container.offsetWidth - firstRealCard.offsetWidth) / 2
        setTimeout(() => {
          isScrolling = false
          handleScroll()
        }, 100)
      }
    }

    // Небольшая задержка для правильного расчета размеров
    setTimeout(initScroll, 100)
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [businessCases.length])

  const renderCase = (caseData: typeof businessCases[0], key: string) => (
    <Card
      key={key}
      className="flex-shrink-0 w-full max-w-4xl snap-center bg-card border-border overflow-hidden"
    >
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Side - lazy loading для изображений вне viewport */}
          <div className="relative h-48 sm:h-64 lg:h-auto">
            <img
              src={caseData.image || "/placeholder.svg"}
              alt={caseData.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/90 text-[10px] sm:text-xs font-semibold rounded-full mb-1 sm:mb-2">
                {caseData.industry}
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-white">{caseData.title}</h3>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {caseData.results.map((result, idx) => (
                <div key={idx} className="text-center space-y-1 sm:space-y-2">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <result.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${result.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-lg sm:text-2xl font-bold ${result.color}`}>{result.value}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{result.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{caseData.description}</p>

            {/* Challenge & Solution */}
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Вызов:</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{caseData.challenge}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Решение:</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{caseData.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Main Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
          style={{
            scrollPaddingLeft: '0.5rem',
            scrollPaddingRight: '0.5rem'
          }}
        >
          {/* Клоны последних слайдов в начале для бесконечной прокрутки */}
          {businessCases.slice(-businessCases.length).map((caseData, index) => 
            renderCase(caseData, `clone-start-${index}`)
          )}
          
          {/* Реальные слайды */}
          {businessCases.map((caseData, index) => 
            renderCase(caseData, `real-${index}`)
          )}

          {/* Клоны первых слайдов в конце для бесконечной прокрутки */}
          {businessCases.slice(0, businessCases.length).map((caseData, index) => 
            renderCase(caseData, `clone-end-${index}`)
          )}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-3 mt-6">
        {businessCases.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = scrollContainerRef.current
              if (container) {
                // Реальный слайд находится после клонов в начале
                const realIndex = index + businessCases.length
                const card = container.children[realIndex] as HTMLElement
                if (card) {
                  container.scrollTo({
                    left: card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2,
                    behavior: 'smooth'
                  })
                }
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              activeCaseIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            style={{
              width: activeCaseIndex === index ? '1.25rem' : '0.5rem',
              height: '0.5rem'
            }}
            aria-label={`Перейти к кейсу ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

