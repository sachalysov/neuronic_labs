import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Автопрокрутка
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold section-title">Отзывы клиентов</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Реальные истории бизнесов, которые увеличили продажи с нашим ИИ-продавцом
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="bg-card/50 border-primary/20 shadow-xl">
            <CardContent className="p-4 sm:p-8 md:p-12">
              <div className="relative">
                {/* Quote Icon */}
                <Quote className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 h-10 w-10 sm:h-16 sm:w-16 text-primary/20" />

                {/* Rating */}
                <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-6 sm:w-6 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-sm sm:text-lg md:text-xl text-center mb-6 sm:mb-8 leading-relaxed">
                  "{currentTestimonial.text}"
                </blockquote>

                {/* Result Badge */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="bg-primary/10 border border-primary/30 rounded-full px-3 py-2 sm:px-6 sm:py-3">
                    <p className="text-primary font-bold text-sm sm:text-lg">
                      {currentTestimonial.result}
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="text-center space-y-1 sm:space-y-2">
                  <p className="font-bold text-base sm:text-xl">{currentTestimonial.name}</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {currentTestimonial.position}, {currentTestimonial.company}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 sm:mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>

                {/* Dots */}
                <div className="flex gap-1.5 sm:gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-primary w-6 sm:w-8"
                          : "bg-muted-foreground/30 w-2 sm:w-2.5 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Перейти к отзыву ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>

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
              <p className="text-xl sm:text-3xl md:text-4xl font-bold text-primary">200+</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Успешных проектов</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

