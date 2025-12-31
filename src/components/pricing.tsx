import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star } from "lucide-react"

interface PricingProps {
  onContactClick: () => void
}

export function Pricing({ onContactClick }: PricingProps) {

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "15 000",
      period: "/мес",
      description: "Для малого бизнеса и старта",
      features: [
        "До 50 лидов/мес",
        "1 канал связи (Telegram или WhatsApp)",
        "Базовая настройка ИИ",
        "Email поддержка",
        "Базовая аналитика",
        "CRM интеграция"
      ],
      highlighted: false,
      badge: null
    },
    {
      id: "business",
      name: "Business",
      price: "30 000",
      period: "/мес",
      description: "Оптимальный выбор для роста",
      features: [
        "До 200 лидов/мес",
        "3 канала связи (Telegram, WhatsApp, Avito)",
        "Продвинутая настройка ИИ",
        "Приоритетная поддержка 24/7",
        "Расширенная аналитика + отчеты",
        "Множественные CRM интеграции",
        "Обучение команды",
        "Кастомизация под бизнес"
      ],
      highlighted: true,
      badge: "⭐ Популярный"
    },
    {
      id: "pro",
      name: "Enterprise",
      price: "50 000",
      period: "/мес",
      description: "Для крупного бизнеса",
      features: [
        "Безлимитные лиды",
        "Все каналы связи + кастомные",
        "ИИ с глубоким обучением",
        "Персональный менеджер",
        "Полная аналитика + BI интеграция",
        "API доступ",
        "Белый лейбл",
        "SLA 99.9%",
        "Индивидуальная разработка"
      ],
      highlighted: false,
      badge: null
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Тарифы и цены</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Выберите оптимальный план для вашего бизнеса. Все тарифы включают полную настройку и внедрение
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.highlighted
                  ? "border-primary border-2 shadow-2xl scale-105 bg-primary/5"
                  : "bg-card/50 hover:border-primary/50 transition-all"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {plan.badge}
                </div>
              )}
              
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                    <span className="text-xl text-muted-foreground">₽{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.highlighted ? "shadow-lg" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  onClick={onContactClick}
                >
                  {plan.highlighted ? "Начать сейчас" : "Связаться"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Не уверены, какой тариф выбрать? Закажите бесплатную консультацию
          </p>
          <Button variant="outline" size="lg" onClick={onContactClick}>
            Получить консультацию
          </Button>
        </div>
      </div>
    </section>
  )
}

