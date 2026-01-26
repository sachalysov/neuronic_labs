"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { getConsentStatus, setConsentStatus } from "@/lib/consent"
import { setupYandexMetrika } from "@/lib/yandex-metrika"

interface ConsentGateProps {
  children: React.ReactNode
}

// Страницы, доступные без согласия
const PUBLIC_PAGES = ['/politika-konfidentsialnosti', '/consent-required']

// Проверка, является ли путь админ-страницей
const isAdminPage = (pathname: string): boolean => {
  return pathname.startsWith('/admin')
}

export function ConsentGate({ children }: ConsentGateProps) {
  const [consentStatus, setConsentStatusState] = useState<'accepted' | 'declined' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Проверяем статус согласия при монтировании
    const status = getConsentStatus()
    setConsentStatusState(status)
    setIsLoading(false)

    // Если согласие уже дано, инициализируем сторонние сервисы
    if (status === 'accepted') {
      setupYandexMetrika()
    }
  }, [])

  // Если это публичная страница или админ-страница, показываем контент без проверки
  if (PUBLIC_PAGES.includes(location.pathname) || isAdminPage(location.pathname)) {
    return <>{children}</>
  }

  const handleAccept = () => {
    setConsentStatus('accepted')
    setConsentStatusState('accepted')
    // Инициализируем сторонние сервисы после согласия
    setupYandexMetrika()
  }

  const handleDecline = () => {
    setConsentStatus('declined')
    setConsentStatusState('declined')
    // Перенаправляем на страницу с требованием согласия
    navigate('/consent-required')
  }

  // Показываем загрузку только при первой проверке
  if (isLoading) {
    return null
  }

  // Если согласие дано, показываем контент
  if (consentStatus === 'accepted') {
    return <>{children}</>
  }

  // Если согласие отклонено, показываем gate (будет перенаправление)
  if (consentStatus === 'declined') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Доступ требует согласия</h2>
                <p className="text-sm text-muted-foreground">
                  Для использования сайта необходимо согласие на обработку персональных данных
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAccept} className="flex-1">
                Принять
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/politika-konfidentsialnosti')}
                className="flex-1"
              >
                Политика конфиденциальности
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Если согласие не дано, показываем модальное окно согласия
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Согласие на обработку персональных данных</h2>
              <p className="text-xs text-muted-foreground">
                В соответствии с Федеральным законом № 152-ФЗ
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p>
              Для работы сайта и предоставления услуг нам необходимо обрабатывать ваши персональные данные.
            </p>
            <p>
              Мы собираем и обрабатываем следующие данные: имя, телефон, email, сообщения в чате и формах обратной связи.
            </p>
            <p>
              Подробная информация о целях обработки, сроках хранения и ваших правах указана в{" "}
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

          <div className="flex gap-3">
            <Button onClick={handleAccept} className="flex-1">
              Принять
            </Button>
            <Button onClick={handleDecline} variant="outline" className="flex-1">
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
              className="text-sm text-primary hover:underline"
            >
              Политика конфиденциальности
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
