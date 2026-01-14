import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { useMeta } from "@/hooks/useMeta"
import { createContactsMetaTags } from "@/lib/meta"
import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  CreditCard,
} from "lucide-react"

export default function ContactsPage() {
  const location = useLocation()
  useMeta(createContactsMetaTags())

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
    }
  }, [location.hash])

  const contacts = [
    {
      icon: Phone,
      title: "Телефон",
      values: [
        { label: "+7 993 079 91 77", href: "tel:+79930799177" },
        { label: "+7 905 009 91 77", href: "tel:+79050099177" }
      ]
    },
    {
      icon: Mail,
      title: "Email",
      values: [
        { label: "info@neuroniclabs.ru", href: "mailto:info@neuroniclabs.ru" },
        { label: "contact@neuroniclabs.ru", href: "mailto:contact@neuroniclabs.ru" }
      ]
    },
    {
      icon: Send,
      title: "Telegram",
      values: [
        { label: "Основатель", href: null },
        { label: "@aslysov", href: "https://t.me/aslysov", external: true },
        { label: "Канал агентства", href: null },
        { label: "@neuroniclabs", href: "https://t.me/neuroniclabs", external: true }
      ]
    },
    {
      icon: MapPin,
      title: "Офис",
      values: [
        { label: "Россия, Москва" }
      ]
    },
    {
      icon: Clock,
      title: "Режим работы",
      values: [
        { label: "Телефонная линия: ежедневно 10:00 - 22:00" },
        { label: "Поддержка в чате: 24/7" }
      ]
    }
  ]

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-primary">Контакты</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>
        </div>
      </section>

      {/* О компании */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-card/10 border-0">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">О NEURONIC LABS</h2>
                  <div className="space-y-4 text-lg">
                    <p>
                      <strong>NEURONIC LABS</strong> — агентство по внедрению нейро-продавцов и автоматизации бизнеса.
                    </p>
                    <p>
                      Мы создаем ИИ-агентов и чат-ботов для автоматизации бизнеса. Специализируемся на интеллектуальной автоматизации процессов, интеграции ИИ в работу, автоматизации рутинных задач, счетов и отчётов.
                    </p>
                    <p>
                      Наши решения помогают бизнесу увеличить конверсию в 2-3 раза, сократить фонд оплаты труда и обеспечить круглосуточную коммуникацию с клиентами через Telegram, WhatsApp, Avito и другие каналы.
                    </p>
                    <p>
                      Внедрение ИИ-решений занимает 7-14 дней без необходимости кодинга. Мы работаем с компаниями различных отраслей и помогаем им автоматизировать продажи, лидогенерацию и консультации.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Контакты */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Способы связи</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact, index) => {
              const Icon = contact.icon
              return (
                <Card key={index} className="bg-card/10 border-border hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-3">{contact.title}</h3>
                        <div className="space-y-2">
                          {contact.values.map((value, valueIndex) => {
                            const hasHref = 'href' in value && value.href !== null && value.href !== undefined
                            const isExternal = 'external' in value && value.external === true
                            return hasHref ? (
                              <a
                                key={valueIndex}
                                href={value.href as string}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="block text-primary hover:underline transition-colors"
                              >
                                {value.label}
                              </a>
                            ) : (
                              <p key={valueIndex} className="text-foreground/80">
                                {value.label}
                              </p>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Способы оплаты */}
      <section id="payment-methods" className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Способы оплаты</h2>
          <Card className="bg-card/10 border-0">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="space-y-4 text-lg">
                    <p>
                      <strong>Возможна поэтапная оплата</strong>
                    </p>
                    <p className="font-semibold mb-2">Доступные способы оплаты:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Безналичным переводом (для юридических лиц и ИП)</li>
                      <li>Кредитной, дебетовой или корпоративной картой**</li>
                      <li>СБП (Система Быстрых Платежей) (для физических лиц и организаций)</li>
                      <li>Отсрочка платежа** (для юридических лиц и ИП)</li>
                      <li>Рассрочка платежа** (для юридических лиц и ИП)</li>
                    </ul>
                    <p className="mt-4">
                      Наш официальный партнер - <strong>Т-Банк</strong> предоставляет программу целевого кредитования и рассрочки платежа до 36 месяцев, подробности уточняйте у менеджера
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-sm text-muted-foreground">
                      <p>* Стоимость работ указана с учётом действующих скидок</p>
                      <p>** При выборе данного способа оплаты скидки не предоставляются</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Форма обратной связи */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-card/10 border-border">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Напишите нам</h2>
                <p className="text-muted-foreground">
                  Оставьте заявку и мы свяжемся с вами в ближайшее время
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href="https://t.me/aslysov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Send className="h-5 w-5" />
                    Написать в Telegram
                  </a>
                  <a
                    href="tel:+79930799177"
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                  >
                    <Phone className="h-5 w-5" />
                    Позвонить
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </main>
  )
}

