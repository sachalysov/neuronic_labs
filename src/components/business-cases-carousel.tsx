"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const businessCases = [
  {
    title: "Салон красоты",
    industry: "Beauty & Wellness",
    results: [
      { icon: Users, label: "Клиентов", value: "+180%", color: "text-primary" },
      { icon: TrendingUp, label: "Конверсия", value: "+65%", color: "text-green-500" },
      { icon: Clock, label: "Время ответа", value: "< 30 сек", color: "text-blue-500" },
    ],
    description:
      "ИИ-ассистент принимает записи 24/7, консультирует по услугам, напоминает о визитах и обрабатывает отмены. Автоматизация освободила администраторов для работы с VIP-клиентами.",
    challenge: "Потеря клиентов из-за занятой линии в пиковые часы",
    solution: "Мультиканальный ИИ-ассистент с интеграцией в систему бронирования",
    image: "/modern-beauty-salon.png",
  },
  {
    title: "Клининговая компания",
    industry: "Cleaning Services",
    results: [
      { icon: Users, label: "Заявок", value: "+210%", color: "text-primary" },
      { icon: TrendingUp, label: "Продажи", value: "+95%", color: "text-green-500" },
      { icon: Clock, label: "Работа", value: "24/7", color: "text-blue-500" },
    ],
    description:
      "Внедрили ИИ-продавца, который консультирует по типам уборки, рассчитывает стоимость, формирует заявки и отправляет их менеджерам. Снизили нагрузку на колл-центр на 70%.",
    challenge: "Высокая стоимость обработки входящих звонков",
    solution: "ИИ-калькулятор услуг с автоматическим формированием коммерческих предложений",
    image: "/professional-cleaning-service-team.jpg",
  },
  {
    title: "Детейлинг центр",
    industry: "Auto Detailing",
    results: [
      { icon: Users, label: "Записей", value: "+145%", color: "text-primary" },
      { icon: TrendingUp, label: "Средний чек", value: "+42%", color: "text-green-500" },
      { icon: Clock, label: "Обработка", value: "1 мин", color: "text-blue-500" },
    ],
    description:
      "ИИ-консультант помогает выбрать пакет услуг, показывает примеры работ, записывает на удобное время и отправляет напоминания. Клиенты получают мгновенные ответы и профессиональную консультацию.",
    challenge: "Низкая конверсия из обращений в записи",
    solution: "ИИ-консультант с визуальным каталогом услуг и онлайн-записью",
    image: "/car-detailing-center-luxury.jpg",
  },
  {
    title: "Медицинская клиника",
    industry: "Healthcare",
    results: [
      { icon: Users, label: "Записей", value: "+165%", color: "text-primary" },
      { icon: TrendingUp, label: "Удержание", value: "+78%", color: "text-green-500" },
      { icon: Clock, label: "Доступность", value: "24/7", color: "text-blue-500" },
    ],
    description:
      "ИИ-регистратор записывает на прием, информирует о подготовке к процедурам, напоминает о визитах и отвечает на типовые вопросы. Разгрузили регистратуру и повысили качество сервиса.",
    challenge: "Перегруженность регистратуры и пропущенные записи",
    solution: "ИИ-регистратор с системой напоминаний и онлайн-консультациями",
    image: "/modern-medical-clinic-reception.png",
  },
]

export function BusinessCasesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % businessCases.length)
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % businessCases.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + businessCases.length) % businessCases.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentCase = businessCases[currentIndex]

  return (
    <div className="space-y-8">
      {/* Main Carousel */}
      <div className="relative">
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src={currentCase.image || "/placeholder.svg"}
                  alt={currentCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-primary/90 text-xs font-semibold rounded-full mb-2">
                    {currentCase.industry}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{currentCase.title}</h3>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 space-y-6">
                {/* Results Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {currentCase.results.map((result, idx) => (
                    <div key={idx} className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <result.icon className={`h-5 w-5 ${result.color}`} />
                        </div>
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${result.color}`}>{result.value}</p>
                        <p className="text-xs text-muted-foreground">{result.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">{currentCase.description}</p>

                {/* Challenge & Solution */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Вызов:</p>
                    <p className="text-sm text-muted-foreground">{currentCase.challenge}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Решение:</p>
                    <p className="text-sm text-muted-foreground">{currentCase.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2">
        {businessCases.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Перейти к кейсу ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <p className="text-center text-sm text-muted-foreground">
        {isAutoPlaying ? "Автопрокрутка активна" : "Автопрокрутка приостановлена"}
      </p>
    </div>
  )
}

