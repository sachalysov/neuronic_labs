"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X } from "lucide-react"

interface VomolokoContextModalProps {
  isOpen: boolean
  onClose: () => void
}

const contextText = `Во!Молоко — сеть магазинов в СПб (16 точек), доставка натуральных продуктов из Вологодской обл.: молочка (Шексна, Вологжанка), масло, колбасы, кондитерка, варенья, консервы, хлеб, заморозка, мёд, соусы, чай. Свежие поставки со вторника/четверга, цены от 32 руб., вакансии продавцов 35-45к руб.

Возможные вопросы:

Цены/наличие на молоко Шексна 4% или творог?

Доставка в [район СПб], тарифы?

Состав варенья "Вологодское малиновое"?

Вакансия продавца: график, медкнижка?

Рекомендации для первого заказа с подарком?`

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
              if (!paragraph.trim()) return null
              
              // Если строка начинается с "?", это вопрос
              const isQuestion = paragraph.trim().startsWith('?') || paragraph.trim().endsWith('?')
              
              // Если строка содержит "Возможные вопросы:", это заголовок
              const isHeading = paragraph.includes('Возможные вопросы:')
              
              if (isHeading) {
                return (
                  <div key={index} className="mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-primary">
                      {paragraph}
                    </h4>
                  </div>
                )
              }
              
              if (isQuestion) {
                return (
                  <div key={index} className="mb-3 sm:mb-4">
                    <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium">
                      {paragraph.trim()}
                    </p>
                  </div>
                )
              }
              
              // Обычный параграф
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

