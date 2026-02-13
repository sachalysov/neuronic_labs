"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { getCookiesConsentStatus, setCookiesConsentStatus } from "@/lib/consent"
import { setupYandexMetrika } from "@/lib/yandex-metrika"

interface ConsentGateProps {
  children: React.ReactNode
}

export function ConsentGate({ children }: ConsentGateProps) {
  const [consentStatus, setConsentStatusState] = useState<'accepted' | 'declined' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Проверяем статус согласия при монтировании
    const status = getCookiesConsentStatus()
    setConsentStatusState(status)
    setIsLoading(false)

    // Если согласие не дано, показываем уведомление через небольшую задержку
    if (status === null) {
      setTimeout(() => setIsVisible(true), 500)
    }

    // Если согласие уже дано, инициализируем сторонние сервисы
    if (status === 'accepted') {
      setupYandexMetrika()
    }
  }, [])

  const handleAccept = () => {
    setCookiesConsentStatus('accepted')
    setConsentStatusState('accepted')
    setIsVisible(false)
    // Инициализируем сторонние сервисы после согласия
    setupYandexMetrika()
  }

  const handleDecline = () => {
    setCookiesConsentStatus('declined')
    setConsentStatusState('declined')
    setIsVisible(false)
    // Пользователь отказался от cookies/аналитики — сайт работает без Яндекс.Метрики
  }

  const handleClose = () => {
    setIsVisible(false)
    // При закрытии без выбора считаем, что пользователь отклонил
    if (consentStatus === null) {
      setCookiesConsentStatus('declined')
      setConsentStatusState('declined')
    }
  }

  // Показываем загрузку только при первой проверке
  if (isLoading) {
    return <>{children}</>
  }

  // Всегда показываем контент (доступ к сайту не блокируется)
  return (
    <>
      {children}
      
      {/* Всплывающее уведомление о cookies (не блокирует доступ) */}
      {isVisible && consentStatus === null && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] max-w-md animate-in slide-in-from-bottom-5">
          <Card className="border-border bg-card shadow-2xl">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Использование cookies</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Мы используем cookies для анализа посещаемости сайта (Яндекс.Метрика). 
                    Вы можете отказаться — сайт будет работать без аналитики.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Подробная информация в{" "}
                    <a
                      href="/politika-konfidentsialnosti"
                      onClick={(e) => {
                        e.preventDefault()
                        navigate('/politika-konfidentsialnosti')
                      }}
                      className="text-primary hover:underline"
                    >
                      Политике конфиденциальности
                    </a>
                    .
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-6 w-6 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAccept} className="flex-1" size="sm">
                  Принять
                </Button>
                <Button onClick={handleDecline} variant="outline" className="flex-1" size="sm">
                  Отклонить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
