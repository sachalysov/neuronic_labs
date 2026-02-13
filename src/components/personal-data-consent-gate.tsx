"use client"

import { useState, useEffect, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { getPersonalDataConsentStatus, setPersonalDataConsentStatus } from "@/lib/consent"

interface PersonalDataConsentGateProps {
  children: ReactNode
  onConsentGiven?: () => void
}

export function PersonalDataConsentGate({ children, onConsentGiven }: PersonalDataConsentGateProps) {
  const [consentStatus, setConsentStatusState] = useState<'accepted' | 'declined' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Проверяем статус согласия при монтировании
    const status = getPersonalDataConsentStatus()
    setConsentStatusState(status)
    setIsLoading(false)
  }, [])

  const handleAccept = () => {
    setPersonalDataConsentStatus('accepted')
    setConsentStatusState('accepted')
    if (onConsentGiven) {
      onConsentGiven()
    }
  }

  const handleDecline = () => {
    setPersonalDataConsentStatus('declined')
    setConsentStatusState('declined')
  }

  // Показываем загрузку только при первой проверке
  if (isLoading) {
    return null
  }

  // Если согласие дано, показываем контент
  if (consentStatus === 'accepted') {
    return <>{children}</>
  }

  // Если согласие не дано или отклонено, показываем модальное окно согласия
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
              Для использования чата и отправки форм нам необходимо обрабатывать ваши персональные данные: имя, телефон, email, сообщения в чате и формах обратной связи.
            </p>
            <p>
              <strong>Обработка персональных данных:</strong> ваши данные могут обрабатываться на серверах, расположенных за пределами территории Российской Федерации (трансграничная передача данных).
            </p>
            <p>
              Подробная информация о целях обработки, сроках хранения, трансграничной передаче данных и ваших правах указана в{" "}
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
