"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie } from "lucide-react"
import { getCookieConsentStatus, setCookieConsentStatus } from "@/lib/consent"
import { setupYandexMetrika } from "@/lib/yandex-metrika"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Проверяем статус согласия при монтировании
    const status = getCookieConsentStatus()
    
    // Показываем уведомление только если согласие еще не дано
    if (status === null) {
      setIsVisible(true)
    }

    // Если согласие уже дано, инициализируем сторонние сервисы
    if (status === 'accepted') {
      setupYandexMetrika()
    }
  }, [])

  const handleAccept = () => {
    setCookieConsentStatus('accepted')
    setIsVisible(false)
    // Инициализируем сторонние сервисы после согласия
    setupYandexMetrika()
  }

  const handleDecline = () => {
    setCookieConsentStatus('declined')
    setIsVisible(false)
    // Пользователь отказался от cookies/аналитики — сайт работает без аналитики
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <Card className="border-border bg-card shadow-2xl">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold mb-1">Использование cookies</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Мы используем cookies для анализа посещаемости сайта (Яндекс.Метрика). Вы можете отказаться — сайт будет работать без аналитики.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAccept} className="flex-1 text-sm">
              Принять
            </Button>
            <Button onClick={handleDecline} variant="outline" className="flex-1 text-sm">
              Отклонить
            </Button>
          </div>

          <div className="text-center">
            <a
              href="/politika-konfidentsialnosti"
              onClick={(e) => {
                e.preventDefault()
                navigate('/politika-konfidentsialnosti')
              }}
              className="text-xs text-primary hover:underline"
            >
              Политика конфиденциальности
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
