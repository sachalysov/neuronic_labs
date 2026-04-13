import { useState, useCallback } from "react"
import { submitFormData } from "@/services/form"
import { validatePhone, validateName, validateComment, CIS_COUNTRIES, type Country } from "@/lib/phone-validation"

export interface ContactFormFields {
  name: string
  phone: string
  email: string
  telegram: string
  comment: string
  consentAccepted: boolean
  selectedCountry: Country
  errors: {
    name?: string
    phone?: string
    comment?: string
    consent?: string
  }
  isSubmitted: boolean
  isSubmitting: boolean
}

export interface ContactFormActions {
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePhoneChange: (value: string) => void
  handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleTelegramChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setConsentAccepted: (value: boolean) => void
  setSelectedCountry: (country: Country) => void
  setEmail: (value: string) => void
  setComment: (value: string) => void
  reset: () => void
}

interface UseContactFormOptions {
  /** Дополнительные поля, передаваемые при отправке */
  extraComment?: string
  /** Задержка сброса формы после успешной отправки, мс */
  resetDelay?: number
  onSuccess?: () => void
}

function clearFieldError(
  field: keyof ContactFormFields["errors"],
  setErrors: React.Dispatch<React.SetStateAction<ContactFormFields["errors"]>>
) {
  setErrors(prev => {
    const next = { ...prev }
    delete next[field]
    return next
  })
}

export function useContactForm(options: UseContactFormOptions = {}): ContactFormFields & ContactFormActions {
  const { extraComment, resetDelay = 5000, onSuccess } = options

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentAccepted, _setConsentAccepted] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(CIS_COUNTRIES[0])
  const [errors, setErrors] = useState<ContactFormFields["errors"]>({})

  // Публичная обёртка над _setConsentAccepted — автоматически снимает ошибку при выдаче согласия
  const setConsentAccepted = useCallback((value: boolean) => {
    _setConsentAccepted(value)
    if (value) {
      setErrors(prev => { const n = { ...prev }; delete n.consent; return n })
    }
  }, [])

  const reset = useCallback(() => {
    setName("")
    setPhone("")
    setEmail("")
    setTelegram("")
    setComment("")
    _setConsentAccepted(false)
    setIsSubmitted(false)
    setIsSubmitting(false)
    setErrors({})
    setSelectedCountry(CIS_COUNTRIES[0])
  }, [])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (!value) { clearFieldError("name", setErrors); return }
    const v = validateName(value)
    if (!v.valid) {
      setErrors(prev => ({ ...prev, name: v.error }))
    } else {
      clearFieldError("name", setErrors)
    }
  }, [])

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value)
    if (!value || value === selectedCountry.dialCode) {
      clearFieldError("phone", setErrors)
      return
    }
    const v = validatePhone(value, selectedCountry)
    if (!v.valid) {
      setErrors(prev => ({ ...prev, phone: v.error }))
    } else {
      clearFieldError("phone", setErrors)
    }
  }, [selectedCountry])

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setComment(value)
    if (!value) { clearFieldError("comment", setErrors); return }
    const v = validateComment(value, 1500)
    if (!v.valid) {
      setErrors(prev => ({ ...prev, comment: v.error }))
    } else {
      clearFieldError("comment", setErrors)
    }
  }, [])

  const handleTelegramChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTelegram(value && !value.startsWith("@") ? "@" + value : value)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nameV = validateName(name)
    const phoneV = validatePhone(phone, selectedCountry)
    const commentV = validateComment(comment, 1500)

    const newErrors: ContactFormFields["errors"] = {}
    if (!nameV.valid) newErrors.name = nameV.error
    if (!phoneV.valid) newErrors.phone = phoneV.error
    if (!commentV.valid) newErrors.comment = commentV.error
    if (!consentAccepted) newErrors.consent = "Необходимо согласие на обработку персональных данных"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await submitFormData({
        name,
        phone,
        email,
        username: telegram,
        comment: extraComment ? `${extraComment} ${comment}`.trim() : comment,
      })

      setIsSubmitted(true)
      onSuccess?.()

      setTimeout(() => {
        reset()
      }, resetDelay)
    } catch (error) {
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : "Не удалось отправить форму. Пожалуйста, попробуйте позже.")
    }
  }, [isSubmitting, name, phone, selectedCountry, comment, consentAccepted, email, telegram, extraComment, resetDelay, onSuccess, reset])

  return {
    name, phone, email, telegram, comment,
    isSubmitted, isSubmitting, consentAccepted, selectedCountry, errors,
    handleNameChange, handlePhoneChange, handleCommentChange, handleTelegramChange,
    handleSubmit,
    setConsentAccepted,
    setSelectedCountry, setEmail, setComment, reset,
  }
}
