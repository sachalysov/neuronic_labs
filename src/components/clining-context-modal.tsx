import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X } from "lucide-react"

interface CliningContextModalProps {
  isOpen: boolean
  onClose: () => void
}

const contextText = `Клининговая компания: уборка квартир, домов, офисов, после ремонта. Химчистка, мытьё окон.
Цель — узнать условия, заказать уборку или рассчитать стоимость.

Примеры вопросов:

- Сколько стоит уборка трёхкомнатной квартиры?
- Есть ли уборка после ремонта?
- Химчистка дивана — как заказать и цена?
- В какие районы выезжаете?
- Нужна срочная уборка сегодня

И многое другое по клинингу и уборке`

export function CliningContextModal({ isOpen, onClose }: CliningContextModalProps) {
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
        className="w-full max-w-2xl max-h-[90vh] shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b border-border pb-3 sm:pb-4 bg-secondary/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Прочти перед диалогом</h3>
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
            {contextText.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              
              const isHeading = trimmed.includes('Примеры вопросов:')
              const isListItem = trimmed.startsWith('- ')
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
