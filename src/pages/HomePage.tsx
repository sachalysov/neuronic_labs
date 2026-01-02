import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChatWidget } from "@/components/chat-widget"
import { StickyHeader } from "@/components/sticky-header"
import { DemoChat } from "@/components/demo-chat"
import { BusinessCasesCarousel } from "@/components/business-cases-carousel"
import { ConsultationModal } from "@/components/consultation-modal"
import { SpaceDust } from "@/components/space-dust"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { CountdownTimer } from "@/components/countdown-timer"
import { submitFormData } from "@/services/form"
import { useEffect, useState, useRef } from "react"
import {
  Bot,
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  HeadphonesIcon,
  Lightbulb,
  Users,
  ArrowRight,
  Target,
  Award,
  Zap,
  Send,
  CheckCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const benefitsScrollRef = useRef<HTMLDivElement>(null)
  const [activeBenefitIndex, setActiveBenefitIndex] = useState(0)
  const benefitsData = [
    {
      icon: Bot,
      title: "ИИ-сотрудник работает 24/7, пока конкуренты спят",
      description: "Мгновенно отвечает на любые вопросы, 24/7 - круглосуточная коммуникация, недоступная вашим конкурентам"
    },
    {
      icon: TrendingUp,
      title: "В 2-3 раза больше клиентов",
      description: "Грамотно внедренный ИИ-продавец + мультиканален + Яндекс. Директ может увеличить конверсию в заявку в 2-3 раза"
    },
    {
      icon: DollarSign,
      title: "Сокращение фонда оплаты труда",
      description: "Один ИИ-продавец способен полностью заменить линейных менеджеров, которые занимаются первичной обработкой лидов и справляется с любым объемом заявок"
    },
    {
      icon: Clock,
      title: "Мгновенные ответы клиентам",
      description: "ИИ отвечает мгновенно, не заставляя клиентов ждать. Быстрая реакция повышает доверие и увеличивает конверсию"
    }
  ]

  useEffect(() => {
    // Очищаем hash из URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    // Скроллим в начало страницы
    window.scrollTo(0, 0)
  }, [])

  // Блокировка скролла при открытии демо-чата на мобильных устройствах
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isMobile = window.innerWidth < 768 // md breakpoint в Tailwind

    if (isDemoChatOpen && isMobile) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY
      
      // Блокируем скролл
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        // Восстанавливаем скролл при закрытии
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isDemoChatOpen])

  // Отслеживание активного слайда и бесконечная прокрутка
  useEffect(() => {
    const container = benefitsScrollRef.current
    if (!container) return

    let isScrolling = false

    const getRealIndex = (index: number): number => {
      const total = benefitsData.length
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
      setActiveBenefitIndex(realIndex)

      // Бесконечная прокрутка: перепрыгиваем с клонов на реальные слайды
      const firstRealIndex = benefitsData.length
      const lastRealIndex = benefitsData.length * 2 - 1
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
      const firstRealIndex = benefitsData.length
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
  }, [benefitsData.length])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Если начинается с 8, заменяем на +7
    if (value.startsWith("8")) {
      value = "+7" + value.slice(1)
    }
    // Если начинается с 9 (без +7), добавляем +7
    else if (value.match(/^9/)) {
      value = "+7" + value
    }
    // Если вводят просто 7, заменяем на +7
    else if (value === "7") {
      value = "+7"
    }
    
    setPhone(value)
  }

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Если значение не пустое и не начинается с @, добавляем @ в начале
    if (value && !value.startsWith("@")) {
      value = "@" + value
    }
    
    setTelegram(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Начало отправки формы (HomePage):', { name, phone, email, telegram, comment })
    
    try {
      await submitFormData({
        name: name,
        phone: phone,
        email: email,
        username: telegram,
        comment: comment,
      })
      
      console.log('Форма успешно отправлена (HomePage)')
      setIsSubmitted(true)
      
      // Сбросить форму через 5 секунд после успешной отправки
      setTimeout(() => {
        setIsSubmitted(false)
        setName("")
        setPhone("")
        setEmail("")
        setTelegram("")
        setComment("")
      }, 5000)
    } catch (error) {
      console.error("Ошибка при отправке формы (HomePage):", error)
      alert(error instanceof Error ? error.message : "Не удалось отправить форму. Пожалуйста, попробуйте позже.")
    }
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader onOpenDemoChat={() => setIsDemoChatOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/robot-hero-2.jpeg" 
            alt="Автоматизация бизнеса с ИИ - NEURONIC LABS" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 hero-image-overlay" />
          <div className="absolute bottom-0 left-0 right-0 hero-bottom-fade" />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-20 z-[1]" />

        {/* Space Dust Effect - Hero Section */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <SpaceDust 
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.9 }}
            particleDensity={5000}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
                  <span className="text-primary">NEURONIC</span> <br />
                  <span className="text-muted-foreground">LABS</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-[20px] uppercase tracking-wider">
                  Агентство по внедрению
               
                  автоматизации в бизнес
                </p>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Автоматизируй продажи на 300% без кодинга за 7 дней
              </h2>

              <p className="text-base sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Создаём ИИ-агента и чат-бота для Telegram, WhatsApp, Avito. Интеллектуальная автоматизация бизнеса — лиды 24/7 пока ты спишь
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button size="lg" className="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 animate-pulse w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
                  Бесплатный аудит + демо за 5 минут
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 border-2 hover:scale-105 transition-transform w-full sm:w-auto" 
                  onClick={() => {
                    // На мобильных устройствах (меньше md breakpoint = 768px) открываем демо чат
                    // На более широких экранах скроллим к секции
                    if (window.innerWidth < 768) {
                      setIsDemoChatOpen(true)
                    } else {
                      const demoSection = document.getElementById('demo-chat')
                      if (demoSection) {
                        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Попробовать демо
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - AIDA: Attention */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background border-y border-border">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-balance">
              80% лидов уходят к конкурентам из-за медленных менеджеров
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <Card className="bg-destructive/10 border-destructive/30 hover:scale-105 transition-all">
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-4 text-center">
                  <div className="text-3xl sm:text-5xl">💸</div>
                  <h3 className="text-lg sm:text-2xl font-bold text-destructive">Теряешь 150к₽/мес</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Каждый неотвеченный лид стоит тебе денег. Менеджеры отвечают через 2 часа — клиент уже купил у конкурента
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/30 hover:scale-105 transition-all">
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-4 text-center">
                  <div className="text-3xl sm:text-5xl">⏱️</div>
                  <h3 className="text-lg sm:text-2xl font-bold text-primary">Ответ за 3 секунды</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    ИИ-продавец отвечает мгновенно 24/7. Никаких обедов, выходных и отпусков. Клиенты не ждут
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/30 hover:scale-105 transition-all">
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-4 text-center">
                  <div className="text-3xl sm:text-5xl">📈</div>
                  <h3 className="text-lg sm:text-2xl font-bold">+200% конверсия</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Грамотный ИИ-продавец обрабатывает все лиды без исключения и конвертирует в 2-3 раза больше
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl w-full sm:w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                Узнать, как внедрить за 7 дней
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chat Section - Desktop */}
      <section id="demo-chat" className="hidden md:block py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance section-title">Попробуйте ИИ-продавца прямо сейчас</h2>
            <p className="text-xl text-muted-foreground">
              Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и
              закрывает возражения 24/7.
            </p>
          </div>

          <DemoChat />

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
          </p>
        </div>
      </section>

      {/* Demo Chat Section - Mobile with Button */}
      <section className="md:hidden py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-balance section-title">Попробуйте ИИ-продавца прямо сейчас</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и
              закрывает возражения 24/7.
            </p>
            
            <Button
              onClick={() => setIsDemoChatOpen(true)}
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold mx-auto"
              size="lg"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              Протестировать ИИ-чат
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="product" className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
            <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-balance section-title">
              Создаём ИИ-агента и автоматизируем бизнес-процессы за 14 дней
            </h2>
          </div>
          <p className="text-base sm:text-xl text-center text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
            Интеллектуальная автоматизация с ИИ: создаём ИИ-агента, чат-бота, автоматизируем рутинные задачи, счета и отчёты. Интеграция ИИ в работу увеличивает конверсию в 2-3 раза
          </p>

          <div className="text-center mb-10 sm:mb-16">
            <Button 
              size="lg" 
              className="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Хочу увеличить продажи
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitsData.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="bg-card/10 border-border hover:border-primary transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{benefit.title}</h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative">
            <div
              ref={benefitsScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{
                scrollPaddingLeft: '0.5rem',
                scrollPaddingRight: '0.5rem'
              }}
            >
              {/* Клоны последних слайдов в начале для бесконечной прокрутки */}
              {benefitsData.slice(-benefitsData.length).map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={`clone-start-${index}`}
                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/10 border-border"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{benefit.title}</h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
              
              {/* Реальные слайды */}
              {benefitsData.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={index}
                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/10 border-border"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{benefit.title}</h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Клоны первых слайдов в конце для бесконечной прокрутки */}
              {benefitsData.slice(0, benefitsData.length).map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={`clone-end-${index}`}
                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/10 border-border"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{benefit.title}</h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-6">
              {benefitsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = benefitsScrollRef.current
                    if (container) {
                      // Реальный слайд находится после клонов в начале
                      const realIndex = index + benefitsData.length
                      const card = container.children[realIndex] as HTMLElement
                      if (card) {
                        container.scrollTo({
                          left: card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2,
                          behavior: 'smooth'
                        })
                      }
                    }
                  }}
                  className={`rounded-full transition-all ${
                    activeBenefitIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    width: activeBenefitIndex === index ? '1.25rem' : '0.5rem',
                    height: '0.5rem'
                  }}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Как мы работаем</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Анализ бизнеса</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Изучаем ваши процессы, потребности клиентов и точки автоматизации</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Создание ИИ-агента</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Создаём ИИ-помощника, чат-бота и обучаем под специфику вашего бизнеса. Интеллектуальная автоматизация процессов</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Интеграция ИИ в работу</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Интегрируем ИИ-агента с вашими системами, автоматизируем счета и отчёты. Обеспечиваем постоянную техподдержку</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing onContactClick={() => setIsModalOpen(true)} />

      {/* About Us Section */}
      <section id="about" className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">О нас</h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы команда экспертов по созданию ИИ-агентов, чат-ботов и интеллектуальной автоматизации бизнес-процессов. Интеграция ИИ в работу, автоматизация рутинных задач, счетов и отчётов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-8 mb-12">
              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-3 md:p-8 space-y-1 md:space-y-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Target className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">90+</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Успешно внедренных проектов</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-3 md:p-8 space-y-1 md:space-y-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">5 лет</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Опыта в разработке ИИ-решений</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-3 md:p-8 space-y-1 md:space-y-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">14 дней</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Среднее время внедрения</p>
                </CardContent>
              </Card>
            </div>

            {/* Video and Product Description */}
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* Video Section - Full Width */}
                <div className="w-full">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl w-full" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src="https://drive.google.com/file/d/1WPOhATh5rgSd4U0XVElvYKBNJoZNiBTM/preview"
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay"
                      title="Презентация продукта"
                    />
                  </div>
                </div>

                {/* Text Section - Below Video */}
                <div className="w-full space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">О нашем продукте</h3>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                    <p>
                      Наш ИИ-агент и чат-бот — это не просто автоматизация. Это интеллектуальная автоматизация бизнеса с помощью нейросети. Создаём ИИ-помощника, который понимает контекст вашего бизнеса, знает ваши продукты и услуги, и способен вести диалог с клиентами на уровне опытного менеджера.
                    </p>
                    <p>
                      Технология построена на базе передовых языковых моделей, адаптированных под специфику вашей отрасли. Мы создаём ИИ-агента, обучая систему на ваших данных: прайс-листах, описаниях услуг, типовых вопросах клиентов и скриптах продаж. Интеграция ИИ в работу позволяет автоматизировать не только продажи, но и рутинные задачи, генерацию контента, создание счетов и отчётов.
                    </p>
                    <p>
                      Результат — ИИ-агент для бизнеса, который работает 24/7, никогда не устает, не уходит в отпуск и обрабатывает неограниченное количество обращений одновременно. Автоматизация с ИИ охватывает все бизнес-процессы: от обработки лидов до автоматизации счетов и отчётов. При этом каждый клиент получает персонализированный подход и мгновенные ответы на свои вопросы.
                    </p>
                    <div className="pt-3 sm:pt-4 border-t border-border">
                      <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Ключевые возможности:</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Создание ИИ-агента и чат-бота с интеграцией во все популярные мессенджеры и CRM-системы</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Интеллектуальная автоматизация: квалификация лидов, автоматизация рутинных задач, передача горячих заявок менеджерам</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Автоматизация отчётов, счетов и генерация контента с помощью ИИ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Интеграция ИИ в работу: нейросеть для бизнеса постоянно обучается и улучшается на основе реальных диалогов</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA after video */}
            <div className="text-center mt-8 sm:mt-12">
              <Button 
                size="lg" 
                className="text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                Узнать стоимость для моего бизнеса
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Business Cases Section */}
      <section id="cases" className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Кейсы бизнеса</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные результаты внедрения ИИ-автоматизации в различных отраслях
            </p>
          </div>

          <BusinessCasesCarousel />

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Хотите получить такие же результаты для вашего бизнеса?</p>
            <Button size="lg" className="text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
              Обсудить ваш проект
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Use Cases Section */}
      <section id="services" className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Сценарии использования</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-3 md:p-6 space-y-1 md:space-y-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Продажи</h3>
                <p className="text-sm md:text-base text-muted-foreground">Консультация клиентов, презентация продуктов, закрытие сделок</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-3 md:p-6 space-y-1 md:space-y-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <HeadphonesIcon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Поддержка</h3>
                <p className="text-sm md:text-base text-muted-foreground">Ответы на частые вопросы, решение проблем клиентов 24/7</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-3 md:p-6 space-y-1 md:space-y-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Лидогенерация</h3>
                <p className="text-sm md:text-base text-muted-foreground">Квалификация лидов, сбор контактов, запись на встречи</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-3 md:p-6 space-y-1 md:space-y-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Lightbulb className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Консультации</h3>
                <p className="text-sm md:text-base text-muted-foreground">Экспертные советы, подбор решений, персональные рекомендации</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-2xl">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                {/* Special Offer Badge */}
                <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base animate-pulse">
                  🔥 СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ
                </div>

                <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-balance">
                  Первым 5 клиентам — бесплатный аудит бизнеса на 50 000₽
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Закажите консультацию прямо сейчас и получите полный анализ вашего бизнеса + стратегию автоматизации в подарок
                </p>

                {/* Countdown Timer */}
                <div className="bg-background/50 rounded-xl p-4 sm:p-6 border border-primary/20">
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2">
                    До окончания предложения осталось:
                  </p>
                  <CountdownTimer hours={48} />
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="@username"
                        value={telegram}
                        onChange={handleTelegramChange}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Комментарий к письму"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-background border-border"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-sm sm:text-base md:text-lg py-3 sm:py-3 md:py-3 px-4 h-auto min-h-[50px] sm:min-h-[60px] whitespace-normal leading-tight">
                      Получить бесплатную консультацию
                      <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-foreground">Заявка отправлена!</h4>
                    <p className="text-muted-foreground">
                      Наш менеджер свяжется с вами в течение 15 минут
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-base sm:text-lg mb-3 sm:mb-4">
            <span className="text-primary font-bold">NEURONIC</span>
            <span className="text-foreground font-bold">LABS</span>
          </p>
          <p className="text-sm sm:text-base">&copy; 2025 NEURONIC LABS. Все права защищены.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Mobile Demo Chat Modal */}
      {isDemoChatOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col">
          {/* Demo Chat Content - Full Screen */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DemoChat onClose={() => setIsDemoChatOpen(false)} isMobile={true} />
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

