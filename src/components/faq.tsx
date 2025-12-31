import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Как быстро можно внедрить ИИ-продавца?",
    answer: "Базовое внедрение занимает 7-14 дней. Это включает анализ вашего бизнеса, настройку ИИ, обучение на ваших данных, интеграцию с системами и тестирование. Для сложных проектов срок может увеличиться до 3-4 недель."
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Частые вопросы</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ответы на самые популярные вопросы о внедрении ИИ-продавца
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-bold text-balance flex-1">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

