import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Checkbox } from "@/components/ui/checkbox"
import { StickyHeader } from "@/components/sticky-header"
import { ConsultationModal } from "@/components/consultation-modal"
import { SliderPagination } from "@/components/slider-pagination"
import { submitFormData } from "@/services/form"
import { useEffect, useState, useRef, lazy, Suspense, useMemo, useCallback } from "react"
import { useMeta } from "@/hooks/useMeta"
import { createChatBotMetaTags } from "@/lib/meta"
import { addSchemaToHead, generateBreadcrumbList } from "@/lib/schema-org"
import { validatePhone, validateName, CIS_COUNTRIES, type Country } from "@/lib/phone-validation"
import {
  Bot,
  Zap,
  TrendingUp,
  ArrowRight,
  Target,
  Send,
  CheckCircle,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Monitor,
  Users,
  Clock,
  ShieldCheck,
  BarChart3,
  Scale,
} from "lucide-react"

const SpaceDust = lazy(() => import("@/components/space-dust").then((module) => ({ default: module.SpaceDust })))
const DemoChat = lazy(() => import("@/components/demo-chat").then((module) => ({ default: module.DemoChat })))
const Footer = lazy(() => import("@/components/footer").then((module) => ({ default: module.Footer })))
const ChatWidget = lazy(() => import("@/components/chat-widget").then((module) => ({ default: module.ChatWidget })))
import { AnimateOnScroll, StaggerChildren } from "@/components/animate-on-scroll"

const chatBotFaqData = [
  {
    question: "Чем ИИ чат-бот отличается от обычного кнопочного бота?",
    answer: "ИИ-продавец обучен на ваших скриптах продаж, понимает контекст диалога, отрабатывает возражения и ведёт клиента к сделке. Обычный кнопочный бот — это фиксированные сценарии без гибкости. Наш бот понимает свободный текст, адаптируется под ход разговора и ведёт себя как живой менеджер."
  },
  {
    question: "В каких мессенджерах работает бот?",
    answer: "WhatsApp, Telegram, VK, Viber, Instagram Direct, виджет на сайте, Avito и другие платформы. Бот подключается к любому текстовому каналу через API или вебхук. Можем настроить интеграцию с любой площадкой."
  },
  {
    question: "Сколько времени занимает внедрение?",
    answer: "Полный цикл от обучения до запуска — 7-14 дней. Обучение на ваших данных — 3-5 дней, настройка и тестирование — 2-5 дней, интеграция с CRM — 1 день. Для сложных проектов срок может увеличиться до 3 недель."
  },
  {
    question: "Бот заменит моих менеджеров полностью?",
    answer: "Бот отлично справляется с первичной обработкой, квалификацией лидов, ответами на типовые вопросы и дожимом до заявки. Для сложных сделок и VIP-клиентов рекомендуем передавать диалог живому менеджеру. Бот фильтрует поток и передаёт только горячие лиды."
  },
  {
    question: "Как бот обучается на моём продукте?",
    answer: "Мы загружаем в бота ваши прайсы, FAQ, скрипты продаж, базу знаний и примеры диалогов. Бот изучает специфику продукта и типичные вопросы клиентов. В процессе работы система дообучается на реальных диалогах и становится точнее."
  },
  {
    question: "Что если клиент задаст вопрос не по теме?",
    answer: "Бот корректно возвращает диалог к теме вашего продукта. Если вопрос выходит за рамки компетенции, бот честно сообщит об этом и предложит связаться с менеджером. Все нераспознанные вопросы фиксируются для дообучения."
  },
  {
    question: "Можно ли интегрировать бота с нашей CRM?",
    answer: "Да, интегрируемся со всеми популярными CRM: amoCRM, Bitrix24, Salesforce, HubSpot и другими. Все диалоги, заявки и квалификация автоматически попадают в вашу систему с полной историей переписки."
  },
  {
    question: "Какие гарантии результата?",
    answer: "Мы гарантируем увеличение скорости обработки лидов в 10+ раз. По статистике клиентов, конверсия увеличивается на 30-200%. Если через месяц работы вы не увидите результатов, доработаем систему бесплатно."
  }
]

