import { useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PhoneInput } from "@/components/ui/phone-input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Send, CheckCircle } from "lucide-react"
import { useContactForm } from "@/hooks/useContactForm"

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  /** Предзаполняет поле "Комментарий" при открытии модалки */
  initialComment?: string
}

export function ConsultationModal({ isOpen, onClose, initialComment }: ConsultationModalProps) {
  const {
    name, phone, email, telegram, comment,
    isSubmitted, isSubmitting, submitError, consentAccepted, errors,
    handleNameChange, handlePhoneChange, handleCommentChange, handleTelegramChange,
    handleSubmit, setConsentAccepted, setSelectedCountry, setEmail, reset, setComment,
  } = useContactForm({ onSuccess: () => setTimeout(onClose, 3000) })

  useEffect(() => {
    if (!isOpen) { reset(); return }
    if (initialComment) setComment(initialComment)
  }, [isOpen, initialComment, reset, setComment])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!isOpen) return null

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
                  Имя <span className="text-primary">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={name}
                  onChange={handleNameChange}
                  required
                  className={`bg-background border-border text-sm sm:text-base ${errors.name ? 'border-destructive' : ''}`}
                  style={{ fontSize: '15px' }}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">
                  Номер телефона <span className="text-primary">*</span>
                </label>
                <PhoneInput
                  value={phone}
                  onChange={handlePhoneChange}
                  onCountryChange={setSelectedCountry}
                  placeholder=" (___) ___-__-__"
                  required
                  error={errors.phone}
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
                  style={{ fontSize: '15px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="telegram" className="text-xs sm:text-sm font-medium text-foreground">
                  Ник в Telegram
                </label>
                <Input
                  id="telegram"
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={handleTelegramChange}
                  className="bg-background border-border text-sm sm:text-base"
                  style={{ fontSize: '15px' }}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="comment" className="text-xs sm:text-sm font-medium text-foreground">
                  Комментарий к письму <span className="text-muted-foreground text-xs">(макс. 1500 символов)</span>
                </label>
                <Textarea
                  id="comment"
                  placeholder="Ваш комментарий..."
                  value={comment}
                  onChange={handleCommentChange}
                  className={`bg-background border-border text-sm sm:text-base ${errors.comment ? 'border-destructive' : ''}`}
                  style={{ fontSize: '15px' }}
                  rows={3}
                  maxLength={1500}
                  aria-invalid={errors.comment ? 'true' : 'false'}
                />
                <div className="flex justify-between items-center">
                  {errors.comment && (
                    <p className="text-xs text-destructive">{errors.comment}</p>
                  )}
                  <p className={`text-xs ml-auto ${comment.length > 1500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {comment.length}/1500
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={consentAccepted}
                    onCheckedChange={(checked) => setConsentAccepted(checked === true)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs sm:text-sm text-foreground cursor-pointer leading-relaxed"
                  >
                    Я согласен(а) на обработку персональных данных в соответствии с{" "}
                    <Link to="/politika-konfidentsialnosti" className="text-primary hover:underline">
                      Политикой конфиденциальности
                    </Link>
                    {" "}*
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-destructive">{errors.consent}</p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {submitError}
                </p>
              )}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-sm sm:text-lg py-4 sm:py-6 mt-4 sm:mt-6"
                disabled={isSubmitting || !consentAccepted}
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
                <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
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
