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
import { useEffect, useState } from "react"
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
  X,
  ChevronLeft,
  ChevronRight,
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
  const [currentSlide, setCurrentSlide] = useState(1) // Начинаем с 1 (первый реальный слайд)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [mouseStart, setMouseStart] = useState(0)
  const [mouseEnd, setMouseEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const totalSlides = 4
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


  // Обработка бесшовного зацикливания
  useEffect(() => {
    if (!isTransitioning) return

    if (currentSlide === 0) {
      // Перепрыгиваем на последний реальный слайд
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(totalSlides)
      }, 500)
    } else if (currentSlide === totalSlides + 1) {
      // Перепрыгиваем на первый реальный слайд
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(1)
      }, 500)
    }
  }, [currentSlide, isTransitioning])

  const goToNextSlide = () => {
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }

  const goToPrevSlide = () => {
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }

  const goToSlide = (index: number) => {
    setIsTransitioning(true)
    setCurrentSlide(index + 1) // +1 потому что 0 - это клон
  }

  // Обработка свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Свайп влево
      goToNextSlide()
    }
    if (touchStart - touchEnd < -75) {
      // Свайп вправо
      goToPrevSlide()
    }
  }

  // Обработка перетаскивания мышью
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setMouseStart(e.clientX)
    setMouseEnd(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setMouseEnd(e.clientX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    const diff = mouseStart - mouseEnd
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        // Перетаскивание влево - следующий слайд
        goToNextSlide()
      } else {
        // Перетаскивание вправо - предыдущий слайд
        goToPrevSlide()
      }
    }
    setIsDragging(false)
    setMouseStart(0)
    setMouseEnd(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setMouseStart(0)
      setMouseEnd(0)
    }
  }

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
      <StickyHeader />

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
                Нейро-продавец для Telegram, WhatsApp, Avito — лиды 24/7 пока ты спишь
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
                  onClick={() => setIsDemoChatOpen(true)}
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
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="product" className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-balance section-title">
              Внедряем решение под ключ за 14 дней
            </h2>
          </div>
          <p className="text-base sm:text-xl text-center text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
            Грамотно внедренный ИИ-продавец + мультиканален + Яндекс. Директ может увеличить конверсию в заявку в 2-3
            раза
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
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
              aria-label="Предыдущий слайд"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
              aria-label="Следующий слайд"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div 
              className="relative overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Клон последнего слайда в начале */}
                <div className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/10 border-border mx-auto max-w-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        {(() => {
                          const Icon = benefitsData[benefitsData.length - 1].icon
                          return <Icon className="h-7 w-7 text-primary" />
                        })()}
                      </div>
                      <h3 className="text-xl font-bold">{benefitsData[benefitsData.length - 1].title}</h3>
                      <p className="text-muted-foreground">
                        {benefitsData[benefitsData.length - 1].description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Реальные слайды */}
                {benefitsData.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <Card className="bg-card/10 border-border mx-auto max-w-sm">
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
                    </div>
                  )
                })}

                {/* Клон первого слайда в конце */}
                <div className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/10 border-border mx-auto max-w-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        {(() => {
                          const Icon = benefitsData[0].icon
                          return <Icon className="h-7 w-7 text-primary" />
                        })()}
                      </div>
                      <h3 className="text-xl font-bold">{benefitsData[0].title}</h3>
                      <p className="text-muted-foreground">
                        {benefitsData[0].description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {benefitsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    (currentSlide === index + 1) || 
                    (currentSlide === 0 && index === totalSlides - 1) || 
                    (currentSlide === totalSlides + 1 && index === 0)
                      ? 'bg-primary' 
                      : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    width: (currentSlide === index + 1) || 
                           (currentSlide === 0 && index === totalSlides - 1) || 
                           (currentSlide === totalSlides + 1 && index === 0)
                      ? '0.67rem' 
                      : '0.21rem',
                    height: '0.21rem'
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
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Анализ бизнеса</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Изучаем ваши процессы, потребности клиентов и точки автоматизации</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Разработка решения</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Создаем и обучаем ИИ-сотрудника под специфику вашего бизнеса</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Внедрение и поддержка</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Интегрируем систему и обеспечиваем постоянную техподдержку</p>
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
                Мы команда экспертов в области искусственного интеллекта и автоматизации бизнес-процессов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-8 mb-12">
              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-3 md:p-8 space-y-1 md:space-y-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Target className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">200+</h3>
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
                      Наш ИИ-ассистент — это не просто чат-бот. Это полноценный виртуальный сотрудник, который понимает
                      контекст вашего бизнеса, знает ваши продукты и услуги, и способен вести диалог с клиентами на уровне
                      опытного менеджера.
                    </p>
                    <p>
                      Технология построена на базе передовых языковых моделей, адаптированных под специфику вашей отрасли.
                      Мы обучаем систему на ваших данных: прайс-листах, описаниях услуг, типовых вопросах клиентов и
                      скриптах продаж.
                    </p>
                    <p>
                      Результат — ИИ-сотрудник, который работает 24/7, никогда не устает, не уходит в отпуск и обрабатывает
                      неограниченное количество обращений одновременно. При этом каждый клиент получает персонализированный
                      подход и мгновенные ответы на свои вопросы.
                    </p>
                    <div className="pt-3 sm:pt-4 border-t border-border">
                      <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Ключевые возможности:</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Интеграция со всеми популярными мессенджерами и CRM-системами</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Автоматическая квалификация лидов и передача горячих заявок менеджерам</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Аналитика и отчеты по всем взаимодействиям с клиентами</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Постоянное обучение и улучшение на основе реальных диалогов</span>
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
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background">
            <h2 className="text-xl font-bold">Попробуйте ИИ-продавца</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDemoChatOpen(false)}
              className="hover:bg-muted"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Demo Chat Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <DemoChat />
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
            </p>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

