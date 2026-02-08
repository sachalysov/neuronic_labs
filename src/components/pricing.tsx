import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { PricingDetailModal } from "@/components/pricing-detail-modal"
import { PricingQuiz } from "@/components/pricing-quiz"
import { SliderPagination } from "@/components/slider-pagination"
import { AnimateOnScroll, StaggerChildren } from "@/components/animate-on-scroll"

interface PricingProps {
  onContactClick: () => void
}

export function Pricing({ onContactClick }: PricingProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
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
    }
  }, [isMobile])

  const plans = [
    {
      id: "lite",
      name: "Lite",
      price: "25 000",
      period: "",
      description: "Простой старт",
      features: [
        "1 канал продаж",
        "Записывает заявки в таблицу",
        "База знаний из FAQ и прайса",
        "Отчеты в Телеграмм",
        "Поддержка"
      ],
      highlighted: false,
      badge: null
    },
    {
      id: "basic",
      name: "Basic",
      price: "60 000",
      period: "",
      description: "Для малого бизнеса",
      features: [
        "Все из Lite",
        "1 канал продаж",
        "Сбор лидов в CRM",
        "Уведомления клиенту (SMS/email)",
      ],
      highlighted: false,
      badge: null
    },
    {
      id: "business",
      name: "Business",
      price: "150 000",
      period: "",
      description: "Оптимальный для роста",
      features: [
        "Всё из Basic",
        "3 канала связи",
        "Прием оплаты",
        "Маркетинг и рассылки",
        "Аналитика",
        "Продвинутый ИИ",
      ],
      highlighted: true,
      badge: " Популярный"
    },
    {
      id: "pro",
      name: "Enterprise",
      price: "250 000",
      period: "",
      description: "Для крупного бизнеса",
      features: [
        "Всё из Business",
        "Телефония",
        "Продвинутый ИИ+",
        "Премиум-поддержка 24/7"
      ],
      highlighted: false,
      badge: null
    }
  ]

  return (
    <section id="pricing" className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto">
        <AnimateOnScroll animation="fade-up" duration={700} className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Тарифы и цены</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Выберите оптимальный план для вашего бизнеса. Все тарифы включают полную настройку и внедрение
          </p>
        </AnimateOnScroll>

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
          <SliderPagination 
            containerRef={scrollContainerRef} 
            itemCount={plans.length}
          />
        </div>

        {/* Desktop: Grid */}
        <StaggerChildren staggerDelay={120} animation="fade-up" equalHeight className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col cursor-pointer overflow-visible card-hover-lift w-full h-full ${
                plan.highlighted
                  ? "border-primary border-2 shadow-2xl scale-105 bg-primary/5 gradient-border-animated"
                  : "bg-card/50 hover:border-primary/50 transition-all gradient-border-animated"
              } hover:shadow-lg`}
              onClick={() => {
                setSelectedPlanId(plan.id)
                setSelectedPlanName(plan.name)
                setIsDetailModalOpen(true)
              }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 whitespace-nowrap badge-bounce">
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
        </StaggerChildren>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4">
            Нужна индивидуальная разработка? Закажите бесплатную консультацию
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" size="lg" onClick={onContactClick} className="text-sm sm:text-base w-full sm:w-auto">
              Получить консультацию
            </Button>
          </div>
        </div>

        <PricingQuiz onContactClick={onContactClick} />
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

