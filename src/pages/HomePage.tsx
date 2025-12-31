import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChatWidget } from "@/components/chat-widget"
import { StickyHeader } from "@/components/sticky-header"
import { DemoChat } from "@/components/demo-chat"
import { BusinessCasesCarousel } from "@/components/business-cases-carousel"
import { ConsultationModal } from "@/components/consultation-modal"
import { SpaceDust } from "@/components/space-dust"
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
} from "lucide-react"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(1) // Начинаем с 1 (первый реальный слайд)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

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

  // Автопрокрутка слайдера на мобильных
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentSlide((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь можно добавить отправку данных на сервер
    console.log({ phone, email, telegram })
    setIsSubmitted(true)
    
    // Сбросить форму через 5 секунд после успешной отправки
    setTimeout(() => {
      setIsSubmitted(false)
      setPhone("")
      setEmail("")
      setTelegram("")
    }, 5000)
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/robot-hero-2.jpeg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 hero-image-overlay" />
          <div className="absolute bottom-0 left-0 right-0 h-32 hero-bottom-fade" />
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
            <div className="space-y-8">
              <div className="inline-block">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
                  <span className="text-primary">NEURONIC</span> <br />
                  <span className="text-muted-foreground">LABS</span>
                </h1>
                <p className="text-muted-foreground text-[20px] uppercase tracking-wider">
                  Агентство по внедрению
               
                  автоматизации в бизнес
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Внедряем решение под ключ за 14 дней
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                ИИ-сотрудник работает 24/7, увеличивает заявки в 2-3 раза и снижает фонд оплаты труда
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => setIsModalOpen(true)}>
                  Получить консультацию
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chat Section */}
      <section id="demo-chat" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Попробуйте ИИ-продавца прямо сейчас</h2>
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

      {/* Benefits Section */}
      <section id="product" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
            Внедряем решение под ключ за 14 дней
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Грамотно внедренный ИИ-продавец + мультиканален + Яндекс. Директ может увеличить конверсию в заявку в 2-3
            раза
          </p>

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
          <div className="md:hidden">
            <div 
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Клон последнего слайда в начале */}
                <div className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/10 border-border">
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
                      <Card className="bg-card/10 border-border">
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
                  <Card className="bg-card/10 border-border">
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
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    (currentSlide === index + 1) || 
                    (currentSlide === 0 && index === totalSlides - 1) || 
                    (currentSlide === totalSlides + 1 && index === 0)
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Как мы работаем</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Анализ бизнеса</h3>
              <p className="text-muted-foreground">Изучаем ваши процессы, потребности клиентов и точки автоматизации</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Разработка решения</h3>
              <p className="text-muted-foreground">Создаем и обучаем ИИ-сотрудника под специфику вашего бизнеса</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Внедрение и поддержка</h3>
              <p className="text-muted-foreground">Интегрируем систему и обеспечиваем постоянную техподдержку</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">О нас</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы команда экспертов в области искусственного интеллекта и автоматизации бизнес-процессов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">200+</h3>
                  <p className="text-muted-foreground">Успешно внедренных проектов</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">5 лет</h3>
                  <p className="text-muted-foreground">Опыта в разработке ИИ-решений</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">14 дней</h3>
                  <p className="text-muted-foreground">Среднее время внедрения</p>
                </CardContent>
              </Card>
            </div>

            {/* Video and Product Description */}
            <div className="mb-12">
              <div className="flex flex-col gap-8">
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
                <div className="w-full space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">О нашем продукте</h3>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
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
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-xl font-bold mb-3">Ключевые возможности:</h4>
                      <ul className="space-y-2">
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
          </div>
        </div>
      </section>

      {/* Business Cases Section */}
      <section id="cases" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Кейсы бизнеса</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные результаты внедрения ИИ-автоматизации в различных отраслях
            </p>
          </div>

          <BusinessCasesCarousel />

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Хотите получить такие же результаты для вашего бизнеса?</p>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setIsModalOpen(true)}>
              Обсудить ваш проект
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Сценарии использования</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Продажи</h3>
                <p className="text-muted-foreground">Консультация клиентов, презентация продуктов, закрытие сделок</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <HeadphonesIcon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Поддержка</h3>
                <p className="text-muted-foreground">Ответы на частые вопросы, решение проблем клиентов 24/7</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Лидогенерация</h3>
                <p className="text-muted-foreground">Квалификация лидов, сбор контактов, запись на встречи</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Консультации</h3>
                <p className="text-muted-foreground">Экспертные советы, подбор решений, персональные рекомендации</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-balance">Готовы внедрить ИИ в ваш бизнес?</h2>
                <p className="text-xl text-muted-foreground">
                  Оставьте заявку, и наши эксперты свяжутся с вами в течение 15 минут, чтобы обсудить возможности
                  автоматизации вашего бизнеса
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
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
                        placeholder="@username (Telegram - опционально)"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-base md:text-lg py-1 md:py-3 px-4 h-auto min-h-[60px] whitespace-normal leading-tight">
                      Получить бесплатную консультацию
                      <Send className="ml-2 h-5 w-5 flex-shrink-0" />
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
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-lg mb-4">
            <span className="text-primary font-bold">NEURONIC</span>
            <span className="text-foreground font-bold">LABS</span>
          </p>
          <p>&copy; 2025 NEURONIC LABS. Все права защищены.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