export default function ChatBotLandingPage() {
  useMeta(createChatBotMetaTags())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(CIS_COUNTRIES[0])
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({})
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0)
  const [faqShowAll, setFaqShowAll] = useState(false)

  const scenariosScrollRef = useRef<HTMLDivElement>(null)
  const stepsScrollRef = useRef<HTMLDivElement>(null)
  const chatExamplesScrollRef = useRef<HTMLDivElement>(null)

  // Schema.org structured data
  useEffect(() => {
    const softwareAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ИИ-Продавец Чат-Бот',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, WhatsApp, Telegram, VK, Viber',
      description: 'ИИ чат-бот для автоматизации продаж в мессенджерах и на сайте. Консультирует, продаёт, квалифицирует лиды 24/7.',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'RUB'
      },
      provider: {
        '@type': 'Organization',
        name: 'NEURONIC LABS',
        url: 'https://neuroniclabs.ru'
      }
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: chatBotFaqData.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    }

    const breadcrumbs = generateBreadcrumbList([
      { name: 'Главная', url: '/' },
      { name: 'ИИ-Продавец Чат-Бот', url: '/chatbot' }
    ])

    addSchemaToHead(softwareAppSchema, 'schema-chatbot-app')
    addSchemaToHead(faqSchema, 'schema-chatbot-faq')
    addSchemaToHead(breadcrumbs, 'schema-chatbot-breadcrumbs')

    return () => {
      document.getElementById('schema-chatbot-app')?.remove()
      document.getElementById('schema-chatbot-faq')?.remove()
      document.getElementById('schema-chatbot-breadcrumbs')?.remove()
    }
  }, [])

  // Lock scroll when mobile demo chat is open
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.innerWidth < 768

    if (isDemoChatOpen && isMobile) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isDemoChatOpen])

  const benefitsData = useMemo(() => [
    { icon: Zap, text: "Отвечает за 2 секунды" },
    { icon: MessageCircle, text: "Работает в любых мессенджерах" },
    { icon: TrendingUp, text: "Увеличивает конверсию в 2-3 раза" },
  ], [])

  const functionsData = useMemo(() => [
    { icon: MessageCircle, title: "Консультировать", description: "Отвечает на любые вопросы по продукту и услугам" },
    { icon: Target, title: "Продавать", description: "Ведёт диалог по скрипту продаж до закрытия сделки" },
    { icon: Sparkles, title: "Квалифицировать", description: "Собирает данные, определяет горячность лида" },
    { icon: ArrowRight, title: "Возвращать", description: "Дожимает незавершённые диалоги, отправляет follow-up" },
  ], [])

  const scenariosData = useMemo(() => [
    {
      icon: Bot,
      title: "Продавец-консультант",
      description: "Ведёт клиента от первого сообщения до оплаты. Презентует продукт, отрабатывает возражения, закрывает сделку."
    },
    {
      icon: Target,
      title: "Квалификатор лидов",
      description: "Массово обрабатывает входящие заявки, определяет горячих клиентов и передаёт их менеджерам."
    },
    {
      icon: Sparkles,
      title: "Реаниматор базы",
      description: "Пишет по старой базе, возвращает ушедших клиентов, предлагает персональные спецусловия."
    },
  ], [])

  const humanFactorData = useMemo(() => [
    { icon: Clock, text: "Обработка 100% обращений мгновенно, в любых каналах" },
    { icon: ShieldCheck, text: "Без больничных, выходных и перепадов настроения 24/7" },
    { icon: Users, text: "Без кадровой текучки и постоянного обучения новичков" },
    { icon: Monitor, text: "Единый стандарт общения — каждый клиент получает идеальный скрипт" },
    { icon: Scale, text: "Масштабирование без найма — 1 бот = 50 менеджеров" },
    { icon: BarChart3, text: "Полная аналитика каждого диалога в CRM" },
  ], [])

  const stepsData = useMemo(() => [
    {
      label: "Этап 1",
      title: "Фаза «обучение продукту»",
      description: "Собираем данные о продукте, прайсы, FAQ, скрипты. Формируем базу знаний бота."
    },
    {
      label: "Этап 2",
      title: "Фаза «песочница»",
      description: "Настраиваем бота, тестируем на реальных сценариях, проводим пробные диалоги."
    },
    {
      label: "Этап 3",
      title: "Фаза «выход в эфир»",
      description: "Запускаем на реальных клиентах, фиксируем метрики, переходим в рабочий режим."
    },
  ], [])

  const chatExamples = useMemo(() => [
    {
      title: "Консультация по продукту",
      messages: [
        { from: "client", text: "Здравствуйте, сколько стоит базовый тариф?" },
        { from: "bot", text: "Добрый день! Базовый тариф —  25 000 ₽/мес. Включает подключение к 1 каналу продаж. Какой у вас бизнес? Подберу оптимальный вариант." },
        { from: "client", text: "Интернет-магазин одежды" },
        { from: "bot", text: "Для интернет-магазина рекомендую тариф Business — он включает интеграцию с вашим каталогом и автоматические рекомендации. Показать подробнее?" },
      ]
    },
    {
      title: "Отработка возражения «дорого»",
      messages: [
        { from: "client", text: "Это слишком дорого" },
        { from: "bot", text: "Один менеджер обходится в 80-120 тыс./мес с налогами. Бот заменяет 3-5 менеджеров на первой линии. Экономия — от 200 тыс./мес. Окупаемость за первый же месяц. Думаю выгода очевидна" },
        { from: "client", text: "Хм, а если не сработает?" },
        { from: "bot", text: "Мы даём гарантию результата. Если за месяц конверсия не вырастет — доработаем бесплатно. Могу записать вас на бесплатную демо-экскурсию — увидите всё изнутри." },
      ]
    },
    {
      title: "Дожим до заявки",
      messages: [
        { from: "client", text: "Я подумаю и напишу позже" },
        { from: "bot", text: "Конечно! Кстати, до конца недели действует спецпредложение — бесплатный аудит ваших процессов на 50 000₽. Могу забронировать для вас слот?" },
        { from: "client", text: "А что входит в аудит?" },
        { from: "bot", text: "Полный анализ ваших каналов продаж, скриптов и воронки + стратегия автоматизации. Займёт 30 минут. Какое время удобно — завтра утром или после обеда?" },
      ]
    },
  ], [])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (value) {
      const validation = validateName(value)
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, name: validation.error }))
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.name; return n })
      }
    } else {
      setErrors(prev => { const n = { ...prev }; delete n.name; return n })
    }
  }, [])

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value)
    if (value && value !== selectedCountry.dialCode) {
      const validation = validatePhone(value, selectedCountry)
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, phone: validation.error }))
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.phone; return n })
      }
    } else {
      setErrors(prev => { const n = { ...prev }; delete n.phone; return n })
    }
  }, [selectedCountry])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const nameValidation = validateName(name)
    const phoneValidation = validatePhone(phone, selectedCountry)
    const newErrors: typeof errors = {}
    if (!nameValidation.valid) newErrors.name = nameValidation.error
    if (!phoneValidation.valid) newErrors.phone = phoneValidation.error
    if (!consentAccepted) newErrors.consent = "Необходимо согласие на обработку персональных данных"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await submitFormData({ name, phone, email: '', username: '', comment: '[chatbot-landing]' })
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setName("")
        setPhone("")
        setConsentAccepted(false)
        setErrors({})
        setSelectedCountry(CIS_COUNTRIES[0])
      }, 5000)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не удалось отправить форму. Пожалуйста, попробуйте позже.")
    }
  }, [name, phone, consentAccepted, selectedCountry])

  const faqVisibleItems = chatBotFaqData.slice(0, 4)
  const faqHiddenItems = chatBotFaqData.slice(4)

  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <SpaceDust />
      </Suspense>
      <StickyHeader onOpenDemoChat={() => setIsDemoChatOpen(true)} />

      {/* ======================== 1. HERO ======================== */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background" aria-labelledby="hero-heading">
        <div className="container mx-auto px-4 pt-16 pb-12 md:pb-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <AnimateOnScroll animation="fade-down" duration={500} delay={200}>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {benefitsData.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <div key={i} className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">{b.text}</span>
                    </div>
                  )
                })}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" duration={700} delay={400}>
              <h1 id="hero-heading" className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                ИИ-Продавец для вашего бизнеса.<br />
                <span className="text-primary">Чат-Бот, который продаёт 24/7</span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" duration={700} delay={600}>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Автоматизируйте продажи в мессенджерах и на сайте. Бот отвечает мгновенно, квалифицирует лиды и доводит до сделки — без участия менеджера.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" duration={700} delay={800}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="btn-shine text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsDemoChatOpen(true)
                    } else {
                      document.getElementById('demo-chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Попробовать демо
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 hover:scale-105 transition-transform w-full sm:w-auto"
                  onClick={() => setIsModalOpen(true)}
                >
                  Записаться на экскурсию
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" duration={500} delay={1000}>
              <p className="text-sm text-muted-foreground">
                Покажем бота в действии, расскажем про кейсы и рассчитаем стоимость внедрения
              </p>
            </AnimateOnScroll>

            <div className="md:hidden flex flex-col items-center mt-4 gap-1 text-muted-foreground/80">
              <span className="text-xs tracking-wide uppercase">Листайте ниже</span>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== 2. HOW IT WORKS ======================== */}
      <section id="how-it-works" className="py-20 sm:py-32 px-3 sm:px-4" aria-labelledby="how-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="how-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Обработка заявок и продажи через <span className="italic text-primary">текстовые каналы</span>
            </h2>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <AnimateOnScroll animation="fade-right" duration={700}>
              <div className="space-y-8 sm:space-y-10">
                {[
                  { num: "01", text: "Бот мгновенно отвечает клиенту в любом канале — сайт, MAX, Telegram, VK" },
                  { num: "02", text: "Выявляет потребности, презентует продукт, отрабатывает возражения по скриптам" },
                  { num: "03", text: "Квалифицирует лид и передаёт горячего клиента менеджеру или оформляет заявку вместе с оплатой" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 items-start">
                    <span className="text-4xl sm:text-5xl font-bold text-primary/20 leading-none flex-shrink-0">{step.num}/</span>
                    <p className="text-base sm:text-lg text-foreground leading-relaxed pt-1">{step.text}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left" duration={700} delay={200}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-5 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-6">Функции ИИ-Продавца:</h3>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {functionsData.map((func, i) => {
                      const Icon = func.icon
                      return (
                        <div key={i} className="space-y-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <h4 className="font-bold text-sm sm:text-base">{func.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{func.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ======================== 3. CRM INTEGRATION ======================== */}
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background" aria-labelledby="crm-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="crm-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Не ломаем ваши процессы, <span className="italic text-primary">а совершенствуем их</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Бот работает внутри вашей CRM-системы как штатный сотрудник, но соблюдает все регламенты и скрипты, <strong>в отличие от ваших сотрудников</strong>
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="scale-in" duration={700}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-4xl mx-auto">
              <CardContent className="p-6 sm:p-10">
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold">Встраивается за 1 день</h3>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground">
                      {[
                        "Все диалоги автоматически в CRM",
                        "Заявки с тегами и квалификацией",
                        "История переписки к карточке клиента",
                        "Уведомления менеджерам о горячих лидах",
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold">Поддерживаемые платформы</h3>
                    <div className="flex flex-wrap gap-2">
                      {["WhatsApp", "Telegram", "VK", "Viber", "Сайт-виджет", "Bitrix24", "amoCRM", "Instagram"].map((platform) => (
                        <span key={platform} className="bg-secondary rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ======================== 4. LIVE DIALOG EXAMPLES ======================== */}
      <section className="py-20 sm:py-32 px-3 sm:px-4" aria-labelledby="dialog-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="dialog-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Общается как <span className="italic text-primary">живой продавец</span>, а не как тупой бот
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              В среднем лишь 3 человека из 100 понимают, что общаются с ботом
            </p>
          </AnimateOnScroll>

          {/* Desktop grid */}
          <StaggerChildren staggerDelay={120} animation="fade-up" className="hidden md:grid md:grid-cols-3 gap-6">
            {chatExamples.map((example, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur-sm border-border/50 card-hover-lift">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="font-bold text-sm sm:text-base mb-4 text-primary">{example.title}</h3>
                  <div className="space-y-3">
                    {example.messages.map((msg, j) => (
                      <div key={j} className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`rounded-xl px-3 py-2 text-xs sm:text-sm max-w-[85%] ${
                          msg.from === 'client' ? 'bg-secondary text-foreground' : 'bg-primary/10 text-foreground'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </StaggerChildren>

          {/* Mobile slider */}
          <div className="md:hidden relative">
            <div
              ref={chatExamplesScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{ scrollPaddingLeft: '0.5rem', scrollPaddingRight: '0.5rem' }}
            >
              {chatExamples.map((example, i) => (
                <Card key={i} className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-4 text-primary">{example.title}</h3>
                    <div className="space-y-3">
                      {example.messages.map((msg, j) => (
                        <div key={j} className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`rounded-xl px-3 py-2 text-xs max-w-[85%] ${
                            msg.from === 'client' ? 'bg-secondary text-foreground' : 'bg-primary/10 text-foreground'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SliderPagination containerRef={chatExamplesScrollRef} itemCount={chatExamples.length} />
          </div>
        </div>
      </section>

      {/* ======================== 5. DEMO CHAT ======================== */}
      <section id="demo-chat" className="hidden md:block py-20 sm:py-32 px-4 bg-gradient-to-b from-secondary/20 to-background" aria-labelledby="demo-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="max-w-4xl mx-auto text-center space-y-4 mb-12">
            <h2 id="demo-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance section-title">
              Напишите нашему боту и <span className="italic text-primary">оцените качество диалога</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Это не ChatGPT — это обученный продавец, который знает продукт, следует скриптам и не отклоняется от темы
            </p>
          </AnimateOnScroll>

          <Suspense fallback={null}>
            <DemoChat />
          </Suspense>

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
          </p>
          <div className="text-center mt-6">
            <Button size="lg" className="gap-2" onClick={() => setIsModalOpen(true)}>
              Записаться на экскурсию
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Demo Chat Button */}
      <section className="md:hidden py-20 sm:py-28 px-4 sm:px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
        <div className="container mx-auto relative">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Bot className="h-3.5 w-3.5" />
              Живая демонстрация
            </div>
            <h2 className="text-[26px] sm:text-3xl font-bold text-balance section-title leading-tight">
              Напишите боту и оцените качество
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Это не ChatGPT — это обученный продавец, который знает продукт и следует скриптам
            </p>
            <Button
              onClick={() => setIsDemoChatOpen(true)}
              className="h-14 px-8 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-3 text-[15px] font-semibold mx-auto"
              size="lg"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              Протестировать ИИ-бот
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ======================== 6. SCENARIOS ======================== */}
      <section className="py-20 sm:py-32 px-3 sm:px-4" aria-labelledby="scenarios-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="scenarios-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Сценарии использования <span className="italic text-primary">под любые задачи</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Идеально подходит для бизнесов, где важно не упустить ни одного клиента
            </p>
          </AnimateOnScroll>

          {/* Desktop */}
          <StaggerChildren staggerDelay={120} animation="fade-up" className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {scenariosData.map((scenario, i) => {
              const Icon = scenario.icon
              return (
                <Card key={i} className="bg-card/10 border-border hover:border-primary card-hover-lift gradient-border-animated">
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center icon-hover-glow">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">{scenario.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{scenario.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </StaggerChildren>

          {/* Mobile */}
          <div className="md:hidden relative">
            <div
              ref={scenariosScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{ scrollPaddingLeft: '0.5rem', scrollPaddingRight: '0.5rem' }}
            >
              {scenariosData.map((scenario, i) => {
                const Icon = scenario.icon
                return (
                  <Card key={i} className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/10 border-border">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{scenario.title}</h3>
                      <p className="text-muted-foreground">{scenario.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <SliderPagination containerRef={scenariosScrollRef} itemCount={scenariosData.length} />
          </div>
        </div>
      </section>

      {/* ======================== 7. HUMAN FACTOR ======================== */}
      <section className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background" aria-labelledby="factor-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="factor-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Уберите <span className="italic text-primary">человеческий фактор</span> из ваших продаж
            </h2>
          </AnimateOnScroll>

          <StaggerChildren staggerDelay={80} animation="fade-up" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {humanFactorData.map((item, i) => {
              const Icon = item.icon
              return (
                <Card key={i} className="bg-card/80 backdrop-blur-sm border-border/50 card-hover-lift">
                  <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium pt-1.5">{item.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </StaggerChildren>

          <AnimateOnScroll animation="scale-in" duration={700} className="mt-10 sm:mt-16">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 max-w-3xl mx-auto">
              <CardContent className="p-6 sm:p-8 text-center space-y-4">
                <p className="text-base sm:text-lg text-foreground font-medium">
                  Узнайте, как ваш бизнес может сократить расходы и увеличить продажи с помощью ИИ-чат-бота
                </p>
                <Button size="lg" className="btn-shine" onClick={() => setIsModalOpen(true)}>
                  Записаться на экскурсию
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ======================== 8. IMPLEMENTATION STEPS ======================== */}
      <section className="py-20 sm:py-32 px-3 sm:px-4" aria-labelledby="steps-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center mb-10 sm:mb-16">
            <h2 id="steps-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">
              Подключаем, обучаем, запускаем <span className="italic text-primary">и отвечаем за результат</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              Простое подключение в 3 этапа:
            </p>
          </AnimateOnScroll>

          {/* Desktop timeline */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <AnimateOnScroll animation="fade-up" duration={700}>
              <div className="flex items-center justify-between mb-8">
                {stepsData.map((_, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                    </div>
                    {i < stepsData.length - 1 && (
                      <div className="flex-1 h-0.5 bg-border mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <StaggerChildren staggerDelay={150} animation="fade-up" className="grid grid-cols-3 gap-6">
              {stepsData.map((step, i) => (
                <Card key={i} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 space-y-3">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {step.label}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>

          {/* Mobile slider */}
          <div className="md:hidden relative">
            <div
              ref={stepsScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
              style={{ scrollPaddingLeft: '0.5rem', scrollPaddingRight: '0.5rem' }}
            >
              {stepsData.map((step, i) => (
                <Card key={i} className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 space-y-3">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {step.label}
                    </span>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SliderPagination containerRef={stepsScrollRef} itemCount={stepsData.length} />
          </div>
        </div>
      </section>

      {/* ======================== 9. FAQ ======================== */}
      <section id="faq" className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-secondary/20 to-background" aria-labelledby="faq-heading">
        <div className="container mx-auto">
          <AnimateOnScroll animation="fade-up" duration={700} className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 md:mb-16">
            <h2 id="faq-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Частые вопросы</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Ответы на популярные вопросы о внедрении ИИ чат-бота для продаж
            </p>
          </AnimateOnScroll>

          <StaggerChildren staggerDelay={80} animation="fade-up" className="max-w-4xl mx-auto space-y-3">
            {faqVisibleItems.map((item, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setFaqOpenIndex(faqOpenIndex === index ? null : index)}
              >
                <CardContent className={`transition-all duration-300 ${
                  faqOpenIndex === index ? "py-3 px-3 sm:py-4 sm:px-6" : "py-3 px-3 sm:py-4 sm:px-4 md:py-0 md:px-4"
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold flex-1 leading-tight">{item.question}</h3>
                    <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 transition-transform duration-300 ${
                      faqOpenIndex === index ? "rotate-180" : ""
                    }`} />
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    faqOpenIndex === index ? "max-h-96 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0"
                  }`}>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {faqShowAll && faqHiddenItems.map((item, index) => {
              const actualIndex = 4 + index
              return (
                <Card
                  key={actualIndex}
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setFaqOpenIndex(faqOpenIndex === actualIndex ? null : actualIndex)}
                >
                  <CardContent className={`transition-all duration-300 ${
                    faqOpenIndex === actualIndex ? "py-3 px-3 sm:py-4 sm:px-6" : "py-3 px-3 sm:py-4 sm:px-4 md:py-0 md:px-4"
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base md:text-xl font-bold flex-1 leading-tight">{item.question}</h3>
                      <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 transition-transform duration-300 ${
                        faqOpenIndex === actualIndex ? "rotate-180" : ""
                      }`} />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      faqOpenIndex === actualIndex ? "max-h-96 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0"
                    }`}>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {!faqShowAll && faqHiddenItems.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setFaqShowAll(true)}>
                  <span>Показать все</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}

            {faqShowAll && faqHiddenItems.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                  setFaqShowAll(false)
                  if (faqOpenIndex !== null && faqOpenIndex >= 4) setFaqOpenIndex(null)
                }}>
                  <span>Скрыть</span>
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
          </StaggerChildren>
        </div>
      </section>

      {/* ======================== 10. CONTACT FORM ======================== */}
      <section id="contact" className="py-20 sm:py-32 px-3 sm:px-4" aria-labelledby="contact-heading">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
            <AnimateOnScroll animation="fade-right" duration={700}>
              <div className="space-y-4 sm:space-y-6">
                <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Ответим на все <span className="italic text-primary">ваши вопросы</span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  А также покажем, как вся система устроена «под капотом», чтобы у вас было чёткое понимание, какую выгоду вы получите от внедрения
                </p>
                <div className="space-y-3">
                  {[
                    "Покажем реальные кейсы в вашей нише",
                    "Рассчитаем стоимость внедрения",
                    "Проведём бесплатный аудит текущих процессов",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left" duration={700} delay={200}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="chatbot-name" className="text-xs sm:text-sm font-medium text-foreground">Имя</label>
                        <Input
                          id="chatbot-name"
                          type="text"
                          placeholder="Иван"
                          value={name}
                          onChange={handleNameChange}
                          required
                          className={`bg-background border-border ${errors.name ? 'border-destructive' : ''}`}
                          aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="chatbot-phone" className="text-xs sm:text-sm font-medium text-foreground">Номер телефона</label>
                        <PhoneInput
                          value={phone}
                          onChange={handlePhoneChange}
                          onCountryChange={setSelectedCountry}
                          placeholder=" (___) ___-__-__"
                          required
                          error={errors.phone}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="chatbot-consent"
                            checked={consentAccepted}
                            onCheckedChange={(checked) => {
                              setConsentAccepted(checked === true)
                              if (checked) {
                                setErrors(prev => { const n = { ...prev }; delete n.consent; return n })
                              }
                            }}
                            className="mt-1"
                          />
                          <label htmlFor="chatbot-consent" className="text-xs sm:text-sm text-foreground cursor-pointer leading-relaxed">
                            Я согласен(а) на обработку персональных данных в соответствии с{" "}
                            <a href="/politika-konfidentsialnosti" className="text-primary hover:underline">Политикой конфиденциальности</a> *
                          </label>
                        </div>
                        {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full btn-shine text-sm sm:text-lg py-4 sm:py-6"
                        disabled={!consentAccepted}
                      >
                        Записаться на экскурсию
                        <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Отправляя форму, вы подтверждаете согласие с{" "}
                        <a href="/politika-konfidentsialnosti" className="text-primary hover:underline">Политикой конфиденциальности</a>{" "}
                        и обработкой персональных данных.
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
                      <p className="text-muted-foreground">Наш менеджер свяжется с вами в течение 15 минут</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>

      {/* Mobile Demo Chat Modal */}
      {isDemoChatOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col h-screen">
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <Suspense fallback={null}>
              <DemoChat onClose={() => setIsDemoChatOpen(false)} isMobile={true} />
            </Suspense>
          </div>
        </div>
      )}

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
