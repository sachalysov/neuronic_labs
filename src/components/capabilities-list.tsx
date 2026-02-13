"use client"

import { useState } from "react"
import { ChevronDown, MessageSquare, Calculator, PackagePlus, ShieldCheck, UserCheck, MapPin, CalendarX, ImageIcon, Globe, Database } from "lucide-react"

export function CapabilitiesList() {
  const [isOpen, setIsOpen] = useState(false)

  const capabilities = [
    { icon: MessageSquare, text: "Консультирует по наличию" },
    { icon: Calculator, text: "Рассчитывает стоимость" },
    { icon: PackagePlus, text: "Предлагает доп. товары и услуги" },
    { icon: ShieldCheck, text: "Закрывает возражения" },
    { icon: UserCheck, text: "Записывает контактные данные" },
    { icon: MapPin, text: "Подсказывает ближайший магазин" },
    { icon: CalendarX, text: "Отменяет запись по просьбе" },
    { icon: ImageIcon, text: "Отправляет фото товаров" },
  ]

  const integrations = [
    { icon: Globe, label: "Каналы продаж", value: "Сайт, Telegram, Avito и др." },
    { icon: Database, label: "CRM-системы", value: "Bitrix, Amo, Yclients и др." },
  ]

  return (
    <div className="w-full max-w-[717px] mx-auto mt-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-2xl border bg-card/80 backdrop-blur-sm px-5 py-4 transition-all duration-300 ${
          !isOpen
            ? "capabilities-red-pulse border-border"
            : "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <MessageSquare className="h-4 w-4 text-red-400" />
            </span>
            <span className="text-[15px] font-semibold text-card-foreground text-left">
              Возможности демо бота
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 text-muted-foreground ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-5">
          {/* Capabilities grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Что умеет бот
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3.5 py-2.5 text-left"
                >
                  <cap.icon className="h-4 w-4 flex-shrink-0 text-red-400/80" />
                  <span className="text-sm text-card-foreground/90">{cap.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Интеграции
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {integrations.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/40 bg-secondary/30 p-3 text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <item.icon className="h-3.5 w-3.5 text-red-400/80" />
                    <span className="text-xs font-semibold text-card-foreground">{item.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground/80 italic pt-1">
            И любой другой сценарий, который захотите реализовать
          </p>
        </div>
      </div>
    </div>
  )
}
