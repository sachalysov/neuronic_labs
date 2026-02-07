import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { AnimateOnScroll, StaggerChildren } from "@/components/animate-on-scroll"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Как быстро можно внедрить ИИ-продавца?",
    answer: "Базовое внедрение занимает ≈7-14 дней. Это включает анализ вашего бизнеса, настройку ИИ, обучение на ваших данных, интеграцию с системами и тестирование. Для сложных проектов срок может увеличиться до 3-4 недель."
  },
  {
    question: "Нужны ли технические знания для работы с ИИ-продавцом?",
    answer: "Нет, технические знания не требуются. Мы настраиваем систему под ключ, обучаем вашу команду и предоставляем простой интерфейс для управления. Все изменения можно вносить через визуальный редактор без кода."
  },
  {
    question: "Какие каналы связи поддерживает ИИ-продавец?",
    answer: "ИИ работает в Telegram, WhatsApp, Viber, VK, Instagram Direct, на сайте (веб-чат), в Avito и других популярных платформах. Можем подключить любой канал через API или вебхук."
  },
  {
    question: "Как ИИ понимает специфику моего бизнеса?",
    answer: "Мы обучаем ИИ на ваших данных: прайс-листах, FAQ, скриптах продаж, базе знаний. ИИ изучает вашу отрасль, продукты и типичные вопросы клиентов. В процессе работы система постоянно учится на реальных диалогах."
  },
  {
    question: "Может ли ИИ заменить всех менеджеров по продажам?",
    answer: "ИИ отлично справляется с первичной обработкой лидов, квалификацией, ответами на типовые вопросы и записью на встречи. Для сложных сделок и переговоров мы рекомендуем передавать клиента живому менеджеру. ИИ фильтрует поток и передает только горячие лиды."
  },
  {
    question: "Какие гарантии результата?",
    answer: "Мы гарантируем увеличение скорости обработки лидов в 10+ раз. По статистике наших клиентов, конверсия увеличивается на 30-200%. Если через месяц работы вы не увидите результатов, мы вернем деньги или доработаем систему бесплатно."
  },
  {
    question: "Сколько стоит поддержка после внедрения?",
    answer: "Поддержка включена в тариф. Basic — email поддержка, Business — приоритетная поддержка 24/7, Enterprise — персональный менеджер. Также мы регулярно обновляем ИИ, добавляем новые возможности и улучшаем работу системы."
  },
  {
    question: "Можно ли интегрировать с нашей CRM?",
    answer: "Да, мы интегрируемся со всеми популярными CRM: amoCRM, Bitrix24, Salesforce, HubSpot и другими. Также можем создать кастомную интеграцию через API с любой системой, которую вы используете."
  },
  {
    question: "Что если клиент задаст вопрос, на который ИИ не знает ответа?",
    answer: "В таких случаях ИИ честно сообщает, что уточнит информацию, и передает запрос менеджеру. Все непонятные вопросы фиксируются, и мы дообучаем систему на их основе. С каждым днем база знаний растет."
  },
  {
    question: "Безопасно ли доверять данные клиентов ИИ?",
    answer: "Абсолютно безопасно. Мы используем защищенные каналы связи, шифрование данных и соблюдаем все требования по защите персональных данных (152-ФЗ). Данные хранятся на защищенных серверах в России."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(false)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const visibleItems = faqData.slice(0, 4)
  const hiddenItems = faqData.slice(4)

  return (
    <section id="faq" className="py-20 sm:py-32 px-3 sm:px-4">
      <div className="container mx-auto">
        <AnimateOnScroll animation="fade-up" duration={700} className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Частые вопросы</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ответы на самые популярные вопросы о внедрении ИИ-продавца
          </p>
        </AnimateOnScroll>

        {/* FAQ List */}
        <StaggerChildren staggerDelay={80} animation="fade-up" className="max-w-4xl mx-auto space-y-3">
          {visibleItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <CardContent className={`transition-all duration-300 ${
                openIndex === index ? "py-3 px-3 sm:py-4 sm:px-6" : "py-3 px-3 sm:py-4 sm:px-4 md:py-0 md:px-4"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base md:text-xl font-bold flex-1 leading-tight">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Hidden items - показаны только когда showAll = true */}
          {showAll && hiddenItems.map((item, index) => {
            const actualIndex = 4 + index
            return (
              <Card
                key={actualIndex}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => toggleFAQ(actualIndex)}
              >
                <CardContent className={`transition-all duration-300 ${
                  openIndex === actualIndex ? "py-3 px-3 sm:py-4 sm:px-6" : "py-3 px-3 sm:py-4 sm:px-4 md:py-0 md:px-4"
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold flex-1 leading-tight">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === actualIndex ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === actualIndex ? "max-h-96 opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Show All / Hide Button */}
          {!showAll && hiddenItems.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowAll(true)}
              >
                <span>Показать все</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              </Button>
            </div>
          )}

          {showAll && hiddenItems.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setShowAll(false)
                  // Закрываем открытые вопросы из скрытой части при сворачивании
                  if (openIndex !== null && openIndex >= 4) {
                    setOpenIndex(null)
                  }
                }}
              >
                <span>Скрыть</span>
                <ChevronDown className="h-4 w-4 rotate-180 transition-transform duration-300" />
              </Button>
            </div>
          )}
        </StaggerChildren>
      </div>
    </section>
  )
}

