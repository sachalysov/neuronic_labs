import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PhoneInput } from "@/components/ui/phone-input"
import { ChatWidget } from "@/components/chat-widget"
import { StickyHeader } from "@/components/sticky-header"
import { DemoChat } from "@/components/demo-chat"
import { CapabilitiesList } from "@/components/capabilities-list"
import { ConsultationModal } from "@/components/consultation-modal"
import { SpaceDust } from "@/components/space-dust"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { CountdownTimer } from "@/components/countdown-timer"
import { Footer } from "@/components/footer"
import { submitFormData } from "@/services/form"
import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useMeta } from "@/hooks/useMeta"
import { getAdminSettings, subscribeToAdminSettings, type AdminSettings } from "@/services/admin-settings"
import { createHomeMetaTags } from "@/lib/meta"
import { validatePhone, validateName, validateComment, CIS_COUNTRIES, type Country } from "@/lib/phone-validation"
import {
  Bot,
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  Target,
  Award,
  Zap,
  Send,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Scissors,
  Home,
  Cross,
  Wrench,
  Briefcase,
  Info,
  ChevronDown,
} from "lucide-react"

export default function HomePage() {
  useMeta(createHomeMetaTags())
  const location = useLocation()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(CIS_COUNTRIES[0])
  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
    comment?: string
  }>({})
  const benefitsScrollRef = useRef<HTMLDivElement>(null)
  const businessTypesScrollRef = useRef<HTMLDivElement>(null)
  const examplesScrollRef = useRef<HTMLDivElement>(null)
  const stagesScrollRef = useRef<HTMLDivElement>(null)
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true)
  const [expandedDirections, setExpandedDirections] = useState<number | null>(null)
  const [expandedProductInfo, setExpandedProductInfo] = useState(false)
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
          window.scrollTo({ top: offsetPosition, behavior: "auto" })
          // Убираем hash из URL после скролла
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname)
          }, 100)
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

  // Отслеживание активного слайда (без клонов и бесконечной прокрутки)
  useEffect(() => {
    const container = benefitsScrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft

      // Пробегаемся по карточкам, чтобы обеспечить корректный расчёт позиций.
      let closestDistance = Infinity

      Array.from(container.children).forEach((child) => {
        const card = child as HTMLElement
        const cardLeft = card.offsetLeft
        const cardCenter = cardLeft + card.offsetWidth / 2
        const distance = Math.abs(scrollLeft + container.offsetWidth / 2 - cardCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
        }
      })
    }

    // Небольшая задержка для правильного расчета размеров и установки стартового индекса
    setTimeout(() => {
      handleScroll()
    }, 100)
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [benefitsData.length])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    
    // Валидация в реальном времени
    if (value) {
      const validation = validateName(value)
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, name: validation.error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.name
          return newErrors
        })
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.name
        return newErrors
      })
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    
    // Валидация в реальном времени
    if (value && value !== selectedCountry.dialCode) {
      const validation = validatePhone(value, selectedCountry)
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, phone: validation.error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.phone
          return newErrors
        })
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.phone
        return newErrors
      })
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setComment(value)
    
    // Валидация в реальном времени
    if (value) {
      const validation = validateComment(value, 1500)
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, comment: validation.error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.comment
          return newErrors
        })
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.comment
        return newErrors
      })
    }
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
    
    // Валидация всех полей
    const nameValidation = validateName(name)
    const phoneValidation = validatePhone(phone, selectedCountry)
    const commentValidation = validateComment(comment, 1500)
    
    const newErrors: typeof errors = {}
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.error
    }
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.error
    }
    if (!commentValidation.valid) {
      newErrors.comment = commentValidation.error
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
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
        setErrors({})
        setSelectedCountry(CIS_COUNTRIES[0])
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
        {/* Background Image - eager для hero изображения (LCP optimization) */}
        <div className="absolute inset-0 z-[-2]">
          <img 
            src="/images/robot-hero-2.jpeg" 
            alt="Автоматизация бизнеса с ИИ - NEURONIC LABS" 
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 hero-image-overlay" />
          <div className="absolute bottom-0 left-0 right-0 hero-bottom-fade" />
        </div>

        {/* Pattern Overlay - удален дублирующий SpaceDust для оптимизации производительности */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-20 z-[1]" />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Top badges with checkmarks */}
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

              {/* Main headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Ваш ИИ-продавец<br />
                работает <span className="text-primary">24/7</span><br />
                Пока конкуренты спят,<br />
                он зарабатывает
              </h1>

              {/* Description */}
              <div className="space-y-2 sm:space-y-3 text-base sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
                <p>Обрабатывает лиды за секунды в любом канале продаж<br /></p>
                <p>Менеджеры сосредотачиваются только на горячих клиентах</p>
                <p className="text-primary font-semibold">Конверсия растет в 3-5 раз за первый месяц</p>
              </div>

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
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background border-y border-border">
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
      <section id="demo-chat" className="hidden md:block py-20 sm:py-32 px-4 bg-gradient-to-b from-background to-secondary/20">
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
      <section className="md:hidden py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
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
              Протестировать ИИ-бот
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <CapabilitiesList />
            
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
            </p>
          </div>
        </div>
      </section>


      {/* Business Types Section */}
      <section id="services" className="py-20 sm:py-32 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Для какого бизнеса это работает лучше всего</h2>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Scissors className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">САЛОНЫ И СПА</h3>
                <p className="text-sm md:text-base text-muted-foreground">+50% клиентов, 0 пропущенных звонков</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Home className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">РИЭЛТОРЫ</h3>
                <p className="text-sm md:text-base text-muted-foreground">+300% просмотров, ответ за 30 сек</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">E-COMMERCE</h3>
                <p className="text-sm md:text-base text-muted-foreground">Чек +40%, конверсия +50%</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Cross className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">КЛИНИКИ</h3>
                <p className="text-sm md:text-base text-muted-foreground">No-show упали на 60%</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Wrench className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">АВТОСЕРВИСЫ</h3>
                <p className="text-sm md:text-base text-muted-foreground">Полная запись на неделю вперед</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">КОНСУЛЬТАНТЫ</h3>
                <p className="text-sm md:text-base text-muted-foreground">Консультант работает только с готовыми клиентами</p>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative">
            <div
              ref={businessTypesScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{
                scrollPaddingLeft: '0.5rem',
                scrollPaddingRight: '0.5rem'
              }}
            >
              {[
                { icon: Scissors, title: "САЛОНЫ И СПА", desc: "+50% клиентов, 0 пропущенных звонков" },
                { icon: Home, title: "РИЭЛТОРЫ", desc: "+300% просмотров, ответ за 30 сек" },
                { icon: ShoppingCart, title: "E-COMMERCE", desc: "Чек +40%, конверсия +50%" },
                { icon: Cross, title: "КЛИНИКИ", desc: "No-show упали на 60%" },
                { icon: Wrench, title: "АВТОСЕРВИСЫ", desc: "Полная запись на неделю вперед" },
                { icon: Briefcase, title: "КОНСУЛЬТАНТЫ", desc: "Консультант работает только с готовыми клиентами" },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <Card
                    key={index}
                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/10 border-border"
                  >
                    <CardContent className="p-6 space-y-4 text-center">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="product" className="py-20 sm:py-32 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-balance section-title">
              Внедрим ИИ-продавца в ваш бизнес за 7 дней
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
            </div>
          </div>
        </div>
      </section>


      {/* Directions & Products Section – аналог «Направления и продукты» */}
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-secondary/40 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Направления и продукты NEURONIC LABS
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Разрабатываем и внедряем ИИ-решения под ключ: от умных чат-ботов до компьютерного зрения и
              предиктивной аналитики.
            </p>
          </div>

          {/* Автоматизация продаж – десктопная сетка */}
          <div className="hidden md:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-stretch mb-8 sm:mb-12">
            {/* AI-продавец */}
            <Card className="bg-card/90 border-border shadow-xl">
              <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                    Автоматизация продаж
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                    Автоматизация и&nbsp;увеличение продаж на&nbsp;30% с&nbsp;помощью ИИ‑продавца
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                    Умный чат‑бот на базе нейросети, который ведёт полноценные продающие диалоги с вашими лидами
                    24/7 во всех основных каналах: сайт, мессенджеры, соцсети.
                  </p>

                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Обрабатывает 100% входящих обращений за секунды, не теряя ни одного лида.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Отвечает на частые вопросы, презентует продукты и собирает данные для CRM.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Передаёт «горячие» заявки менеджеру, фиксируя ключевые детали сделки.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-1 text-primary">●</span>
                      <span>Работает в тоне бренда и поддерживает сценарии продаж, согласованные с вами.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Подробнее про ИИ‑продавца
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
                    Посмотреть демо
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Превью интерфейса / телефона */}
            <Card className="bg-card border-border shadow-xl flex items-center justify-center">
              <CardContent className="p-6 sm:p-8 flex items-center justify-center h-full">
                <div className="w-full max-w-xs mx-auto aspect-[9/19] rounded-[2.5rem] border border-border bg-gradient-to-b from-background to-muted flex flex-col overflow-hidden">
                  <div className="h-10 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    Пример диалога ИИ‑продавца
                  </div>
                  <div className="flex-1 px-3 py-4 space-y-2 text-[11px] leading-snug text-foreground">
                    <div className="bg-primary/10 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                      Клиент: «Добрый день! Интересует стоимость услуги и сроки внедрения».
                    </div>
                    <div className="bg-card rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ml-auto border border-primary/30">
                      ИИ‑продавец: «Здравствуйте! Подберу решение под ваш бизнес за 3 вопроса. Расскажите, в какой
                      сфере вы работаете и сколько обращений в месяц получаете?»
                    </div>
                    <div className="bg-card rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ml-auto border border-primary/30">
                      «После короткого аудита пришлю расчёт экономии и окупаемости за 12 месяцев».
                    </div>
                  </div>
                  <div className="h-10 bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    Работает 24/7, пока менеджеры спят
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Автоматизация продаж – мобильный слайдер */}
          <div className="md:hidden -mx-3 mb-8 sm:mb-12">
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-3 pb-4"
              style={{ scrollPaddingLeft: "0.75rem", scrollPaddingRight: "0.75rem" }}
            >
              {/* Слайд 1: описание продукта */}
              <Card className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card/90 border-border shadow-xl">
                <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-3 sm:space-y-4">
                    <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-primary font-semibold">
                      Автоматизация продаж
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-balance">
                      Автоматизация и&nbsp;увеличение продаж на&nbsp;30% с&nbsp;помощью ИИ‑продавца
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Умный чат‑бот на базе нейросети, который ведёт полноценные продающие диалоги с вашими лидами
                      24/7 во всех основных каналах: сайт, мессенджеры, соцсети.
                    </p>

                    <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Обрабатывает 100% входящих обращений за секунды, не теряя ни одного лида.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Отвечает на частые вопросы, презентует продукты и собирает данные для CRM.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="mt-1 text-primary">●</span>
                        <span>Передаёт «горячие» заявки менеджеру, фиксируя ключевые детали сделки.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      size="lg"
                      className="w-full text-sm sm:text-base"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Подробнее про ИИ‑продавца
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
                  <div className="w-full max-w-xs mx-auto aspect-[9/19] rounded-[2.5rem] border border-border bg-gradient-to-b from-background to-muted flex flex-col overflow-hidden">
                    <div className="h-10 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      Пример диалога ИИ‑продавца
                    </div>
                    <div className="flex-1 px-3 py-4 space-y-2 text-[11px] leading-snug text-foreground">
                      <div className="bg-primary/10 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                        Клиент: «Добрый день! Интересует стоимость услуги и сроки внедрения».
                      </div>
                      <div className="bg-card rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ml-auto border border-primary/30">
                        ИИ‑продавец: «Здравствуйте! Подберу решение под ваш бизнес за 3 вопроса. Расскажите, в какой
                        сфере вы работаете и сколько обращений в месяц получаете?»
                      </div>
                      <div className="bg-card rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ml-auto border border-primary/30">
                        «После короткого аудита пришлю расчёт экономии и окупаемости за 12 месяцев».
                      </div>
                    </div>
                    <div className="h-10 bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                      Работает 24/7, пока менеджеры спят
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Этапы внедрения ИИ в ваш бизнес
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Работаем по прозрачной пошаговой воронке: от глубокого аудита процессов до оптимизации и роста
              показателей после запуска.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
            <Card className="bg-card border-border shadow-md">
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

            <Card className="bg-card border-border shadow-md">
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

            <Card className="bg-card border-border shadow-md">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">3.</p>
                <h3 className="text-lg sm:text-2xl font-bold">Подготовка и запуск проекта</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Создаём и настраиваем ИИ‑решение под ваш сценарий: интегрируем с CRM, мессенджерами и телефонией,
                  тестируем на реальных диалогах.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-md">
              <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-primary text-3xl sm:text-4xl font-bold">4.</p>
                <h3 className="text-lg sm:text-2xl font-bold">Оптимизация процессов после запуска</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Сопровождаем вас первый месяц после запуска: дорабатываем сценарии, усиливаем конверсию, подключаем
                  дополнительные каналы и отчётность.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Slider */}
          <div className="lg:hidden relative mb-10 sm:mb-12">
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
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-secondary/30 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Примеры применения ИИ‑решений
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Показываем, как ИИ даёт измеримую выгоду в разных отраслях: от здравоохранения и логистики до
              digital‑маркетинга и юриспруденции.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            <Card className="bg-card border-dashed border-border">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold">Здравоохранение</h3>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold">Digital‑маркетинг</h3>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold">Юриспруденция</h3>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-dashed border-border">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold">Промышленность и логистика</h3>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
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
                  className="flex-shrink-0 w-[88vw] max-w-md snap-center bg-card border-dashed border-border"
                >
                  <CardContent className="p-5 sm:p-6 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-semibold">Ключевая проблема:</span> {item.problem}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-semibold">Решение:</span> {item.solution}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-semibold">Измеримая выгода:</span> {item.benefit}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Получить консультацию
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complex AI Implementation CTA – «Комплексное внедрение ИИ» */}
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-background">
        <div className="container mx-auto">
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
                className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-5"
                onClick={() => setIsModalOpen(true)}
              >
                Получить аудит бизнеса
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Pricing Section */}
      <Pricing onContactClick={() => setIsModalOpen(true)} />

      {/* About Us Section */}
      <section id="about" className="py-20 sm:py-32 px-3 sm:px-4">
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

                {/* Mobile: Аккордеон */}
                <div className="md:hidden w-full">
                  <Card
                    className="bg-card border-border cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setExpandedProductInfo(!expandedProductInfo)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold flex-1">О нашем продукте</h3>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                            expandedProductInfo ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedProductInfo ? "max-h-[3000px] opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                          <p>
                            Наш ИИ-агент и чат-бот — это не просто автоматизация. Это интеллектуальная автоматизация бизнеса с помощью нейросети. Создаём ИИ-помощника, который понимает контекст вашего бизнеса, знает ваши продукты и услуги, и способен вести диалог с клиентами на уровне опытного менеджера.
                          </p>
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
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Top Slogan */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-primary">ЛИЧНО КОНТРОЛИРУЮ</span>
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                КАЖДЫЙ ПРОЕКТ
              </h2>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Portrait - Mobile: centered, Desktop: left */}
              <div className="w-full md:order-1 flex justify-center md:justify-start">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-md md:max-w-none">
                  <img 
                    src="/images/founder-portrait.jpg" 
                    alt="Александр Лысов - Основатель NEURONIC LABS" 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Info Section - Mobile: below image, Desktop: right */}
              <div className="w-full md:order-2 space-y-6 sm:space-y-8">
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
                        Кандидат экономических наук
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-1">
                        Более 15 лет опыта работы в руководстве банка
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-1">
                        Автор курса по работе с нейросетями «Нейрогенез»
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
                    size="lg" 
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                    onClick={() => setIsModalOpen(true)}
                  >
                    КОНСУЛЬТАЦИЯ С АЛЕКСАНДРОМ
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonialsEnabled && <Testimonials />}

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section */}
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background">
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

      <Footer />

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

