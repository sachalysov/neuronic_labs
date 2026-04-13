import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PhoneInput } from "@/components/ui/phone-input"
import { Checkbox } from "@/components/ui/checkbox"
import { StickyHeader } from "@/components/sticky-header"
import { ConsultationModal } from "@/components/consultation-modal"
import { CountdownTimer } from "@/components/countdown-timer"
import { SliderPagination } from "@/components/slider-pagination"
import { useEffect, useState, useRef, lazy, Suspense } from "react"
import { useLocation } from "react-router-dom"
import { useMeta } from "@/hooks/useMeta"
import { useContactForm } from "@/hooks/useContactForm"
import { useScrollLock } from "@/hooks/useScrollLock"
import { getAdminSettings, subscribeToAdminSettings, type AdminSettings } from "@/services/admin-settings"
import { createHomeMetaTags } from "@/lib/meta"
import {
  Bot,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Target,
  Award,
  Zap,
  Send,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Info,
  ChevronDown,
} from "lucide-react"

const SpaceDust = lazy(() => import("@/components/space-dust").then((module) => ({ default: module.SpaceDust })))
const DemoChat = lazy(() => import("@/components/demo-chat").then((module) => ({ default: module.DemoChat })))
const CapabilitiesList = lazy(() => import("@/components/capabilities-list").then((module) => ({ default: module.CapabilitiesList })))
const Pricing = lazy(() => import("@/components/pricing").then((module) => ({ default: module.Pricing })))
const FAQ = lazy(() => import("@/components/faq").then((module) => ({ default: module.FAQ })))
const Testimonials = lazy(() => import("@/components/testimonials").then((module) => ({ default: module.Testimonials })))
const Footer = lazy(() => import("@/components/footer").then((module) => ({ default: module.Footer })))
const ChatWidget = lazy(() => import("@/components/chat-widget").then((module) => ({ default: module.ChatWidget })))
import { AnimateOnScroll, StaggerChildren } from "@/components/animate-on-scroll"
import { OptimizedImage } from "@/components/optimized-image"

