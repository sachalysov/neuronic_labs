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
  basic: `Basic (Базовый) Фокус на быстром запуске: внедрение занимает всего 1–2 недели, плюс бесплатный тест-драйв по вашей нише (всего 1 минута, без каких-либо обязательств). Отлично подходит для малого бизнеса — именно здесь уже 29% компаний используют ИИ и видят реальный рост.
Общение с клиентами 24/7 в Telegram, WhatsApp, VK или Avito: бот отвечает на вопросы, проверяет, насколько клиент готов купить, мягко отрабатывает возражения — как опытный консультант. В итоге конверсия вырастает на 25–28%, а ночные и выходные заявки больше не уходят конкурентам.
Расчёт цен и смет: по простым формулам. Например, для клининга — клиент указывает площадь, бот сразу считает стоимость (это даёт +30% лидов за счёт мгновенного ответа). Для детейлинга — анализ по фото авто (экономит 2–5 часов на каждом заказе).
Сбор лидов: бот перехватывает чаты на Avito и сразу отправляет готовые контакты в CRM (простая связь с Bitrix24 или amoCRM). Потери лидов снижаются на 70%.
Уведомления: SMS или email-напоминания о записях и подтверждения заказов (через Twilio или Smsc.ru). 95% малого бизнеса отмечают, что сервис становится заметно лучше — клиенты реже пропускают визиты.
Базовый ИИ: Яндекс GPT генерирует естественные ответы, анализирует эмоции клиента и подстраивает тон общения (клиенты чувствуют себя понятыми, лояльность растёт).
Отчёты: Простые таблицы в Google Sheets — сколько лидов, как быстро отвечает бот. Ежемесячно смотрим на возврат инвестиций.
Поддержка: Регулярные обновления и гарантия, что бот работает стабильно 99% времени.`,

  business: `Business (Бизнес) Включает всё из тарифа Basic, плюс удобные инструменты для роста бизнеса: можно подключить до 5 интеграций (например, с маркетплейсами, CRM и платежами), а также проводить A/B-тесты, чтобы понять, какие ответы бота работают лучше.
Этот тариф особенно подходит для онлайн-магазинов: именно в e-commerce искусственный интеллект внедряют чаще всего — он помогает снижать расходы и повышать лояльность клиентов (люди охотнее возвращаются, когда бот быстро и точно отвечает).
Подключение к маркетплейсам (Avito, Ozon, Wildberries, Яндекс Маркет): бот отвечает в чатах покупателей, автоматически обновляет информацию о товарах и заказах, следит за доставкой (через СДЭК или Яндекс.Доставку). В результате продажи вырастают на 25% благодаря быстрой и круглосуточной обработке заявок.
CRM и управление клиентами: Полная связь с Bitrix24, amoCRM или YClients — бот строит воронку продаж, записывает на услуги, синхронизирует расписание мастеров и филиалы. Это экономит 40–60% времени на повседневных операциях.
Платежи: Автоматически выставляет счета через Тинькофф, Сбер, Prodamus или Яндекс.Кассу — отправляет ссылки на оплату, предлагает рассрочку, работает с картами МИР. Сделки закрываются на 30% быстрее.
Маркетинг: Делает email- и SMS-рассылки (через Unisender или Twilio), отслеживает, откуда пришли лиды (из Яндекс.Рекламы или VK Рекламы). Это помогает лучше тратить бюджет на рекламу и повышает возврат инвестиций на 15%.
Аналитика: Подключается к Яндекс.Метрике — анализирует трафик, воронку продаж, присылает ежедневные отчеты по email. Вы увидите ключевые показатели и слабые места наглядно.
Продвинутый ИИ: Использует OpenAI GPT-4 для анализа фото (например, оценивает состояние авто в детейлинге или площадь в клининге с точностью 51%), поддерживает несколько языков (удобно для экспорта).
Поддержка: Ежемесячные обновления, постоянный мониторинг возврата инвестиций, A/B-тесты разных вариантов ответов бота.`,

  pro: `Enterprise (Энтерпрайз) Включает всё из тарифа Business, плюс полная кастомизация для настоящего автопилота: неограниченное количество интеграций и премиум-поддержка.
Автоматизация внутренних процессов: Нейро-агент берёт на себя рутину — автоматически запрашивает цены у поставщиков, управляет складом (через МойСклад), интегрируется с 1С для бухгалтерии. В итоге на бухгалтерию уходит на 60% меньше времени.
Телефония: Голосовые звонки и автоответчик (IVR) через Voximplant, Sipuni или Asterisk — бот делает уведомления, записывает разговоры и сразу отправляет данные в CRM. Это повышает конверсию по звонкам на 20%.
Специальные функции под вашу нишу: Для клининга — умная маршрутизация выездов по Яндекс.Картам (экономия до 20% на бензине и времени). Для салонов красоты — автоматический рейтинг мастеров и распределение клиентов. Для онлайн-магазинов — сбор отзывов и оптимизация ставок в рекламе (рост выручки до 91%).
Продвинутый ИИ: Анализ фото (Vision AI), свои кастомные модели GPT, поддержка разных языков (удобно, если работаете с иностранными клиентами). Всё это делает общение персонализированным и повышает лояльность покупателей.
Аналитика и отчёты: Красивые интерактивные дашборды в Power BI, ключевые показатели по всем каналам, мгновенные алерты, интеграция с сайтами на Tilda или Opencart — вы всегда видите картину в реальном времени.
Масштабирование: Автоматическое управление подрядчиками и распределение задач, синхронизация с GetCourse для курсов и консультаций — бизнес растёт без найма новых людей.
Премиум-поддержка: Круглосуточная помощь (ответ меньше 2 часов), гарантия роста конверсии на 30%, ежемесячные аудиты и индивидуальные доработки в n8n.`
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
        className="w-full max-w-2xl max-h-[90vh] shadow-2xl border-border bg-card/10 backdrop-blur-md animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b border-border/50 pb-3 sm:pb-4 bg-destructive/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Подробнее о тарифе {planName}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-destructive/20 flex-shrink-0"
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
              const isHeading = paragraph.match(/^(Basic|Business|Enterprise)/)
              
              if (isHeading) {
                const parts = paragraph.split(/\s+(.+)/)
                const title = parts[0]
                const rest = parts[1] || ""
                
                return (
                  <div key={index} className="mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">{title}</h4>
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
                    <h5 className="text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2">
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

