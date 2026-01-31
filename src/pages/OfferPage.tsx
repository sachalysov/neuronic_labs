import { useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { Footer } from "@/components/footer"
import { useMeta } from "@/hooks/useMeta"
import { createOfferMetaTags } from "@/lib/meta"
import { FileText, Shield, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function OfferPage() {
  const location = useLocation()
  useMeta(createOfferMetaTags())

  useEffect(() => {
    const hash = location.hash.substring(1)
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        setTimeout(() => {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({ top: offsetPosition, behavior: "auto" })
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname)
          }, 100)
        }, 50)
      } else {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [location.hash])

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pb-0 pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 pt-3 pb-0 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-6">
              <span className="text-primary">Публичная оферта</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
              Условия предоставления услуг
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* Общие положения */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">1. Общие положения</h2>
                <p className="mb-4">
                  Настоящий документ является официальным предложением (публичной офертой) NEURONIC LABS 
                  (далее — Исполнитель) заключить договор на оказание услуг на условиях, изложенных ниже.
                </p>
                <p className="mb-4">
                  Акцептом оферты является оплата услуг Заказчиком или иные действия, подтверждающие 
                  согласие с условиями (отправка заявки, подписание договора). Согласие с условиями оферты 
                  означает заключение договора на условиях, изложенных в настоящем документе.
                </p>
              </CardContent>
            </Card>

            {/* Описание услуг */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">2. Описание услуг</h2>
                <p className="mb-4">
                  Исполнитель оказывает следующие виды услуг:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Внедрение ИИ-продавцов и нейро-продавцов для бизнеса</li>
                  <li>Разработка и настройка чат-ботов и ИИ-агентов</li>
                  <li>Автоматизация бизнес-процессов с использованием ИИ</li>
                  <li>Консультации по внедрению ИИ-решений</li>
                  <li>Обучение и поддержка клиентов</li>
                  <li>Иные услуги в рамках компетенции Исполнителя</li>
                </ul>
              </CardContent>
            </Card>

            {/* Условия оплаты */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">3. Условия оплаты</h2>
                <p className="mb-4">
                  Оплата услуг осуществляется в соответствии с условиями, согласованными сторонами 
                  в индивидуальном порядке (в договоре, коммерческом предложении или счёте).
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Способы оплаты: банковский перевод, безналичный расчёт</li>
                  <li>Срок оплаты: в соответствии с выставленным счётом или договором</li>
                  <li>Исполнитель вправе требовать предоплату в размере до 100% стоимости услуг</li>
                </ul>
              </CardContent>
            </Card>

            {/* Ответственность сторон */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">4. Ответственность сторон</h2>
                <p className="mb-4">
                  Стороны несут ответственность за неисполнение или ненадлежащее исполнение обязательств 
                  в соответствии с законодательством Российской Федерации.
                </p>
                <p className="mb-4">
                  Исполнитель не несёт ответственности за косвенные убытки, упущенную выгоду Заказчика 
                  и иные последствия, не находящиеся в прямой причинной связи с оказанием услуг.
                </p>
              </CardContent>
            </Card>

            {/* Возврат и отмена */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">5. Возврат средств и отмена услуг</h2>
                <p className="mb-4">
                  Возврат денежных средств осуществляется в соответствии с условиями договора 
                  и действующим законодательством РФ.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>При отказе Заказчика до начала оказания услуг — возврат в полном объёме (за вычетом фактических расходов при наличии)</li>
                  <li>При отказе в процессе оказания услуг — пропорционально объёму невыполненных работ</li>
                  <li>Запрос на возврат направляется на email:{" "}
                    <a href="mailto:neuroniclabs@yandex.ru" className="text-primary hover:underline">
                      neuroniclabs@yandex.ru
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Правила использования контента */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      6. Правила использования контента
                    </h2>
                    <p className="mb-4">
                      Все материалы сайта (тексты, изображения, логотипы, дизайн, программный код) 
                      являются объектами интеллектуальной собственности NEURONIC LABS и охраняются 
                      законодательством РФ об авторских правах.
                    </p>
                    <ul className="space-y-2 list-disc list-inside mb-4">
                      <li>Использование материалов возможно только с письменного разрешения правообладателя</li>
                      <li>При цитировании обязательна ссылка на источник и указание авторства</li>
                      <li>Запрещается копирование, распространение и модификация материалов без согласия</li>
                    </ul>
                    <p>
                      По вопросам использования контента обращайтесь:{" "}
                      <a href="mailto:neuroniclabs@yandex.ru" className="text-primary hover:underline">
                        neuroniclabs@yandex.ru
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Контакты */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">7. Контакты</h2>
                    <p className="mb-4">
                      По всем вопросам, связанным с условиями оферты:
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:neuroniclabs@yandex.ru" className="text-primary hover:underline">
                        neuroniclabs@yandex.ru
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Контакты для связи указаны в разделе{" "}
                      <Link to="/contacts" className="text-primary hover:underline">Контакты</Link>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer info */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Дата последнего обновления:</strong>{" "}
                    {new Date().toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
