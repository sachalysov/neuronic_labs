"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X } from "lucide-react"

interface VomolokoContextModalProps {
  isOpen: boolean
  onClose: () => void
}

const contextText = `Во!Молоко — сеть магазинов в СПб натуральных продуктов из Вологодской обл.: молочка (Шексна, Вологжанка), масло, колбасы, кондитерка, варенья, консервы, хлеб, заморозка, мёд, соусы, чай. Имеется доставка.

Примеры вопросов:

- - Сколько стоит молоко? Хочу заказать 400гр сосисок (пересчитает сумму от кг и ответит посчитанной суммой) и так далее.
- - Доставка, тарифы. В какие райноы доставляете? Сколько стоит достака?
- - Какой состав варенья "Вологодское малиновое"?
- - Какие у вас сейчас акции?

И многое другое касаемо молочной тематики`

export function VomolokoContextModal({ isOpen, onClose }: VomolokoContextModalProps) {
  if (!isOpen) return null

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
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Погружение в контекст перед диалогом</h3>
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
            {contextText.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              
              // Если строка содержит "Возможные вопросы:", это заголовок
              const isHeading = trimmed.includes('Возможные вопросы:')
              
              // Если строка начинается с "- ", это элемент списка
              const isListItem = trimmed.startsWith('- ')
              
              // Если строка начинается с "И многое другое", это продолжение списка
              const isListContinuation = trimmed.startsWith('И многое другое')
              
              if (isHeading) {
                return (
                  <div key={index} className="mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-primary">
                      {trimmed}
                    </h4>
                  </div>
                )
              }
              
              if (isListItem || isListContinuation) {
                return (
                  <div key={index} className="mb-2 sm:mb-3 ml-4">
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {trimmed.replace(/^-\s*/, '')}
                    </p>
                  </div>
                )
              }
              
              // Обычный параграф
              return (
                <p key={index} className="text-sm sm:text-base leading-relaxed text-foreground">
                  {trimmed}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

