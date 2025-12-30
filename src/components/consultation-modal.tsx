"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Send, CheckCircle } from "lucide-react"

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь можно добавить отправку данных на сервер
    console.log({ phone, email, telegram })
    setIsSubmitted(true)
    
    // Закрыть модальное окно через 3 секунды после успешной отправки
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
      setPhone("")
      setEmail("")
      setTelegram("")
    }, 3000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Оставить заявку</h3>
              <p className="text-sm text-muted-foreground mt-1">С вами сейчас свяжется менеджер</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Номер телефона <span className="text-primary">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email <span className="text-primary">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telegram" className="text-sm font-medium text-foreground">
                  Ник в Telegram <span className="text-muted-foreground">(опционально)</span>
                </label>
                <Input
                  id="telegram"
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <Button type="submit" size="lg" className="w-full text-lg py-6 mt-6">
                Отправить заявку
                <Send className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-foreground">Заявка отправлена!</h4>
              <p className="text-muted-foreground">
                Наш менеджер свяжется с вами в течение 15 минут
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

