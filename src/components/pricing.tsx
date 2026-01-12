import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { PricingDetailModal } from "@/components/pricing-detail-modal"

interface PricingProps {
  onContactClick: () => void
}

export function Pricing({ onContactClick }: PricingProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activePlanIndex, setActivePlanIndex] = useState(1) // Начинаем с Basic плана (индекс 1)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [selectedPlanName, setSelectedPlanName] = useState<string>("")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container && isMobile) {
      // Scroll to Basic plan (second card) on mount
      const cardWidth = container.children[0]?.clientWidth || 0
      const gap = 32 // 2rem gap
      container.scrollLeft = cardWidth + gap
      setActivePlanIndex(1) // Basic план
    }
  }, [isMobile])

  // Отслеживание активного слайда для пагинации
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !isMobile) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
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

      setActivePlanIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const plans = [
    {
      id: "lite",
      name: "Lite",
      price: "15 000",
      period: "",
      description: "Простой старт",
      features: [
        "Общение на сайте",
        "Консультирует и передает сложные диалоги человеку",
        "База знаний из FAQ и прайса",
        "GPT — ответы в тоне бренда",
        "Отчеты в Google Sheets",
        "Поддержка"
      ],
      highlighted: false,
      badge: null
    },
    {
      id: "basic",
      name: "Basic",
      price: "30 000",
      period: "",
      description: "Для малого бизнеса",
      features: [
        "1 канал связи",
        "Бот для общения 24/7",
        "Авторасчёт цен и смет",
        "Сбор лидов в CRM",
        "Уведомления (SMS/email)",
        "Базовый ИИ",
        "Отчёты в Google Sheets",
        "Техническая поддержка"
      ],
      highlighted: false,
      badge: null
    },
    {
      id: "business",
      name: "Business",
      price: "60 000",
      period: "",
      description: "Оптимальный для роста",
      features: [
        "Всё из Basic",
        "3 канала связи",
        "Подключение маркетплейсов",
        "CRM-интеграции",
        "Платежи",
        "Маркетинг и рассылки",
        "Аналитика",
        "Продвинутый ИИ",
        "Мониторинг и A/B-тесты"
      ],
      highlighted: true,
      badge: " Популярный"
    },
    {
      id: "pro",
      name: "Enterprise",
      price: "100 000",
      period: "",
      description: "Для крупного бизнеса",
      features: [
        "Всё из Business",
        "Автоматизация внутренних процессов",
        "Телефония",
        "Продвинутый ИИ+",
        "Масштабирование",
        "Премиум-поддержка 24/7"
      ],
      highlighted: false,
      badge: null
    }
  ]

  return (
    <section id="pricing" className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Тарифы и цены</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Выберите оптимальный план для вашего бизнеса. Все тарифы включают полную настройку и внедрение
          </p>
        </div>

        {/* Mobile: Slider */}
        <div className="md:hidden relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2 sm:px-4"
            style={{
              scrollPaddingLeft: '0.5rem',
              scrollPaddingRight: '0.5rem'
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="relative flex-shrink-0 w-[90vw] sm:w-[85vw] max-w-[380px] snap-center bg-card/50 flex flex-col cursor-pointer hover:shadow-lg transition-shadow overflow-visible"
                onClick={() => {
                  setSelectedPlanId(plan.id)
                  setSelectedPlanName(plan.name)
                  setIsDetailModalOpen(true)
                }}
              >
                
                <CardContent className="p-4 sm:p-8 flex flex-col flex-1 space-y-4 sm:space-y-6">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-5xl font-bold text-primary">{plan.price}</span>
                      <span className="text-base sm:text-xl text-muted-foreground">₽{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mt-auto">
                    <Button
                      className={`w-full text-sm sm:text-base ${plan.highlighted ? "shadow-lg" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        onContactClick()
                      }}
                    >
                      {plan.highlighted ? "Начать сейчас" : "Связаться"}
                    </Button>
                    <Button
                      className="w-full text-sm sm:text-base"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlanId(plan.id)
                        setSelectedPlanName(plan.name)
                        setIsDetailModalOpen(true)
                      }}
                    >
                      Подробнее о тарифе
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-3 mt-6">
            {plans.map((plan, idx) => (
              <button
                key={plan.id}
                onClick={() => {
                  const container = scrollContainerRef.current
                  if (container && container.children[idx]) {
                    const card = container.children[idx] as HTMLElement
                    container.scrollTo({
                      left: card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2,
                      behavior: 'smooth'
                    })
                  }
                }}
                className={`rounded-full transition-all ${
                  activePlanIndex === idx ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                style={{
                  width: activePlanIndex === idx ? '1.25rem' : '0.5rem',
                  height: '0.5rem'
                }}
                aria-label={`Перейти к тарифу ${plan.name}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col cursor-pointer overflow-visible ${
                plan.highlighted
                  ? "border-primary border-2 shadow-2xl scale-105 bg-primary/5"
                  : "bg-card/50 hover:border-primary/50 transition-all"
              } hover:shadow-lg`}
              onClick={() => {
                setSelectedPlanId(plan.id)
                setSelectedPlanName(plan.name)
                setIsDetailModalOpen(true)
              }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-4 w-4" />
                  {plan.badge}
                </div>
              )}
              
              <CardContent className="p-8 flex flex-col flex-1 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                    <span className="text-xl text-muted-foreground">₽{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 mt-auto">
                  <Button
                    className={`w-full ${plan.highlighted ? "shadow-lg" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onContactClick()
                    }}
                  >
                    {plan.highlighted ? "Начать сейчас" : "Связаться"}
                  </Button>
                  <Button
                    className="w-full"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlanId(plan.id)
                      setSelectedPlanName(plan.name)
                      setIsDetailModalOpen(true)
                    }}
                  >
                    Подробнее о тарифе
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4">
            Не уверены, какой тариф выбрать? Закажите бесплатную консультацию
          </p>
          <Button variant="outline" size="lg" onClick={onContactClick} className="text-sm sm:text-base w-full sm:w-auto">
            Получить консультацию
          </Button>
        </div>
      </div>

      <PricingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        planId={selectedPlanId}
        planName={selectedPlanName}
      />
    </section>
  )
}

