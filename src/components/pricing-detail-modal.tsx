"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X } from "lucide-react"

interface PricingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  planName: string
}

const planDescriptions: Record<string, string> = {
  lite: `Lite (Лайт) Быстрый старт без сложных интеграций.
1 канал продаж: Настраиваем основной канал, где у вас больше всего обращений, и приводим диалог к заявке.
Записывает заявки в таблицу: Каждое обращение автоматически фиксируется с контактами, темой и статусом, чтобы ничего не потерялось.
База знаний из FAQ и прайса: Бот отвечает на типовые вопросы, отдает актуальные цены и условия, разгружая менеджеров.
Отчеты в Телеграм: Краткие сводки по обращениям, вопросам и качеству ответов прямо в удобном канале.
Поддержка: Базовые обновления и помощь по работе сценариев.`,
  basic: `Basic (Базовый) Для малого бизнеса с регулярными заявками.
Все из Lite: Весь функционал Lite, включая быстрый запуск и базовую аналитику.
1 канал продаж: Оптимизируем коммуникацию в ключевом канале и доводим клиента до заявки.
Сбор лидов в CRM: Автоматическая передача контактов и деталей диалога в CRM для дальнейшей обработки.
Уведомления клиенту (SMS/email): Подтверждения, напоминания и статусные сообщения, чтобы клиенты не терялись.`,
  business: `Business (Бизнес) Баланс для роста и масштабирования.
Всё из Basic: Полный набор функций Basic с интеграциями и уведомлениями.
3 канала связи: Подключаем несколько каналов и сохраняем единую историю общения.
Прием оплаты: Формируем счет/ссылку на оплату прямо в чате и контролируем статус платежа.
Маркетинг и рассылки: Автоматические рассылки, сегментация и триггерные сообщения по поведению клиента.
Аналитика: Отчеты по воронке, причинам отказов и эффективности сценариев.
Продвинутый ИИ: Более точные ответы, обработка сложных запросов и гибкие сценарии.`,
  pro: `Enterprise (Энтерпрайз) Максимум кастомизации и приоритета.
Всё из Business: Полный набор функций Business с расширенной логикой.
Телефония: Интеграция голосовых каналов, IVR и фиксация результатов звонков в CRM.
Продвинутый ИИ+: Усиленные модели, глубокая персонализация и сложные сценарии.
Премиум-поддержка 24/7: Приоритетная реакция, SLA и индивидуальные доработки.`
}

export function PricingDetailModal({ isOpen, onClose, planId, planName }: PricingDetailModalProps) {
  if (!isOpen) return null

  const description = planDescriptions[planId] || ""

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b border-border pb-3 sm:pb-4 bg-secondary/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Подробнее о тарифе {planName}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-secondary flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 sm:pt-6 flex-1 overflow-y-auto">
          <div className="space-y-4 sm:space-y-5">
            {description.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null
              
              // Определяем, является ли параграф заголовком (начинается с названия тарифа)
              const isHeading = paragraph.match(/^(Lite|Basic|Business|Enterprise)/)
              
              if (isHeading) {
                const parts = paragraph.split(/\s+(.+)/)
                const title = parts[0]
                const rest = parts[1] || ""
                
                return (
                  <div key={index} className="mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-primary" style={{ marginBottom: '0.25rem' }}>{title}</h4>
                    {rest && (
                      <p className="text-sm sm:text-base leading-relaxed text-foreground">
                        {rest}
                      </p>
                    )}
                  </div>
                )
              }
              
              // Разделяем текст по двоеточиям для лучшей структуры
              const parts = paragraph.split(':')
              if (parts.length > 1) {
                const title = parts[0].trim()
                const content = parts.slice(1).join(':').trim()
                
                return (
                  <div key={index} className="mb-3 sm:mb-4">
                    <h5 className="text-sm sm:text-base font-semibold text-foreground" style={{ marginBottom: '0.125rem' }}>
                      {title}:
                    </h5>
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground pl-2 sm:pl-3">
                      {content}
                    </p>
                  </div>
                )
              }
              
              return (
                <p key={index} className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-3 sm:mb-4">
                  {paragraph.trim()}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

