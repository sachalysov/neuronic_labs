"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { getPersonalDataConsentStatus, setPersonalDataConsentStatus } from "@/lib/consent"

interface PersonalDataConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function PersonalDataConsentModal({ isOpen, onClose, onAccept }: PersonalDataConsentModalProps) {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleAccept = () => {
    setIsProcessing(true)
    setPersonalDataConsentStatus('accepted')
    setIsProcessing(false)
    onAccept()
    onClose()
  }

  const handleDecline = () => {
    setIsProcessing(true)
    setPersonalDataConsentStatus('declined')
    setIsProcessing(false)
    onClose()
  }

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
              Для использования чата нам необходимо обрабатывать ваши персональные данные.
            </p>
            <p>
              <strong>Персональные данные:</strong> имя, телефон, email, сообщения в чате.
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
            <Button 
              onClick={handleAccept} 
              className="flex-1"
              disabled={isProcessing}
            >
              Принять
            </Button>
            <Button 
              onClick={handleDecline} 
              variant="outline" 
              className="flex-1"
              disabled={isProcessing}
            >
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
