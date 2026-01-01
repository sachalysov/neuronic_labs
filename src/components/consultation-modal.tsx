"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Send, CheckCircle } from "lucide-react"
import { submitFormData } from "@/services/form"

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Если начинается с 8, заменяем на +7
    if (value.startsWith("8")) {
      value = "+7" + value.slice(1)
    }
    // Если начинается с 9 (без +7), добавляем +7
    else if (value.match(/^9/)) {
      value = "+7" + value
    }
    // Если вводят просто 7, заменяем на +7
    else if (value === "7") {
      value = "+7"
    }
    
    setPhone(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSubmitting) return
    
    console.log('Начало отправки формы:', { name, phone, email, telegram, comment })
    
    setIsSubmitting(true)
    
    try {
      await submitFormData({
        name: name,
        phone: phone,
        email: email,
        username: telegram,
        comment: comment,
      })
      
      console.log('Форма успешно отправлена')
      setIsSubmitted(true)
      
      // Закрыть модальное окно через 3 секунды после успешной отправки
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setIsSubmitting(false)
        setName("")
        setPhone("")
        setEmail("")
        setTelegram("")
        setComment("")
      }, 3000)
    } catch (error) {
      console.error("Ошибка при отправке формы:", error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : "Не удалось отправить форму. Пожалуйста, попробуйте позже.")
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card 
        className="w-full max-w-md shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b border-border pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Оставить заявку</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">С вами сейчас свяжется менеджер</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 sm:pt-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="name" className="text-xs sm:text-sm font-medium text-foreground">
                  Полное имя <span className="text-primary">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">
                  Номер телефона <span className="text-primary">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
                  Email <span className="text-primary">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="telegram" className="text-xs sm:text-sm font-medium text-foreground">
                  Ник в Telegram <span className="text-muted-foreground text-xs">(опционально)</span>
                </label>
                <Input
                  id="telegram"
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="comment" className="text-xs sm:text-sm font-medium text-foreground">
                  Комментарий к письму <span className="text-muted-foreground text-xs">(опционально)</span>
                </label>
                <Textarea
                  id="comment"
                  placeholder="Ваш комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-sm sm:text-lg py-4 sm:py-6 mt-4 sm:mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
                <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          ) : (
            <div className="py-6 sm:py-8 text-center space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-foreground">Заявка отправлена!</h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                Наш менеджер свяжется с вами в течение 15 минут
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

