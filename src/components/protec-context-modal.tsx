"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X } from "lucide-react"

interface ProtecContextModalProps {
  isOpen: boolean
  onClose: () => void
}

const contextText = `Компания Protec.one производит и устанавливает полиуретановую защитную пленку для экранов и корпусов смартфонов, планшетов, смарт-часов и MacBook с пожизненной гарантией замены.
Услуги
Защита 360° для смартфонов  —  пленка покрывающая со всех сторон, глянцевая/матовая, с самозаживлением царапин.
Защита для планшетов (iPad, Samsung и др.), смарт-часов (Apple Watch и аналоги), механических часов.
Ultra PRO — усиленная версия с накладками на камеры и углы; установка занимает 15–30 мин; скидки до 30% на несколько устройств.
Примеры вопросов: 
​- Доступна ли защита для моей модели устройства и ближайший офис в Санкт-Петербурге?
​- Как работает гарантия замены, сколько стоит работа мастера и средний срок службы пленки?
​- Чем ваша пленка лучше стекла/гидрогеля, можно ли ходить без чехла и что если телефон упадет?
​`

export function ProtecContextModal({ isOpen, onClose }: ProtecContextModalProps) {
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
            {contextText.split('\n').map((paragraph, index, array) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              
              // Если строка содержит "Примеры вопросов:", это заголовок
              const isHeading = trimmed.includes('Примеры вопросов:') || trimmed === 'Услуги'
              
              // Если строка начинается с "- ", это элемент списка
              const isListItem = trimmed.startsWith('- ')
              
              // Проверяем, был ли предыдущий заголовок "Услуги" или "Примеры вопросов"
              let isUnderServices = false
              let isUnderExamples = false
              for (let i = index - 1; i >= 0; i--) {
                const prevTrimmed = array[i]?.trim()
                if (!prevTrimmed) continue
                if (prevTrimmed === 'Услуги' || prevTrimmed.includes('Примеры вопросов:')) {
                  if (prevTrimmed === 'Услуги') {
                    isUnderServices = true
                  } else if (prevTrimmed.includes('Примеры вопросов:')) {
                    isUnderExamples = true
                  }
                  break
                }
              }
              
              if (isHeading) {
                return (
                  <div key={index} className="mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-primary">
                      {trimmed}
                    </h4>
                  </div>
                )
              }
              
              if (isListItem) {
                return (
                  <div key={index} className="mb-2 sm:mb-3 ml-4">
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {trimmed.replace(/^-\s*/, '')}
                    </p>
                  </div>
                )
              }
              
              // Обычный параграф - под заголовками используем muted, иначе обычный
              const paragraphColor = (isUnderServices || isUnderExamples) ? 'text-muted-foreground' : 'text-foreground'
              return (
                <p key={index} className={`text-sm sm:text-base leading-relaxed ${paragraphColor}`}>
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

