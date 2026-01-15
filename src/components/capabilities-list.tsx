"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

export function CapabilitiesList() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className={`w-full max-w-[717px] mx-auto mt-4 shadow-lg bg-card border-border ${!isOpen ? 'capabilities-red-pulse' : ''}`}>
      <CardContent 
        className="px-4 py-2 cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-card-foreground">Самые базовые возможности этого бота</h3>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 text-muted-foreground ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[800px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 text-sm text-card-foreground text-left">
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Что он умеет?</h4>
              <ul className="space-y-1.5 list-disc list-inside ml-2 text-muted-foreground">
                <li>Консультирует по наличию</li>
                <li>Расчитывает стоимость</li>
                <li>Предлагает дополниельный товар и услуги</li>
                <li>Закрывает возражения</li>
                <li>Записывает номера телефонов, имена, адреса</li>
                <li>Подсказывает ближайший магазин или офис от дома клиента</li>
                <li>Отменять запись по просьбе клиента</li>
                <li>Отправлять фото товаров</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">Варианты интеграции:</h4>
              <div className="space-y-1.5 text-muted-foreground">
                <p><span className="font-medium text-card-foreground">Канал продаж</span> - На сайт / telegram / avito / и другие..</p>
                <p><span className="font-medium text-card-foreground">CRM</span> - Bitrix / Amo / Yclients / и другие..</p>
              </div>
            </div>
            
            <p className="text-muted-foreground italic">И любой другой сценарий который захотете реализовать!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

