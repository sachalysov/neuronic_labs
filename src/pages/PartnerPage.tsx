import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DemoChat } from "@/components/demo-chat"
import { useMeta } from "@/hooks/useMeta"
import { createPartnerMetaTags } from "@/lib/meta"
import { useState } from "react"
import {
  DollarSign,
  CheckCircle,
  Users,
  Briefcase,
  ArrowRight,
  FileText,
  Zap,
  MessageCircle,
  Sparkles,
} from "lucide-react"

const PARTNER_FORM_URL = "https://forms.gle/WvPJUvesbsyx25xM8"

export default function PartnerPage() {
  useMeta(createPartnerMetaTags())
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false)

  const advantages = [
    {
      icon: DollarSign,
      title: "Высокий чек: клиенты платят 15K–300K ₽ за внедрение",
    },
    {
      icon: CheckCircle,
      title: "Полная прозрачность расчётов",
    },
    {
      icon: Zap,
      title: "Без операционной нагрузки — мы работаем с клиентом от начала до конца",
    },
    {
      icon: Briefcase,
      title: "Совмещается с основной деятельностью",
    },
    {
      icon: FileText,
      title: "Готовые материалы: скрипты, шаблоны, презентации, кейсы",
    },
    {
      icon: Users,
      title: "Персональный менеджер, обучающие вебинары, закрытое сообщество партнеров",
    },
  ]

  const targetAudience = [
    "Маркетинговые и SEO-агентства",
    "SMM-специалисты",
    "Коучи",
    "Образовательные проекты",
    "Разработчики сайтов",
    "Провайдеры CRM",
    "Влиятельные в бизнес-сообществах",
  ]

  const steps = [
    {
      number: "1",
      title: "Заполните анкету партнера",
    },
    {
      number: "2",
      title: "Получите доступ к материалам и сообществу",
    },
    {
      number: "3",
      title: "Рекомендуйте нас своим клиентам",
    },
    {
      number: "4",
      title: "Мы проводим презентацию, подписываем договор и внедряем решение",
    },
    {
      number: "5",
      title: "Получаете комиссию после оплаты клиента",
    },
  ]

  const payoutTable = [
    {
      tariff: "15 000 ₽",
      subscription: "5000 ₽+",
      salePercent: "17%",
      oneTime: "от 2 550 ₽",
      subscriptionPercent: "от 850 ₽",
      total3Months: "от 5 100 ₽",
    },
    {
      tariff: "30 000 ₽",
      subscription: "10 000 ₽+",
      salePercent: "18%",
      oneTime: "от 5 400 ₽",
      subscriptionPercent: "от 1 800 ₽",
      total3Months: "от 10 800 ₽",
    },
    {
      tariff: "60 000 ₽",
      subscription: "15 000 ₽+",
      salePercent: "19%",
      oneTime: "от 11 400 ₽",
      subscriptionPercent: "от 2 850 ₽",
      total3Months: "от 19 950 ₽",
    },
    {
      tariff: "100 000 ₽",
      subscription: "25 000 ₽+",
      salePercent: "20%",
      oneTime: "от 20 000 ₽",
      subscriptionPercent: "от 4 000 ₽",
      total3Months: "от 32 000 ₽",
    },
  ]

  const examples = [
    {
      clients: "3 клиента/месяц на тариф 30 000 ₽",
      calculation: "3 × 5 400 ₽ (внедрение) + 3 × 2 700 ₽ × 3 месяца (подписка)",
      result: "40 500 ₽",
    },
    {
      clients: "3 клиента/месяц на тариф 100 000 ₽",
      calculation: "3 × 20 000 ₽ + 3 × 5 000 ₽ × 3 месяца",
      result: "105 000 ₽",
    },
  ]

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-primary">Партнёрская программа</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
              Neuronic Labs — агентство по внедрению нейро-продавцов и автоматизации бизнеса
            </p>
            <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-lg inline-block">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                Привлекайте клиентов — получайте вознаграждение до 31 500 рублей за одного!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chat Section - Desktop */}
      <section className="hidden md:block py-28 sm:py-32 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance section-title">Попробуйте ИИ-продавца прямо сейчас</h2>
            <p className="text-xl text-muted-foreground">
              Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и
              закрывает возражения 24/7.
            </p>
          </div>

          <DemoChat 
            storagePrefix="partner-demo-chat" 
            linkButton1="Разработчик сайтов"
            linkButton2="SEO - специалист"
            linkButton1Webhook="https://n8n.asn1ght-ai.store/webhook/dd2626a2-1848-4bf8-bdbd-621cb1b3e273/chat"
            linkButton2Webhook="https://n8n.asn1ght-ai.store/webhook/7487af1d-e45e-4efa-ba7e-b99fd362b2f1/chat"
          />

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
          </p>
        </div>
      </section>

      {/* Demo Chat Section - Mobile with Button */}
      <section className="md:hidden py-28 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
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
            
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
            </p>
          </div>
        </div>
      </section>

      {/* Кратко о программе */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card/10 border-border">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Кратко о программе</h2>
              <div className="space-y-4 text-lg">
                <p>
                  <strong>Услуги:</strong>
                  <br />
                  Мы внедряем ИИ-решения для автоматизации (нейро-продавцы, чат-боты, обработка лидов).
                </p>
                <p>
                  <strong>Комиссия:</strong>
                  <br />
                  Партнеры рекомендуют нас своим клиентам и получают комиссию:{" "}
                  <span className="text-primary font-bold">5 400–31 500 ₽ за клиента</span> (разовое подключение + доход от подписки 3 месяца).
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Выплаты в течение 5 рабочих дней после оплаты клиента.</li>
                  <li>Минимум 1 клиент в месяц для сохранения статуса.</li>
                  <li>При 4+ клиентов/месяц — дополнительный бонус +5%.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Для кого */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Для кого</h2>
          <Card className="bg-card/10 border-border">
            <CardContent className="p-6 sm:p-8">
              <p className="text-lg mb-4">
                Специалисты и компании из сфер услуг, работающие с предпринимателями:
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                {targetAudience.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Преимущества</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon
              return (
                <Card key={index} className="bg-card/10 border-border hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">{advantage.title}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Как зарабатывать */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Как зарабатывать</h2>
          <div className="space-y-6">
            {examples.map((example, index) => (
              <Card key={index} className="bg-card/10 border-border">
                <CardContent className="p-6 sm:p-8">
                  <p className="text-lg font-semibold mb-3">{example.clients}</p>
                  <p className="text-muted-foreground mb-3">{example.calculation}</p>
                  <p className="text-2xl font-bold text-primary">= {example.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Как начать */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Как начать</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card/10 border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <p className="text-lg pt-1.5">{step.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              asChild
            >
              <a 
                href={PARTNER_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Стать партнером
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Условия выплат */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Условия выплат</h2>
          <Card className="bg-card/10 border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-sm">Тариф<br className="hidden sm:block" /> клиента | Подписка</th>
                      <th className="p-2 sm:p-4 text-center font-semibold text-xs sm:text-sm whitespace-nowrap">% Выплат<br className="hidden sm:block" /> за продажу</th>
                      <th className="p-2 sm:p-4 text-center font-semibold text-xs sm:text-sm">Единоразовая<br className="hidden sm:block" /> выплата</th>
                      <th className="p-2 sm:p-4 text-center font-semibold text-xs sm:text-sm">% С подписки<br className="hidden sm:block" /> (пассивный)</th>
                      <th className="p-2 sm:p-4 text-center font-semibold text-xs sm:text-sm whitespace-nowrap">Выплата<br className="hidden sm:block" /> за 3 мес</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutTable.map((row, index) => (
                      <tr key={index} className="border-b border-border hover:bg-secondary/20 transition-colors">
                        <td className="p-2 sm:p-4">
                          <div className="font-medium whitespace-nowrap">{row.tariff}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{row.subscription}</div>
                        </td>
                        <td className="p-2 sm:p-4 text-center font-medium whitespace-nowrap">{row.salePercent}</td>
                        <td className="p-2 sm:p-4 text-center font-medium text-primary whitespace-nowrap">{row.oneTime}</td>
                        <td className="p-2 sm:p-4 text-center font-medium text-primary whitespace-nowrap">{row.subscriptionPercent}</td>
                        <td className="p-2 sm:p-4 text-center font-bold text-primary text-base sm:text-lg whitespace-nowrap">{row.total3Months}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Условия */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Условия</h2>
          <Card className="bg-card/10 border-border">
            <CardContent className="p-6 sm:p-8">
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Выплаты на счёт ИП, самозанятого или ФЛ по договору ГПХ.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Партнёрство регулируется договором-офертой.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Готовы начать зарабатывать?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Присоединяйтесь к партнёрской программе и получайте стабильный доход от рекомендаций
          </p>
          <Button 
            size="lg" 
            asChild
          >
            <a 
              href={PARTNER_FORM_URL} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Стать партнером
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />

      <ChatWidget />

      {/* Mobile Demo Chat Modal */}
      {isDemoChatOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col h-screen">
          {/* Demo Chat Content - Full Screen */}
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <DemoChat 
              onClose={() => setIsDemoChatOpen(false)} 
              isMobile={true} 
              storagePrefix="partner-demo-chat"
              linkButton1="Разработчик сайтов"
              linkButton2="SEO - специалист"
              linkButton1Webhook="https://n8n.asn1ght-ai.store/webhook/dd2626a2-1848-4bf8-bdbd-621cb1b3e273/chat"
              linkButton2Webhook="https://n8n.asn1ght-ai.store/webhook/7487af1d-e45e-4efa-ba7e-b99fd362b2f1/chat"
            />
          </div>
        </div>
      )}
    </main>
  )
}

