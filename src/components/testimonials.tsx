import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  rating: number
  text: string
  result: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Алексей Петров",
    position: "Директор",
    company: "Автосервис \"Мастер\"",
    rating: 5,
    text: "Внедрили ИИ-продавца 3 месяца назад. Результат превзошел все ожидания! Раньше половина звонков оставалась без ответа, клиенты уходили. Теперь каждый лид обрабатывается мгновенно, даже ночью.",
    result: "+180% конверсия в запись"
  },
  {
    id: 2,
    name: "Марина Соколова",
    position: "Владелец",
    company: "Салон красоты \"Элегант\"",
    rating: 5,
    text: "Я скептически относилась к ИИ, но команда NEURONIC LABS убедила попробовать. За месяц ИИ записал на услуги больше клиентов, чем администратор за полгода! Окупилось за 2 недели.",
    result: "+230% записей на услуги"
  },
  {
    id: 3,
    name: "Дмитрий Волков",
    position: "Коммерческий директор",
    company: "Клининговая компания \"ЧистоДом\"",
    rating: 5,
    text: "Главная проблема была — медленная обработка заявок с Avito. Клиенты не ждали и уходили к конкурентам. С ИИ-продавцом ответ приходит за 30 секунд. Конверсия выросла в 3 раза!",
    result: "+300% продаж с Avito"
  },
  {
    id: 4,
    name: "Елена Кузнецова",
    position: "Руководитель",
    company: "Медицинская клиника \"ЗдоровьеПлюс\"",
    rating: 5,
    text: "У нас большой поток обращений через WhatsApp и сайт. Администраторы не справлялись. ИИ решил проблему: отвечает на вопросы, записывает на прием, отправляет напоминания. Персонал освободился для более важных задач.",
    result: "+150% обработанных заявок"
  },
  {
    id: 5,
    name: "Игорь Смирнов",
    position: "Основатель",
    company: "Агентство недвижимости \"СтройИнвест\"",
    rating: 5,
    text: "Внедрение заняло всего 10 дней. ИИ квалифицирует лиды, отвечает на базовые вопросы по объектам, записывает на просмотры. Менеджеры работают только с горячими клиентами. Продуктивность отдела выросла вдвое.",
    result: "+200% эффективность отдела"
  },
  {
    id: 6,
    name: "Ольга Николаева",
    position: "Владелец",
    company: "Интернет-магазин \"Техношоп\"",
    rating: 5,
    text: "ИИ-консультант на сайте стал нашим лучшим продавцом. Помогает выбрать товар, отвечает на технические вопросы, оформляет заказы. Средний чек вырос на 40%, а количество брошенных корзин снизилось вдвое.",
    result: "+165% конверсия сайта"
  }
]

export function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)

  // Отслеживание активного слайда (без клонов и бесконечной прокрутки)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      
      // Определяем ближайший слайд
      let closestIndex = 0
      let closestDistance = Infinity

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement
        const cardLeft = card.offsetLeft
        const cardCenter = cardLeft + card.offsetWidth / 2
        const distance = Math.abs(scrollLeft + container.offsetWidth / 2 - cardCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveTestimonialIndex(closestIndex)
    }

    // Небольшая задержка для правильного расчета размеров и установки стартового индекса
    setTimeout(() => {
      handleScroll()
    }, 100)
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [testimonials.length])

  const renderTestimonial = (testimonial: Testimonial, key: string) => (
    <Card
      key={key}
      className="flex-shrink-0 w-full max-w-5xl snap-center bg-card/50 border-primary/20 shadow-xl"
    >
      <CardContent className="p-4 sm:p-8 md:p-12">
        <div className="relative">
          {/* Quote Icon */}
          <Quote className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 h-10 w-10 sm:h-16 sm:w-16 text-primary/20" />

          {/* Rating */}
          <div className="flex justify-center gap-1 mb-4 sm:mb-6">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 sm:h-6 sm:w-6 fill-primary text-primary" />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-sm sm:text-lg md:text-xl text-center mb-6 sm:mb-8 leading-relaxed">
            "{testimonial.text}"
          </blockquote>

          {/* Result Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-primary/10 border border-primary/30 rounded-full px-3 py-2 sm:px-6 sm:py-3">
              <p className="text-primary font-bold text-sm sm:text-lg">
                {testimonial.result}
              </p>
            </div>
          </div>

          {/* Author Info */}
          <div className="text-center space-y-1 sm:space-y-2">
            <p className="font-bold text-base sm:text-xl">{testimonial.name}</p>
            <p className="text-sm sm:text-base text-muted-foreground">
              {testimonial.position}, {testimonial.company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section id="testimonials" className="py-20 sm:py-32 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Отзывы клиентов</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Реальные истории бизнесов, которые увеличили продажи с нашим ИИ-продавцом
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
            style={{
              scrollPaddingLeft: '0.5rem',
              scrollPaddingRight: '0.5rem'
            }}
          >
            {testimonials.map((testimonial, index) => 
              renderTestimonial(testimonial, `testimonial-${index}`)
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 sm:mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-primary">98%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Довольных клиентов</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-primary">4.9/5</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Средняя оценка</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-primary">90+</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Успешных проектов</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