// Компонент для lazy loading видео Rutube - загружается только при прокрутке до него
function LazyVideoEmbed() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // Начинаем загрузку за 200px до появления в viewport
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={videoRef} className="relative rounded-xl overflow-hidden shadow-2xl w-full aspect-video">
      {shouldLoad ? (
        <iframe
          src="https://rutube.ru/play/embed/851a991a487b9f5d84f291495c77e6ba/?p=cDHWmAuDyzbq3xhmbAS4vA"
          title="ИИ-робот NEURONIC LABS"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-secondary/50 to-secondary/30 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Загрузка видео...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Статичные данные вынесены на уровень модуля — нет смысла пересоздавать в useMemo с пустым deps
const BENEFITS_DATA = [
  {
    icon: Bot,
    title: "ИИ-сотрудник работает 24/7, пока конкуренты спят",
    description: "Мгновенно отвечает на любые вопросы, 24/7 - круглосуточная коммуникация."
  },
  {
    icon: TrendingUp,
    title: "В 2-3 раза больше клиентов",
    description: "Грамотно внедренный ИИ-продавец + Яндекс. Директ может увеличить конверсию в заявку в 2-3 раза"
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

const HOME_META = createHomeMetaTags()

export default function HomePage() {
  useMeta(HOME_META)
  const location = useLocation()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false)
  const benefitsScrollRef = useRef<HTMLDivElement>(null)
  const examplesScrollRef = useRef<HTMLDivElement>(null)
  const stagesScrollRef = useRef<HTMLDivElement>(null)
  const automationSalesScrollRef = useRef<HTMLDivElement>(null)
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true)
  const [expandedDirections, setExpandedDirections] = useState<number | null>(null)
  const [expandedProductInfo, setExpandedProductInfo] = useState(false)

  const {
    name, phone, email, telegram, comment,
    isSubmitted, consentAccepted, errors,
    handleNameChange, handlePhoneChange, handleCommentChange, handleTelegramChange,
    handleSubmit, setConsentAccepted, setSelectedCountry, setEmail,
  } = useContactForm()

  useScrollLock(isDemoChatOpen)

  useEffect(() => {
    // Обрабатываем hash из URL (если есть)
    const hash = location.hash.substring(1) // убираем #
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        // Минимальная задержка для завершения рендера
        setTimeout(() => {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({ top: offsetPosition, behavior: "smooth" })
          // Убираем hash из URL после завершения плавного скролла
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname)
          }, 800)
        }, 50)
      } else {
        // Если элемент не найден, просто убираем hash
        window.history.replaceState(null, '', window.location.pathname)
      }
    } else {
      // Если hash нет, скроллим в начало страницы только при первой загрузке
      if (window.scrollY === 0) {
        window.scrollTo(0, 0)
      }
    }
  }, [location.hash])

  // Загрузка настроек для управления видимостью секций
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getAdminSettings()
        if (settings) {
          setTestimonialsEnabled(settings.testimonials_enabled ?? true)
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
      }
    }

    loadSettings()

    // Подписка на изменения настроек в реальном времени
    const unsubscribe = subscribeToAdminSettings((settings: AdminSettings) => {
      setTestimonialsEnabled(settings.testimonials_enabled ?? true)
    })

    return () => {
      unsubscribe()
    }
  }, [])


  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <SpaceDust />
      </Suspense>
      <StickyHeader onOpenDemoChat={() => setIsDemoChatOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image - eager для hero изображения (LCP optimization) */}
        <div className="absolute inset-0 z-[-2]">
          <OptimizedImage 
            src="/images/robot-hero-2.jpeg" 
            alt="ИИ-робот для автоматизации бизнеса - создание ИИ-агентов и чат-ботов для увеличения продаж и оптимизации процессов" 
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
          />
          <div className="absolute inset-0 hero-image-overlay" />
          <div className="absolute bottom-0 left-0 right-0 hero-bottom-fade" />
        </div>

        {/* Pattern Overlay - удален дублирующий SpaceDust для оптимизации производительности */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-20 z-[1]" />

        {/* Content */}
        <div className="container mx-auto px-4 pt-20 !pb-0 md:!pb-20 relative z-10">
          <div className="max-w-3xl">
            <div className="space-y-6 sm:space-y-8 [&>*:last-child]:mb-0">
              {/* Top badges with checkmarks */}
              <AnimateOnScroll animation="fade-down" duration={500} delay={200}>
                <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">90+ довольных клиентов</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">Внедрение за 7-14 дней</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">Поддержка 24/7</span>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Main headline */}
              <AnimateOnScroll animation="fade-up" duration={700} delay={400}>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                  Мой ИИ-продавец<br />
                  работает <span className="text-primary">24/7</span><br />
                  Пока конкуренты спят,<br />
                  он зарабатывает
                </h1>
              </AnimateOnScroll>

              {/* Description */}
              <AnimateOnScroll animation="fade-up" duration={700} delay={600}>
                <div className="space-y-2 sm:space-y-3 text-base sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  <p>Обрабатывает лиды за секунды в любом канале продаж<br /></p>
                  <p>Менеджеры сосредотачиваются только на горячих клиентах</p>
                  <p className="text-primary font-semibold">Конверсия растет в 3-5 раз за первый месяц</p>
                </div>
              </AnimateOnScroll>

              {/* Spacer for buttons */}
              <div className="h-[100px]"></div>

              <AnimateOnScroll animation="fade-up" duration={700} delay={800}>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="btn-shine text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 animate-pulse w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
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
              </AnimateOnScroll>

              {/* Mobile scroll hint under CTA */}
              <div className="md:hidden flex flex-col items-center mt-6 gap-1 text-muted-foreground/80 -mb-6 sm:-mb-8">
                <span className="text-xs tracking-wide uppercase">
                  Листайте ниже
                </span>
                <ChevronDown className="h-6 w-6 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chat Section - Desktop */}
      <section id="demo-chat" className="hidden md:block py-28 sm:py-32 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="max-w-4xl mx-auto text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance section-title">Попробуйте ИИ-продавца прямо сейчас</h2>
            <p className="text-xl text-muted-foreground">
              Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и
              закрывает возражения 24/7.
            </p>
          </AnimateOnScroll>

          <Suspense fallback={null}>
            <DemoChat />
          </Suspense>

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
          </p>
          <div className="text-center mt-6">
            <Button
              variant="default"
              size="lg"
              className="gap-2"
              onClick={() => {
                const el = document.getElementById('pricing')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
                setTimeout(() => window.dispatchEvent(new Event('open-pricing-quiz')), 600)
              }}
            >
              <Sparkles className="h-4 w-4" />
              Тест для выбора тарифа
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Chat Section - Mobile with Button */}
      <section className="md:hidden py-20 sm:py-28 px-4 sm:px-5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto relative">
          <div className="max-w-md mx-auto text-center">
            {/* Header */}
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-xs font-medium text-red-400 mb-2">
                <Bot className="h-3.5 w-3.5" />
                Живая демонстрация
              </div>
              <h2 className="text-[26px] sm:text-3xl font-bold text-balance section-title leading-tight">
                Попробуйте ИИ-продавца прямо сейчас
              </h2>
              <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях
              </p>
            </div>

            {/* Primary CTA */}
            <Button
              onClick={() => setIsDemoChatOpen(true)}
              className="h-14 px-8 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-3 text-[15px] font-semibold mx-auto"
              size="lg"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              Протестировать ИИ-бот
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Capabilities */}
            <Suspense fallback={null}>
              <CapabilitiesList />
            </Suspense>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm px-4 py-3 text-left">
              <Info className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/50" />
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-widest font-medium">или</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/50" />
            </div>

            {/* Secondary CTA */}
            <Button
              variant="outline"
              size="lg"
              className="gap-2.5 text-sm rounded-xl border-border/60 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 w-full max-w-[280px]"
              onClick={() => {
                const el = document.getElementById('pricing')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
                setTimeout(() => window.dispatchEvent(new Event('open-pricing-quiz')), 600)
              }}
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              Тест для выбора тарифа
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="product" className="py-28 sm:py-32 px-3 sm:px-4">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700}>
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-balance section-title">
                Внедрим ИИ-продавца в ваш бизнес за 7 дней
              </h2>
            </div>
            <p className="text-base sm:text-xl text-center text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
              Cоздаём ИИ-агента, чат-бота, автоматизируем рутинные задачи, счета и отчёты.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="scale-in" duration={500} className="text-center mb-10 sm:mb-16">
            <Button
              size="lg"
              className="btn-shine text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Хочу увеличить продажи
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </AnimateOnScroll>

          {/* Desktop Grid */}
          <StaggerChildren staggerDelay={120} animation="fade-up" className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {BENEFITS_DATA.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="bg-card/10 border-border hover:border-primary card-hover-lift gradient-border-animated">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center icon-hover-glow">
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
          </StaggerChildren>

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
              {BENEFITS_DATA.map((benefit, index) => {
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
            </div>
            <SliderPagination 
              containerRef={benefitsScrollRef} 
              itemCount={BENEFITS_DATA.length}
            />
          </div>
        </div>
      </section>


      {/* Directions & Products Section – аналог «Направления и продукты» */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-secondary/40 border-y border-border">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Направления и продукты NEURONIC LABS
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Разрабатываем и внедряем ИИ-решения под ключ: от умных чат-ботов до компьютерного зрения и
              предиктивной аналитики.
            </p>
          </AnimateOnScroll>

          {/* Автоматизация продаж – десктопная сетка */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-stretch mb-8 sm:mb-12">
            {/* AI-продавец */}
            <Card className="bg-card/90 border-border shadow-xl">
              <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                    Голосовые и текстовые боты
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                    Голосовые и текстовые чат‑боты для 24/7‑коммуникаций
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    ИИ‑боты, которые не пропускают звонки и сообщения, консультируют по скриптам и передают сложные
                    вопросы человеку.
                  </p>

                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Интеграция с WhatsApp, Telegram, VK, сайтом и телефонией в единую систему.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Естественная речь и диалоги в тоне бренда, с учётом вашего стиля и сценариев.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Сбор и передача лидов в CRM‑систему с комментариями и историей общения.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Подробнее про чат‑ботов
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => {
                      const demoSection = document.getElementById("demo-chat")
                      if (demoSection) {
                        demoSection.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    }}
                  >
                    Попробовать демо
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Превью интерфейса / телефона */}
            <Card className="bg-card border-border shadow-xl flex items-center justify-center">
              <CardContent className="p-6 sm:p-8 flex items-center justify-center h-full">
                <div className="w-full max-w-xs mx-auto aspect-[9/19] rounded-[2.5rem] border border-border bg-background overflow-hidden shadow-2xl">
                  <OptimizedImage 
                    src="/images/demo-chat-mobile.jpg" 
                    alt="Пример диалога с ИИ-продавцом в мобильном приложении - автоматическая обработка запросов клиентов" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Автоматизация продаж – мобильный слайдер */}
          <div className="md:hidden -mx-3 mb-8 sm:mb-12">
            <div
              ref={automationSalesScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-3 pb-4"
              style={{ scrollPaddingLeft: "0.75rem", scrollPaddingRight: "0.75rem" }}
            >
              {/* Слайд 1: описание продукта */}
              <Card className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card/90 border-border shadow-xl">
                <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-3 sm:space-y-4">
                    <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                      Голосовые и текстовые боты
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-balance">
                      Голосовые и текстовые чат‑боты для 24/7‑коммуникаций
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      ИИ‑боты, которые не пропускают звонки и сообщения, консультируют по скриптам и передают сложные
                      вопросы человеку.
                    </p>

                    <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Интеграция с WhatsApp, Telegram, VK, сайтом и телефонией в единую систему.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Естественная речь и диалоги в тоне бренда, с учётом вашего стиля и сценариев.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Сбор и передача лидов в CRM‑систему с комментариями и историей общения.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      size="lg"
                      className="w-full text-sm sm:text-base"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Подробнее про чат‑ботов
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full text-sm sm:text-base"
                      onClick={() => {
                        const demoSection = document.getElementById("demo-chat")
                        if (demoSection) {
                          demoSection.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      }}
                    >
                      Посмотреть демо
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Слайд 2: пример диалога */}
              <Card className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card border-border shadow-xl flex items-center justify-center">
                <CardContent className="p-5 sm:p-6 flex items-center justify-center h-full">
                  <div className="w-full max-w-xs mx-auto aspect-[9/19] rounded-[2.5rem] border border-border bg-background overflow-hidden shadow-2xl">
                    <img 
                      src="/images/demo-chat-mobile.jpg" 
                      alt="Пример диалога с ИИ-продавцом в мобильном приложении - автоматическая обработка запросов клиентов" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <SliderPagination 
              containerRef={automationSalesScrollRef} 
              itemCount={2}
            />
          </div>

          {/* Остальные направления – большие блоки по стилю «Автоматизация продаж» */}
          {/* Desktop: обычные карточки */}
          <div className="hidden md:block space-y-8 sm:space-y-10">
            {/* ИИ‑контроль качества */}
            <Card className="bg-card/90 border-border shadow-xl">
              <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                    Контроль качества и стандарты сервиса
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                    ИИ‑контроль качества колл‑центра и отдела продаж
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Система, которая анализирует 100% звонков и переписок по скриптам, сразу находит проблемные
                    точки и формирует понятные отчёты и рекомендации.
                  </p>

                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Контроль соблюдения скриптов и стандартов сервиса по каждому диалогу.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Оценка конверсий и качества работы каждого менеджера в режиме реального времени.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Готовые чек‑листы и подсказки для обучения, роста и мотивации команды.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Подробнее про ИИ‑контроль качества
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Голосовые и текстовые чат‑боты */}
            <Card className="bg-card/90 border-border shadow-xl">
              <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                    Голосовые и текстовые боты
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                    Голосовые и текстовые чат‑боты для 24/7‑коммуникаций
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    ИИ‑боты, которые не пропускают звонки и сообщения, консультируют по скриптам и передают сложные
                    вопросы человеку.
                  </p>

                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Интеграция с WhatsApp, Telegram, VK, сайтом и телефонией в единую систему.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Естественная речь и диалоги в тоне бренда, с учётом вашего стиля и сценариев.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Сбор и передача лидов в CRM‑систему с комментариями и историей общения.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Подробнее про чат‑ботов
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Компьютерное зрение и предиктивная аналитика */}
            <Card className="bg-card/90 border-border shadow-xl">
              <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                    Компьютерное зрение и аналитика
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                    Компьютерное зрение и предиктивная аналитика
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Решения на базе ИИ, которые видят, прогнозируют и помогают управлять бизнес‑процессами на данных.
                  </p>

                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Анализ видео и изображений: контроль качества, безопасность, мониторинг процессов.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Прогноз спроса, LTV и оттока клиентов для уверенных управленческих решений.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Предотвращение аварий и простоев оборудования за счёт предиктивной аналитики.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Подробнее про компьютерное зрение
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile: Аккордеон */}
          <div className="md:hidden space-y-4">
            {[
              {
                category: "Контроль качества и стандарты сервиса",
                title: "ИИ‑контроль качества колл‑центра и отдела продаж",
                description: "Система, которая анализирует 100% звонков и переписок по скриптам, сразу находит проблемные точки и формирует понятные отчёты и рекомендации.",
                items: [
                  "Контроль соблюдения скриптов и стандартов сервиса по каждому диалогу.",
                  "Оценка конверсий и качества работы каждого менеджера в режиме реального времени.",
                  "Готовые чек‑листы и подсказки для обучения, роста и мотивации команды."
                ],
                buttonText: "Подробнее про ИИ‑контроль качества"
              },
              {
                category: "Голосовые и текстовые боты",
                title: "Голосовые и текстовые чат‑боты для 24/7‑коммуникаций",
                description: "ИИ‑боты, которые не пропускают звонки и сообщения, консультируют по скриптам и передают сложные вопросы человеку.",
                items: [
                  "Интеграция с WhatsApp, Telegram, VK, сайтом и телефонией в единую систему.",
                  "Естественная речь и диалоги в тоне бренда, с учётом вашего стиля и сценариев.",
                  "Сбор и передача лидов в CRM‑систему с комментариями и историей общения."
                ],
                buttonText: "Подробнее про чат‑ботов"
              },
              {
                category: "Компьютерное зрение и аналитика",
                title: "Компьютерное зрение и предиктивная аналитика",
                description: "Решения на базе ИИ, которые видят, прогнозируют и помогают управлять бизнес‑процессами на данных.",
                items: [
                  "Анализ видео и изображений: контроль качества, безопасность, мониторинг процессов.",
                  "Прогноз спроса, LTV и оттока клиентов для уверенных управленческих решений.",
                  "Предотвращение аварий и простоев оборудования за счёт предиктивной аналитики."
                ],
                buttonText: "Подробнее про компьютерное зрение"
              }
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-card/90 border-border shadow-xl cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setExpandedDirections(expandedDirections === index ? null : index)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="uppercase tracking-[0.18em] text-xs text-primary font-semibold mb-2">
                        {item.category}
                      </p>
                      <h3 className="text-lg sm:text-xl font-bold text-balance">
                        {item.title}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                        expandedDirections === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedDirections === index ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {item.items.map((listItem, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="mt-1 text-primary">●</span>
                          <span>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="lg"
                      className="w-full text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsModalOpen(true)
                      }}
                    >
                      {item.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stages of Implementation – «Этапы внедрения ИИ в ваш бизнес» */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-background">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Этапы внедрения ИИ в ваш бизнес
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Работаем по прозрачной пошаговой воронке: от глубокого аудита процессов до оптимизации и роста
              показателей после запуска.
            </p>
          </AnimateOnScroll>

          {/* Desktop Grid */}
          <StaggerChildren staggerDelay={150} animation="fade-left" className="hidden md:grid md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
            <Card className="bg-card border-border shadow-md card-hover-lift">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">1.</p>
                <h3 className="text-lg sm:text-2xl font-bold">
                  Глубокое исследование ваших бизнес‑процессов
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Проводим аудит процессов и находим точки роста с помощью ИИ‑аналитики. Показываем конкретные цифры
                  потенциальной экономии и прироста выручки.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-md card-hover-lift">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">2.</p>
                <h3 className="text-lg sm:text-2xl font-bold">
                  Формирование индивидуальной стратегии действий
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Подготавливаем персональную стратегию под ваши задачи: какие ИИ‑решения запускать, в каком порядке,
                  какие KPI и сроки ожидаем.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-md card-hover-lift">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">3.</p>
                <h3 className="text-lg sm:text-2xl font-bold">Подготовка и запуск проекта</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Создаём и настраиваем ИИ‑решение под ваш сценарий: интегрируем с CRM, мессенджерами и телефонией,
                  тестируем на реальных диалогах.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-md card-hover-lift">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">4.</p>
                <h3 className="text-lg sm:text-2xl font-bold">Оптимизация процессов после запуска</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Сопровождаем вас первый месяц после запуска: дорабатываем сценарии, усиливаем конверсию, подключаем
                  дополнительные каналы и отчётность.
                </p>
              </CardContent>
            </Card>
          </StaggerChildren>

          {/* Mobile Slider */}
          <div className="md:hidden relative mb-10 sm:mb-12">
            <div
              ref={stagesScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{
                scrollPaddingLeft: '0.5rem',
                scrollPaddingRight: '0.5rem'
              }}
            >
              {[
                {
                  number: "1.",
                  title: "Глубокое исследование ваших бизнес‑процессов",
                  description: "Проводим аудит процессов и находим точки роста с помощью ИИ‑аналитики. Показываем конкретные цифры потенциальной экономии и прироста выручки."
                },
                {
                  number: "2.",
                  title: "Формирование индивидуальной стратегии действий",
                  description: "Подготавливаем персональную стратегию под ваши задачи: какие ИИ‑решения запускать, в каком порядке, какие KPI и сроки ожидаем."
                },
                {
                  number: "3.",
                  title: "Подготовка и запуск проекта",
                  description: "Создаём и настраиваем ИИ‑решение под ваш сценарий: интегрируем с CRM, мессенджерами и телефонией, тестируем на реальных диалогах."
                },
                {
                  number: "4.",
                  title: "Оптимизация процессов после запуска",
                  description: "Сопровождаем вас первый месяц после запуска: дорабатываем сценарии, усиливаем конверсию, подключаем дополнительные каналы и отчётность."
                }
              ].map((item, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card border-border shadow-md"
                >
                  <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                    <p className="text-primary text-3xl sm:text-4xl font-bold">{item.number}</p>
                    <h3 className="text-lg sm:text-2xl font-bold">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SliderPagination 
              containerRef={stagesScrollRef} 
              itemCount={4}
            />
          </div>

          <div className="max-w-xl mx-auto text-center space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">
              Получите бесплатный аудит ваших бизнес‑процессов и расчёт перспектив внедрения ИИ‑решений в ваш бизнес.
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-5"
              onClick={() => setIsModalOpen(true)}
            >
              Получить аудит бизнеса
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Examples of Use – «Примеры применения ИИ‑решений» */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-secondary/30 border-y border-border">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Примеры применения ИИ‑решений
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Показываем, как ИИ даёт измеримую выгоду в разных отраслях: от здравоохранения и логистики до
              digital‑маркетинга и юриспруденции.
            </p>
          </AnimateOnScroll>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-5xl mx-auto">
            <Card className="bg-card border-dashed border-border flex flex-col">
              <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary">Здравоохранение</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Ключевая проблема:</span> дефицит специалистов, высокая нагрузка на
                    врачей и потребность в ранней диагностике.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Решение:</span> ИИ‑ассистент для анализа изображений и обработки
                    медицинской документации.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Измеримая выгода:</span> повышение точности диагностики, сокращение
                    времени на документацию до 60%.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border flex flex-col">
              <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary">Digital‑маркетинг</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Ключевая проблема:</span> неэффективные рекламные кампании и отток
                    клиентов.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Решение:</span> предиктивная аналитика и ИИ‑модели сегментации.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Измеримая выгода:</span> прогнозирование LTV и оттока, сокращение
                    расходов на рекламу.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border flex flex-col">
              <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary">Юриспруденция</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Ключевая проблема:</span> рутинный и медленный анализ судебных
                    документов.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Решение:</span> Legal‑ИИ‑агент для анализа договоров и судебной
                    практики.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Измеримая выгода:</span> сокращение времени на анализ до 62% и
                    автоматическое заполнение типовых форм.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border flex flex-col">
              <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary">Промышленность и логистика</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Ключевая проблема:</span> незапланированные поломки и неэффективное
                    управление запасами.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Решение:</span> предиктивная аналитика и компьютерное зрение для
                    мониторинга оборудования и складов.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <span className="font-semibold">Измеримая выгода:</span> снижение затрат на обслуживание на
                    20–30% и снижение рисков простоев.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative">
            <div
              ref={examplesScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{
                scrollPaddingLeft: '0.5rem',
                scrollPaddingRight: '0.5rem'
              }}
            >
              {[
                {
                  title: "Здравоохранение",
                  problem: "дефицит специалистов, высокая нагрузка на врачей и потребность в ранней диагностике",
                  solution: "ИИ‑ассистент для анализа изображений и обработки медицинской документации",
                  benefit: "повышение точности диагностики, сокращение времени на документацию до 60%"
                },
                {
                  title: "Digital‑маркетинг",
                  problem: "неэффективные рекламные кампании и отток клиентов",
                  solution: "предиктивная аналитика и ИИ‑модели сегментации",
                  benefit: "прогнозирование LTV и оттока, сокращение расходов на рекламу"
                },
                {
                  title: "Юриспруденция",
                  problem: "рутинный и медленный анализ судебных документов",
                  solution: "Legal‑ИИ‑агент для анализа договоров и судебной практики",
                  benefit: "сокращение времени на анализ до 62% и автоматическое заполнение типовых форм"
                },
                {
                  title: "Промышленность и логистика",
                  problem: "незапланированные поломки и неэффективное управление запасами",
                  solution: "предиктивная аналитика и компьютерное зрение для мониторинга оборудования и складов",
                  benefit: "снижение затрат на обслуживание на 20–30% и снижение рисков простоев"
                }
              ].map((item, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card border-dashed border-border flex flex-col"
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-primary">{item.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <span className="font-semibold">Ключевая проблема:</span> {item.problem}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <span className="font-semibold">Решение:</span> {item.solution}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <span className="font-semibold">Измеримая выгода:</span> {item.benefit}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Получить консультацию
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SliderPagination 
              containerRef={examplesScrollRef} 
              itemCount={4}
            />
          </div>
        </div>
      </section>

      {/* Complex AI Implementation CTA – «Комплексное внедрение ИИ» */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-background">
        <div className="container mx-auto">
          <AnimateOnScroll animation="scale-in" duration={800}>
          <Card className="bg-card border-border shadow-2xl">
            <CardContent className="p-6 sm:p-10 md:p-12 text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-balance">
                Комплексное внедрение искусственного интеллекта для вашего бизнеса
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Разрабатываем и внедряем ИИ‑решения под ключ: от ИИ‑помощников и чат‑ботов до систем компьютерного
                зрения и аналитики. Берём на себя весь цикл — от идеи и проекта до запуска и поддержки.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Получите бесплатный аудит ваших бизнес‑процессов и расчёт перспектив внедрения ИИ‑решений в ваш
                бизнес уже на первой консультации.
              </p>
              <Button
                size="lg"
                className="btn-shine w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-5"
                onClick={() => setIsModalOpen(true)}
              >
                Получить аудит бизнеса
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CardContent>
          </Card>
          </AnimateOnScroll>
        </div>
      </section>


      {/* Pricing Section */}
      <Suspense fallback={null}>
        <Pricing onContactClick={() => setIsModalOpen(true)} />
      </Suspense>

      {/* About Us Section */}
      <section id="about" className="py-28 sm:py-32 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <AnimateOnScroll animation="fade-up" duration={700} className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">О нас</h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы команда экспертов по созданию ИИ-агентов, чат-ботов и интеллектуальной автоматизации бизнес-процессов. Интеграция ИИ в работу, автоматизация рутинных задач, счетов и отчётов
              </p>
            </AnimateOnScroll>

            <StaggerChildren staggerDelay={150} animation="scale-in" className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 mb-12">
              <Card className="bg-card/10 border-border text-center card-hover-lift">
                <CardContent className="p-3 md:p-6 lg:p-8 space-y-1 md:space-y-3 lg:space-y-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto icon-hover-glow">
                    <Target className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold">90+</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Успешно внедренных проектов</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center card-hover-lift">
                <CardContent className="p-3 md:p-6 lg:p-8 space-y-1 md:space-y-3 lg:space-y-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto icon-hover-glow">
                    <Award className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold">5 лет</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Опыта в разработке ИИ-решений</p>
                </CardContent>
              </Card>

              <Card className="bg-card/10 border-border text-center card-hover-lift">
                <CardContent className="p-3 md:p-6 lg:p-8 space-y-1 md:space-y-3 lg:space-y-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto icon-hover-glow">
                    <Zap className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold">14 дней</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Среднее время внедрения</p>
                </CardContent>
              </Card>
            </StaggerChildren>

            {/* Video and Product Description */}
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* Robot Video Section - Full Width с lazy loading для оптимизации производительности */}
                <div className="w-full">
                  <LazyVideoEmbed />
                </div>

                {/* Text Section - Below Video */}
                {/* Desktop: обычный текст */}
                <div className="hidden md:block w-full space-y-4 sm:space-y-6">
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

                {/* Mobile: Предпросмотр с кнопкой "Показать еще" */}
                <div className="md:hidden w-full">
                  <Card className="bg-card border-border">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">О нашем продукте</h3>
                      
                      {/* Предпросмотр - всегда видимый (10% текста) */}
                      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                        <p>
                          Наш ИИ-агент и чат-бот — это не просто автоматизация. Это интеллектуальная автоматизация бизнеса с помощью нейросети. Создаём ИИ-помощника, который понимает контекст вашего бизнеса, знает ваши продукты и услуги, и способен вести диалог с клиентами на уровне опытного менеджера.
                        </p>
                      </div>
                      
                      {/* Остальной контент - скрыт по умолчанию */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedProductInfo ? "max-h-[3000px] opacity-100 mt-3" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                          <p>
                            Технология построена на базе передовых языковых моделей, адаптированных под специфику вашей отрасли. Мы создаём ИИ-агента, обучая систему на ваших данных: прайс-листах, описаниях услуг, типовых вопросах клиентов и скриптах продаж. Интеграция ИИ в работу позволяет автоматизировать не только продажи, но и рутинные задачи, генерацию контента, создание счетов и отчётов.
                          </p>
                          <p>
                            Результат — ИИ-агент для бизнеса, который работает 24/7, никогда не устает, не уходит в отпуск и обрабатывает неограниченное количество обращений одновременно. Автоматизация с ИИ охватывает все бизнес-процессы: от обработки лидов до автоматизации счетов и отчётов. При этом каждый клиент получает персонализированный подход и мгновенные ответы на свои вопросы.
                          </p>
                          <div className="pt-3 border-t border-border">
                            <h4 className="text-base font-bold mb-2">Ключевые возможности:</h4>
                            <ul className="space-y-1.5">
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
                      
                      {/* Кнопка "Показать еще" / "Скрыть" */}
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setExpandedProductInfo(!expandedProductInfo)}
                        >
                          {expandedProductInfo ? "Скрыть" : "Показать еще"}
                          <ChevronDown
                            className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                              expandedProductInfo ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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

      {/* Founder Section */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Top Slogan */}
            <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-primary">ЛИЧНО КОНТРОЛИРУЮ</span>
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                КАЖДЫЙ ПРОЕКТ
              </h2>
            </AnimateOnScroll>

            {/* Main Content */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-8 lg:gap-12">
              {/* Portrait - Mobile: centered, Desktop: left */}
              <AnimateOnScroll animation="fade-right" duration={800} className="w-full md:order-1 flex justify-center md:justify-start md:self-stretch">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-md md:max-w-none md:h-full">
                  <OptimizedImage 
                    src="/images/founder-portrait.jpg" 
                    alt="Александр Лысов - основатель и CEO NEURONIC LABS, эксперт по внедрению ИИ-автоматизации в бизнес" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </AnimateOnScroll>

              {/* Info Section - Mobile: below image, Desktop: right */}
              <AnimateOnScroll animation="fade-left" duration={800} delay={200} className="w-full md:order-2 space-y-6 sm:space-y-8">
                {/* Name and Title */}
                <div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
                    Александр Лысов
                  </h3>
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                    Основатель NEURONIC LABS
                  </p>
                </div>

                {/* Qualifications */}
                <div className="space-y-4">
                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-1">
                        Имею опыт построения команды в сфере информационных технологий  
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-1">
                        Более 5 лет опыта работы в разработке <br /> IT решений для бизнеса
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-1">
                        Автор курса <br /> "Создание сайтов с помощью Нейросетей"
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Offer Description */}
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Получите бесплатный аудит ваших бизнес-процессов и расчет перспективы внедрения ИИ-решений в ваш бизнес
                </p>

                {/* CTA Button */}
                <div className="flex justify-center md:justify-start">
                  <Button 
                    asChild
                    size="lg" 
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                  >
                    <a
                      href="https://t.me/aslysov"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      КОНСУЛЬТАЦИЯ С АЛЕКСАНДРОМ
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  </Button>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonialsEnabled && (
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
      )}

      {/* FAQ Section */}
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>

      {/* Final CTA Section */}
      <section className="py-28 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto">
          <AnimateOnScroll animation="scale-in" duration={800}>
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
                        onChange={handleNameChange}
                        required
                        className={`bg-background border-border ${errors.name ? 'border-destructive' : ''}`}
                        aria-invalid={errors.name ? 'true' : 'false'}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <PhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                        onCountryChange={setSelectedCountry}
                        placeholder=" (___) ___-__-__"
                        required
                        error={errors.phone}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone}</p>
                      )}
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
                        placeholder="Комментарий к письму (макс. 1500 символов)"
                        value={comment}
                        onChange={handleCommentChange}
                        className={`bg-background border-border ${errors.comment ? 'border-destructive' : ''}`}
                        rows={3}
                        maxLength={1500}
                        aria-invalid={errors.comment ? 'true' : 'false'}
                      />
                      <div className="flex justify-between items-center">
                        {errors.comment && (
                          <p className="text-xs text-destructive">{errors.comment}</p>
                        )}
                        <p className={`text-xs ml-auto ${comment.length > 1500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {comment.length}/1500
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="consent-home"
                          checked={consentAccepted}
                          onCheckedChange={(checked) => {
                            setConsentAccepted(checked === true)
                          }}
                          className="mt-1"
                        />
                        <label
                          htmlFor="consent-home"
                          className="text-xs sm:text-sm text-foreground cursor-pointer leading-relaxed"
                        >
                          Я согласен(а) на обработку персональных данных в соответствии с{" "}
                          <a
                            href="/politika-konfidentsialnosti"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = '/politika-konfidentsialnosti'
                            }}
                            className="text-primary hover:underline"
                          >
                            Политикой конфиденциальности
                          </a>
                          {" "}*
                        </label>
                      </div>
                      {errors.consent && (
                        <p className="text-xs text-destructive">{errors.consent}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full text-sm sm:text-base md:text-lg py-3 sm:py-3 md:py-3 px-4 h-auto min-h-[50px] sm:min-h-[60px] whitespace-normal leading-tight"
                      disabled={!consentAccepted}
                    >
                      Получить бесплатную консультацию
                      <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </Button>
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
          </AnimateOnScroll>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Chat Widget */}
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>

      {/* Mobile Demo Chat Modal */}
      {isDemoChatOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col h-screen">
          {/* Demo Chat Content - Full Screen */}
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <Suspense fallback={null}>
              <DemoChat onClose={() => setIsDemoChatOpen(false)} isMobile={true} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

