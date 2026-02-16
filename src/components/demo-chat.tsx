"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, Loader2, X, RotateCcw, Image as ImageIcon, Reply, MoreVertical } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"
import { getLocalStorage, setLocalStorage, removeLocalStorage, formatTime } from "@/lib/utils"
import { Message } from "@/lib/types"
import { ConsultationModal } from "@/components/consultation-modal"
import { VomolokoContextModal } from "@/components/vomoloko-context-modal"
import { ProtecContextModal } from "@/components/protec-context-modal"
import { CliningContextModal } from "@/components/clining-context-modal"
import { CustomContextModal } from "@/components/custom-context-modal"
import { PersonalDataConsentModal } from "@/components/personal-data-consent-modal"
import { CapabilitiesList } from "@/components/capabilities-list"
import { OptimizedImage } from "@/components/optimized-image"
import { DEMO_CHAT_INACTIVITY_TIMEOUT, DEMO_CHAT_VOMOLOKO_WEBHOOK_URL, DEMO_CHAT_PROTEC_WEBHOOK_URL, DEMO_CHAT_CLINING_WEBHOOK_URL } from "@/lib/constants"
import { getWebhookFromSettings } from "@/services/admin-settings"
import { hasPersonalDataConsent } from "@/lib/consent"

interface DemoChatProps {
  onClose?: () => void
  isMobile?: boolean
  storagePrefix?: string // Префикс для ключей localStorage, чтобы разделить хранилище для разных страниц
  linkButton1?: string // Текст первой кнопки (по умолчанию "vomoloko.ru")
  linkButton2?: string // Текст второй кнопки (по умолчанию "protec.one")
  linkButton1Webhook?: string // Webhook для первой кнопки
  linkButton2Webhook?: string // Webhook для второй кнопки
  initialMessages?: Message[] // Кастомные начальные сообщения
  linkButton1ModalContent?: string // Контент модального окна для первой кнопки
  linkButton2ModalContent?: string // Контент модального окна для второй кнопки
  linkButton1Message?: string // Сообщение для отправки при нажатии на первую кнопку (по умолчанию используется текст кнопки)
  linkButton2Message?: string // Сообщение для отправки при нажатии на вторую кнопку (по умолчанию используется текст кнопки)
  defaultBotName?: string // Имя бота по умолчанию (по умолчанию "Бот Мария")
}

const INITIAL_MESSAGE_IDS = ["1", "2"] as const

const getInitialMessages = (customMessages?: Message[]): Message[] => {
  if (customMessages) {
    return customMessages
  }
  return [
    {
      id: "1",
      text: "**Привет! Меня зовут Маша и я бот)** Просто выбери кнопку над стройкой ввода сообщения и начнем тестирование.",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Либо **назови свою нишу**, я расскажу что мы можем в ней **автоматизировать**",
      sender: "bot",
      timestamp: new Date(),
    },
  ]
}

// Вспомогательная функция для добавления пользовательского сообщения с удалением стартовых
const addUserMessage = (prevMessages: Message[], userMessage: Message): Message[] => {
  const hasUserMessages = prevMessages.some(msg => msg.sender === "user")
  if (!hasUserMessages) {
    return prevMessages.filter(msg => !INITIAL_MESSAGE_IDS.includes(msg.id as typeof INITIAL_MESSAGE_IDS[number])).concat([userMessage])
  }
  return [...prevMessages, userMessage]
}

export function DemoChat({ onClose, isMobile = false, storagePrefix = 'demo-chat', linkButton1 = 'vomoloko.ru', linkButton2 = 'protec.one', linkButton1Webhook, linkButton2Webhook, initialMessages, linkButton1ModalContent, linkButton2ModalContent, linkButton1Message, linkButton2Message, defaultBotName = 'Бот Мария' }: DemoChatProps) {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId, setSessionId] = useState(() => {
    const stored = getLocalStorage(`${storagePrefix}-session-id`)
    const lastActivity = getLocalStorage(`${storagePrefix}-last-activity`)

    // Проверяем неактивность при загрузке
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > DEMO_CHAT_INACTIVITY_TIMEOUT) {
        // Сессия истекла, очищаем и создаем новую
        removeLocalStorage(`${storagePrefix}-session-id`)
        removeLocalStorage(`${storagePrefix}-messages`)
        removeLocalStorage(`${storagePrefix}-last-activity`)
        // Очищаем информацию о разблокировке для истекшего session ID
        removeLocalStorage(`${storagePrefix}-unlocked-session-id`)
        const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        setLocalStorage(`${storagePrefix}-session-id`, newId)
        setLocalStorage(`${storagePrefix}-last-activity`, Date.now().toString())
        return newId
      }
    }

    if (stored) {
      // Обновляем время последней активности при загрузке
      setLocalStorage(`${storagePrefix}-last-activity`, Date.now().toString())
      return stored
    }
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setLocalStorage(`${storagePrefix}-session-id`, newId)
    setLocalStorage(`${storagePrefix}-last-activity`, Date.now().toString())
    return newId
  })

  // Загружаем сообщения из localStorage или используем начальные
  const [messages, setMessages] = useState<Message[]>(() => {
    const lastActivity = getLocalStorage(`${storagePrefix}-last-activity`)

    // Если сессия истекла, возвращаем начальные сообщения
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > DEMO_CHAT_INACTIVITY_TIMEOUT) {
        return getInitialMessages(initialMessages)
      }
    }

    const stored = getLocalStorage(`${storagePrefix}-messages`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      } catch (e) {
        console.error('Error parsing stored messages:', e)
      }
    }
    return getInitialMessages(initialMessages)
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string } | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  // Состояние для блокировки чата заглушкой - проверяем, был ли разблокирован для текущего session ID
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const unlockedSessionId = getLocalStorage(`${storagePrefix}-unlocked-session-id`)
    const currentSessionId = getLocalStorage(`${storagePrefix}-session-id`)
    // Если есть сохраненный разблокированный session ID и он совпадает с текущим, и есть согласие на обработку персональных данных, разблокируем
    return unlockedSessionId === currentSessionId && !!unlockedSessionId && hasPersonalDataConsent()
  })
  // Состояние для показа модального окна согласия на обработку персональных данных
  const [showPersonalDataConsent, setShowPersonalDataConsent] = useState(false)
  // Состояние для показа правил использования
  const [showRules, setShowRules] = useState(false)

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Определяем видимость кнопок: скрываем если диалог уже начат (есть пользовательские сообщения)
  const [linkButtonsVisible, setLinkButtonsVisible] = useState(() => {
    // Проверяем сохраненные сообщения
    const stored = getLocalStorage(`${storagePrefix}-messages`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Проверяем, есть ли среди сохраненных сообщений сообщения от пользователя
        const hasUserMessages = parsed.some((msg: any) => msg.sender === "user")
        // Если есть пользовательские сообщения, значит диалог начат - скрываем кнопки
        return !hasUserMessages
      } catch (e) {
        console.error('Error parsing stored messages for buttons visibility:', e)
      }
    }
    // Если нет сохраненных сообщений или ошибка парсинга - показываем кнопки
    return true
  })
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const [isVomolokoContextModalOpen, setIsVomolokoContextModalOpen] = useState(false)
  const [isProtecContextModalOpen, setIsProtecContextModalOpen] = useState(false)
  const [isCliningContextModalOpen, setIsCliningContextModalOpen] = useState(false)
  const [isCustomContextModalOpen, setIsCustomContextModalOpen] = useState(false)
  const [customContextModalContent, setCustomContextModalContent] = useState<string>("")
  // Вебхуки из админ настроек
  const [webhookVomoloko, setWebhookVomoloko] = useState<string | undefined>(undefined)
  const [webhookProtec, setWebhookProtec] = useState<string | undefined>(undefined)
  const [webhookClining, setWebhookClining] = useState<string | undefined>(undefined)
  // Храним текущий webhook URL (по умолчанию стандартный для demo)
  const [currentWebhookUrl, setCurrentWebhookUrl] = useState<string | undefined>(() => {
    const stored = getLocalStorage(`${storagePrefix}-webhook-url`)
    return stored || undefined
  })
  // Состояние для отображения кнопки результата записи для protec.one
  const [showProtecResultButton, setShowProtecResultButton] = useState(false)
  // Состояние для отображения кнопки результата заказа для vomoloko.ru
  const [showVomolokoResultButton, setShowVomolokoResultButton] = useState(false)
  // Состояние для отображения кнопки результата для клининга
  const [showCliningResultButton, setShowCliningResultButton] = useState(false)
  // Состояние для имени бота
  const [botName, setBotName] = useState(defaultBotName)
  // Состояние для отображения текста "Отвечает мгновенно"
  const [showInstantResponse, setShowInstantResponse] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleResetChatRef = useRef<(() => void) | null>(null)
  const imageUploadTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({})
  const [inputContainerHeight, setInputContainerHeight] = useState(0)

  // Функция для проверки, содержит ли сообщение фразу о записи
  const containsBookingConfirmation = (text: string | undefined | null): boolean => {
    if (!text) return false
    const lowerText = text.toLowerCase()
    return lowerText.includes('подтверждаете запись') ||
      lowerText.includes('записала!') ||
      lowerText.includes('записала') ||
      lowerText.includes('вам придет смс с подтверждением записи') ||
      lowerText.includes('оформила заказ') ||
      lowerText.includes('подтверждаете заказ') ||
      lowerText.includes('оформила!') ||
      lowerText.includes('оформила') ||
      lowerText.includes('вам придет смс с подтверждением заказа') ||
      lowerText.includes('заказ оформлен')
  }

  // Функция для проверки, содержит ли текст ссылки на изображения
  const hasImageUrlInText = (text: string): boolean => {
    if (!text) return false

    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|heic|heif|avif|tiff|tif)(\?[^\s\)]*)?/i
    const urlRegex = /(https?:\/\/[^\s\)]+)/g
    const imageIndicators = ['/image', '/img', '/photo', '/picture', '/media', '/upload', '/cdn', '/storage', '/assets', '/static']

    const urls = text.match(urlRegex)
    if (!urls) return false

    return urls.some(url => {
      return imageExtensions.test(url) || imageIndicators.some(indicator => url.toLowerCase().includes(indicator))
    })
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId]
        const target = event.target as HTMLElement

        // Проверяем, не кликнули ли на кнопку меню или само меню
        if (menuElement && !menuElement.contains(target) && !target.closest('button[title="Меню"]')) {
          setOpenMenuId(null)
        }
      }
    }

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuId])

  // Функция для обновления времени последней активности
  const updateLastActivity = useCallback(() => {
    setLocalStorage(`${storagePrefix}-last-activity`, Date.now().toString())

    // Сбрасываем таймер неактивности
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }

    // Устанавливаем новый таймер на 60 минут
    inactivityTimerRef.current = setTimeout(() => {
      // Используем актуальную функцию через ref
      if (handleResetChatRef.current) {
        handleResetChatRef.current()
      }
    }, DEMO_CHAT_INACTIVITY_TIMEOUT)
  }, [storagePrefix])

  // Функция для сброса чата
  const handleResetChat = useCallback(() => {
    // Генерируем новый sessionId
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setSessionId(newId)

    // Очищаем localStorage
    removeLocalStorage(`${storagePrefix}-session-id`)
    removeLocalStorage(`${storagePrefix}-messages`)
    removeLocalStorage(`${storagePrefix}-last-activity`)
    removeLocalStorage(`${storagePrefix}-webhook-url`)
    removeLocalStorage(`${storagePrefix}-buttons-hidden`)
    // Очищаем информацию о разблокировке для старого session ID
    removeLocalStorage(`${storagePrefix}-unlocked-session-id`)

    // Сохраняем новый sessionId и время активности
    setLocalStorage(`${storagePrefix}-session-id`, newId)
    setLocalStorage(`${storagePrefix}-last-activity`, Date.now().toString())

    // Сбрасываем сообщения на начальные
    setMessages(getInitialMessages(initialMessages))

    // Показываем кнопки со ссылками снова и удаляем флаг из localStorage
    setLinkButtonsVisible(true)
    removeLocalStorage(`${storagePrefix}-buttons-hidden`)

    // Блокируем чат снова при сбросе (новый session ID, заглушка должна появиться)
    setIsUnlocked(false)
    setShowPersonalDataConsent(false)
    setShowRules(false)

    // Сбрасываем имя бота на начальное
    setBotName(defaultBotName)
    // Восстанавливаем текст "Отвечает мгновенно"
    setShowInstantResponse(true)

    // Закрываем модальные окна консультации и контекста при сбросе
    setIsConsultationModalOpen(false)
    setIsVomolokoContextModalOpen(false)
    setIsProtecContextModalOpen(false)
    setIsCliningContextModalOpen(false)

    // Скрываем кнопки результатов при сбросе
    setShowProtecResultButton(false)
    setShowVomolokoResultButton(false)
    setShowCliningResultButton(false)

    // Сбрасываем изображение
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Сбрасываем ответ
    setReplyingTo(null)

    // Закрываем меню
    setOpenMenuId(null)

    // Сбрасываем таймеры загрузки изображений
    Object.values(imageUploadTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout))
    imageUploadTimeoutsRef.current = {}

    // Сбрасываем webhook на исходный (undefined = стандартный для demo)
    setCurrentWebhookUrl(undefined)
    removeLocalStorage(`${storagePrefix}-webhook-url`)

    // Переустанавливаем таймер неактивности для новой сессии
    updateLastActivity()
  }, [updateLastActivity, storagePrefix])

  // Очистка таймеров загрузки изображений при размонтировании
  useEffect(() => {
    return () => {
      Object.values(imageUploadTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout))
      imageUploadTimeoutsRef.current = {}
    }
  }, [])

  // Сохраняем актуальную ссылку на handleResetChat в ref
  useEffect(() => {
    handleResetChatRef.current = handleResetChat
  }, [handleResetChat])

  // Сохраняем сообщения в localStorage при каждом изменении
  useEffect(() => {
    setLocalStorage(`${storagePrefix}-messages`, JSON.stringify(messages))
    // Обновляем время активности при изменении сообщений (не сразу, чтобы избежать лишних таймеров)
    // Это будет вызываться только при реальных изменениях сообщений, не при каждом рендере
  }, [messages, storagePrefix])

  // Проверяем при загрузке и изменении сообщений/webhook, нужно ли показывать кнопку результата записи
  useEffect(() => {
    const hasConfirmationMessage = messages.some(msg =>
      msg.sender === "bot" && msg.text && containsBookingConfirmation(msg.text)
    )

    if (currentWebhookUrl === webhookProtec) {
      // Для protec.one показываем кнопку результата записи
      setShowProtecResultButton(hasConfirmationMessage)
    } else {
      setShowProtecResultButton(false)
    }

    if (currentWebhookUrl === webhookVomoloko) {
      // Для vomoloko.ru показываем кнопку результата заказа
      setShowVomolokoResultButton(hasConfirmationMessage)
    } else {
      setShowVomolokoResultButton(false)
    }

    if (currentWebhookUrl === webhookClining) {
      // Для клининга показываем кнопку результата
      setShowCliningResultButton(hasConfirmationMessage)
    } else {
      setShowCliningResultButton(false)
    }
  }, [messages, currentWebhookUrl, webhookProtec, webhookVomoloko, webhookClining])

  // Загрузка вебхуков из админ настроек при монтировании
  useEffect(() => {
    const loadWebhooks = async () => {
      try {
        const vomoloko = await getWebhookFromSettings('webhook_demo_chat_vomoloko')
        const protec = await getWebhookFromSettings('webhook_demo_chat_protec')

        // Используем вебхуки из админки, если они есть, иначе используем константы
        setWebhookVomoloko(vomoloko || DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
        setWebhookProtec(protec || DEMO_CHAT_PROTEC_WEBHOOK_URL)
        setWebhookClining(DEMO_CHAT_CLINING_WEBHOOK_URL)
      } catch (error) {
        console.error('Ошибка загрузки вебхуков:', error)
        // Используем константы при ошибке
        setWebhookVomoloko(DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
        setWebhookProtec(DEMO_CHAT_PROTEC_WEBHOOK_URL)
        setWebhookClining(DEMO_CHAT_CLINING_WEBHOOK_URL)
      }
    }

    loadWebhooks()
  }, [])

  // Инициализация таймера неактивности при монтировании и очистка при размонтировании
  useEffect(() => {
    updateLastActivity()

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
    }
  }, [updateLastActivity])

  // Функция для конвертации файла в base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Обработчик выбора файла
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    // Проверяем размер файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 5MB')
      return
    }

    try {
      const base64 = await convertImageToBase64(file)
      setSelectedImage(base64)
      // Возвращаем фокус в поле ввода, чтобы Enter отправлял сообщение
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error)
      alert('Не удалось загрузить изображение')
    }
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading || !isUnlocked) return

    const messageText = input.trim() || ""
    const imageBase64 = selectedImage || undefined

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      imageBase64: imageBase64,
      imageUploadStatus: imageBase64 ? "uploading" : undefined,
      replyToId: replyingTo?.id,
      replyToText: replyingTo?.text,
    }

    // Проверяем, есть ли уже пользовательские сообщения перед добавлением нового
    const hasExistingUserMessages = messages.some(msg => msg.sender === "user")

    setMessages((prev) => addUserMessage(prev, userMessage))
    if (imageBase64) {
      const timeout = setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, imageUploadStatus: "ready" } : msg
          )
        )
        delete imageUploadTimeoutsRef.current[userMessage.id]
      }, 5000)
      imageUploadTimeoutsRef.current[userMessage.id] = timeout
    }

    // Если это первое пользовательское сообщение, скрываем кнопки
    if (!hasExistingUserMessages && linkButtonsVisible) {
      setLinkButtonsVisible(false)
      setLocalStorage(`${storagePrefix}-buttons-hidden`, 'true')
    }
    setInput("")
    setSelectedImage(null)
    const replyToId = replyingTo?.id
    const replyToText = replyingTo?.text
    setReplyingTo(null) // Сбрасываем ответ после отправки
    // Очищаем input файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Сбрасываем высоту textarea после отправки
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)
    updateLastActivity() // Обновляем активность при отправке сообщения

    try {
      const response = await sendChatMessage(messageText, 'demo', sessionId, currentWebhookUrl, imageBase64, replyToId, replyToText)

      // Если вебхук вернул imageUrl отдельно, используем его
      // Если ссылка на изображение есть в тексте, она будет обработана formatMessageText
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
        // Используем imageUrl только если его вернул вебхук отдельно и его нет в тексте
        imageUrl: response.imageUrl && !hasImageUrlInText(response.message) ? response.imageUrl : undefined,
      }

      setMessages((prev) => [...prev, botMessage])

      // Проверяем, нужно ли показать кнопку результата записи/заказа
      if (containsBookingConfirmation(response.message)) {
        if (currentWebhookUrl === webhookProtec) {
          setShowProtecResultButton(true)
        }
        if (currentWebhookUrl === webhookVomoloko) {
          setShowVomolokoResultButton(true)
        }
      }

      updateLastActivity() // Обновляем активность при получении ответа
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Извините, произошла ошибка. Попробуйте позже."
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Обрабатываем Enter/Return для отправки сообщения
    if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Shift+Enter или Shift+Return позволяет сделать перенос строки
  }

  // Функция для показа согласия на обработку персональных данных
  const handleShowConsent = () => {
    // Проверяем, есть ли уже согласие
    if (hasPersonalDataConsent()) {
      // Если согласие уже есть, показываем правила использования
      setShowRules(true)
    } else {
      // Если согласия нет, показываем модальное окно согласия
      setShowPersonalDataConsent(true)
    }
  }

  // Функция для обработки принятия согласия на обработку персональных данных
  const handleConsentAccept = () => {
    // После принятия согласия показываем правила использования
    setShowPersonalDataConsent(false)
    setShowRules(true)
  }

  // Функция для полной разблокировки чата (после принятия правил)
  const handleUnlockChat = () => {
    setIsUnlocked(true)
    setShowRules(false)
    // Сохраняем текущий session ID как разблокированный
    setLocalStorage(`${storagePrefix}-unlocked-session-id`, sessionId)
  }

  const handleSendLink = async (link: string) => {
    if (isLoading || !isUnlocked) return

    // Скрываем кнопки сразу при нажатии и сохраняем в localStorage
    setLinkButtonsVisible(false)
    setLocalStorage(`${storagePrefix}-buttons-hidden`, 'true')

    // Если используются кастомные кнопки (не стандартные vomoloko.ru/protec.one), используем стандартную логику
    const isCustomButtons = linkButton1 !== 'vomoloko.ru' || linkButton2 !== 'protec.one'

    // Если это кнопка vomoloko.ru, переключаемся на новый webhook
    if (!isCustomButtons && link === "vomoloko.ru") {
      // Обновляем имя бота
      setBotName("Мария Во!Молоко")
      // Скрываем текст "Отвечает мгновенно"
      setShowInstantResponse(false)
      // Открываем модальное окно с контекстом
      setIsVomolokoContextModalOpen(true)

      // Используем вебхук из админ настроек или константу
      const vomolokoWebhook = webhookVomoloko || DEMO_CHAT_VOMOLOKO_WEBHOOK_URL

      // Устанавливаем новый webhook
      setCurrentWebhookUrl(vomolokoWebhook)
      setLocalStorage(`${storagePrefix}-webhook-url`, vomolokoWebhook)

      setIsLoading(true)
      updateLastActivity()

      try {
        const messageText = "Хочу сделать заказ"

        // Показываем отправленное сообщение в чате сразу
        const userMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: "user",
          timestamp: new Date(),
        }
        setMessages((prev) => addUserMessage(prev, userMessage))

        console.log('Отправка запроса на webhook:', vomolokoWebhook)
        console.log('Данные запроса:', { messageText, sessionId })

        // Отправляем фиксированное сообщение на новый webhook
        const response = await sendChatMessage(messageText, 'demo', sessionId, vomolokoWebhook)

        console.log('Ответ от webhook:', response)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
          // Используем imageUrl только если его вернул вебхук отдельно и его нет в тексте
          imageUrl: response.imageUrl && !hasImageUrlInText(response.message) ? response.imageUrl : undefined,
        }

        setMessages((prev) => [...prev, botMessage])

        // Проверяем, нужно ли показать кнопку результата заказа для vomoloko.ru
        if (containsBookingConfirmation(response.message)) {
          setShowVomolokoResultButton(true)
        }

        updateLastActivity()
      } catch (error) {
        console.error('Ошибка при отправке на webhook:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: error instanceof Error ? error.message : "Извините, произошла ошибка. Попробуйте позже.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } else if (!isCustomButtons && link === "protec.one") {
      // Обновляем имя бота
      setBotName("Мария Protec.One")
      // Скрываем текст "Отвечает мгновенно"
      setShowInstantResponse(false)
      // Открываем модальное окно с контекстом
      setIsProtecContextModalOpen(true)

      // Используем вебхук из админ настроек или константу
      const protecWebhook = webhookProtec || DEMO_CHAT_PROTEC_WEBHOOK_URL

      // Устанавливаем новый webhook
      setCurrentWebhookUrl(protecWebhook)
      setLocalStorage(`${storagePrefix}-webhook-url`, protecWebhook)

      setIsLoading(true)
      updateLastActivity()

      try {
        const messageText = "Мне нужно наклеить пленку"

        // Показываем отправленное сообщение в чате сразу
        const userMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: "user",
          timestamp: new Date(),
        }
        setMessages((prev) => addUserMessage(prev, userMessage))

        console.log('Отправка запроса на webhook:', protecWebhook)
        console.log('Данные запроса:', { messageText, sessionId })

        // Отправляем фиксированное сообщение на новый webhook
        const response = await sendChatMessage(messageText, 'demo', sessionId, protecWebhook)

        console.log('Ответ от webhook:', response)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
          // Используем imageUrl только если его вернул вебхук отдельно и его нет в тексте
          imageUrl: response.imageUrl && !hasImageUrlInText(response.message) ? response.imageUrl : undefined,
        }

        setMessages((prev) => [...prev, botMessage])

        // Проверяем, нужно ли показать кнопку результата записи для protec.one
        if (containsBookingConfirmation(response.message)) {
          setShowProtecResultButton(true)
        }

        updateLastActivity()
      } catch (error) {
        console.error('Ошибка при отправке на webhook:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: error instanceof Error ? error.message : "Извините, произошла ошибка. Попробуйте позже.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } else if (!isCustomButtons && link === "Клининг") {
      setBotName("Мария Клининг")
      setShowInstantResponse(false)
      setIsCliningContextModalOpen(true)

      const cliningWebhook = webhookClining || DEMO_CHAT_CLINING_WEBHOOK_URL
      setCurrentWebhookUrl(cliningWebhook)
      setLocalStorage(`${storagePrefix}-webhook-url`, cliningWebhook)

      setIsLoading(true)
      updateLastActivity()

      try {
        const messageText = "Мне нужна уборка помещения"
        const userMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: "user",
          timestamp: new Date(),
        }
        setMessages((prev) => addUserMessage(prev, userMessage))

        const response = await sendChatMessage(messageText, 'demo', sessionId, cliningWebhook)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
          imageUrl: response.imageUrl && !hasImageUrlInText(response.message) ? response.imageUrl : undefined,
        }
        setMessages((prev) => [...prev, botMessage])

        // Проверяем, нужно ли показать кнопку результата для клининга
        if (containsBookingConfirmation(response.message)) {
          setShowCliningResultButton(true)
        }

        updateLastActivity()
      } catch (error) {
        console.error('Ошибка при отправке на webhook:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: error instanceof Error ? error.message : "Извините, произошла ошибка. Попробуйте позже.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } else {
      // Проверяем, есть ли кастомный webhook для этой кнопки
      let webhookToUse = currentWebhookUrl
      if (link === linkButton1 && linkButton1Webhook) {
        webhookToUse = linkButton1Webhook
        setCurrentWebhookUrl(linkButton1Webhook)
        setLocalStorage(`${storagePrefix}-webhook-url`, linkButton1Webhook)
        // Показываем кастомное модальное окно, если есть контент
        if (linkButton1ModalContent) {
          setCustomContextModalContent(linkButton1ModalContent)
          setIsCustomContextModalOpen(true)
        }
      } else if (link === linkButton2 && linkButton2Webhook) {
        webhookToUse = linkButton2Webhook
        setCurrentWebhookUrl(linkButton2Webhook)
        setLocalStorage(`${storagePrefix}-webhook-url`, linkButton2Webhook)
        // Показываем кастомное модальное окно, если есть контент
        if (linkButton2ModalContent) {
          setCustomContextModalContent(linkButton2ModalContent)
          setIsCustomContextModalOpen(true)
        }
      }

      // Определяем сообщение для отправки: используем кастомное сообщение, если указано, иначе текст кнопки
      let messageToSend = link
      if (link === linkButton1 && linkButton1Message) {
        messageToSend = linkButton1Message
      } else if (link === linkButton2 && linkButton2Message) {
        messageToSend = linkButton2Message
      }

      // Для других ссылок используем стандартную логику
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageToSend,
        sender: "user",
        timestamp: new Date(),
      }

      // Проверяем, есть ли уже пользовательские сообщения перед добавлением нового
      const hasExistingUserMessages = messages.some(msg => msg.sender === "user")

      setMessages((prev) => addUserMessage(prev, userMessage))

      // Если это первое пользовательское сообщение, скрываем кнопки
      if (!hasExistingUserMessages && linkButtonsVisible) {
        setLinkButtonsVisible(false)
        setLocalStorage(`${storagePrefix}-buttons-hidden`, 'true')
      }
      setIsLoading(true)
      updateLastActivity()

      try {
        const response = await sendChatMessage(messageToSend, 'demo', sessionId, webhookToUse)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
          // Используем imageUrl только если его вернул вебхук отдельно и его нет в тексте
          imageUrl: response.imageUrl && !hasImageUrlInText(response.message) ? response.imageUrl : undefined,
        }

        setMessages((prev) => [...prev, botMessage])

        // Проверяем, нужно ли показать кнопку результата записи/заказа
        if (containsBookingConfirmation(response.message)) {
          if (currentWebhookUrl === webhookProtec) {
            setShowProtecResultButton(true)
          }
          if (currentWebhookUrl === webhookVomoloko) {
            setShowVomolokoResultButton(true)
          }
          if (currentWebhookUrl === webhookClining) {
            setShowCliningResultButton(true)
          }
        }

        updateLastActivity()
      } catch (error) {
        const errorText = error instanceof Error ? error.message : "Извините, произошла ошибка. Попробуйте позже."
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorText,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Измерение высоты контейнера ввода для мобильных устройств
  useEffect(() => {
    if (!isMobile || !inputContainerRef.current) return

    const updateHeight = () => {
      if (inputContainerRef.current) {
        const height = inputContainerRef.current.offsetHeight
        setInputContainerHeight(height)
      }
    }

    // Измеряем высоту при монтировании и изменениях
    updateHeight()

    // Используем ResizeObserver для отслеживания изменений высоты
    const resizeObserver = new ResizeObserver(updateHeight)
    if (inputContainerRef.current) {
      resizeObserver.observe(inputContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [isMobile, linkButtonsVisible, showProtecResultButton, showVomolokoResultButton, showCliningResultButton, messages.length, selectedImage])

  // Прокрутка к полю ввода при фокусе на мобильных устройствах
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined') return

    const input = inputRef.current
    if (!input) return

    const scrollToInput = () => {
      if (inputContainerRef.current) {
        // Используем visualViewport для точного позиционирования
        if (window.visualViewport) {
          const viewport = window.visualViewport
          const inputRect = inputContainerRef.current.getBoundingClientRect()
          const viewportHeight = viewport.height

          // Если поле ввода находится ниже видимой области (закрыто клавиатурой)
          if (inputRect.bottom > viewportHeight) {
            inputContainerRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
          }
        } else {
          // Fallback для браузеров без visualViewport
          inputContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
        }
      }
    }

    const handleFocus = () => {
      // Даем клавиатуре время открыться, затем прокручиваем
      setTimeout(scrollToInput, 300)
    }

    const handleViewportResize = () => {
      if (document.activeElement === input) {
        scrollToInput()
      }
    }

    input.addEventListener('focus', handleFocus)

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize)
    }

    return () => {
      input.removeEventListener('focus', handleFocus)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize)
      }
    }
  }, [isMobile])

  return (
    <>
      <Card className={`w-full ${isMobile ? 'h-full max-h-full' : 'max-w-[717px]'} ${isMobile ? '' : 'mx-auto'} ${isMobile ? '' : 'shadow-2xl'} border-gray-200 bg-white ${isMobile ? 'rounded-none border-0' : ''} ${isMobile ? 'flex flex-col h-full' : ''} relative`}>
        <CardHeader className={`border-b border-gray-200 bg-white backdrop-blur ${isMobile ? 'flex-shrink-0' : ''}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <OptimizedImage src="/images/bot-mariya.png" alt={`Аватар ИИ-ассистента ${botName}`} className="w-full h-full object-cover" loading="eager" sizes="48px" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{botName}</h3>
                <p className="text-sm text-gray-600">
                  Онлайн{showInstantResponse && " • Отвечает мгновенно"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "sm"}
                onClick={handleResetChat}
                className="hover:bg-gray-100 hover:text-black flex-shrink-0 text-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Начать сначала</span>}
              </Button>
              {isMobile && onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 flex-shrink-0"
                >
                  <X className="h-5 w-5 text-gray-900" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className={`p-0 ${isMobile ? 'flex flex-col flex-1 min-h-0 overflow-hidden' : ''}`}>
          <div
            ref={messagesContainerRef}
            className={`relative ${isMobile ? 'flex-1 min-h-0 overflow-y-auto' : 'h-[500px]'} ${isMobile ? '' : 'overflow-y-auto'} p-6 space-y-4 bg-gray-50`}
            style={isMobile ? { paddingBottom: `${inputContainerHeight}px` } : undefined}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group`}>
                <div className={`max-w-[75%] relative`}>
                  <div
                    className={`rounded-2xl px-5 py-3 relative ${message.sender === "user" ? "bg-white border border-gray-200 text-gray-900" : "bg-white border border-gray-200 text-gray-900"
                      }`}
                  >
                    {/* Меню с тремя точками */}
                    <div className="absolute z-10" style={isMobile ? { top: '1px', right: '-10px' } : { top: '8px', right: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === message.id ? null : message.id)
                        }}
                        className={`${isMobile ? 'p-2 min-h-[44px] min-w-[44px]' : 'p-1'} rounded touch-manipulation cursor-pointer`}
                        title="Меню"
                      >
                        <MoreVertical className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-gray-500`} />
                      </button>
                      {/* Выпадающее меню */}
                      {openMenuId === message.id && (
                        <div
                          ref={(el) => { menuRefs.current[message.id] = el }}
                          className={`absolute ${isMobile ? 'right-0 top-12' : 'right-0 top-8'} bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${isMobile ? 'min-w-[140px]' : 'min-w-[120px]'}`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setReplyingTo({ id: message.id, text: message.text || '' })
                              setOpenMenuId(null)
                              inputRef.current?.focus()
                            }}
                            className={`w-full text-left ${isMobile ? 'px-4 py-3 text-base min-h-[44px]' : 'px-4 py-2 text-sm'} hover:bg-gray-100 active:bg-gray-200 flex items-center gap-2 touch-manipulation`}
                          >
                            <Reply className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                            Ответить
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Цитата сообщения, на которое отвечают */}
                    {message.replyToId && message.replyToText && (
                      <div className="mb-2 pl-3 border-l-4 border-blue-500">
                        <div className="text-xs text-blue-500 mb-1">
                          В ответ {message.sender === "user" ? "боту" : "вам"}
                        </div>
                        <div className="text-xs text-gray-700 line-clamp-2">
                          {message.replyToText.length > 100
                            ? message.replyToText.substring(0, 100) + '...'
                            : message.replyToText}
                        </div>
                      </div>
                    )}
                    {/* Отображаем изображение отдельно только если оно не встроено в текст */}
                    {(message.imageUrl || message.imageBase64) && !hasImageUrlInText(message.text || '') && (
                      <div className="mb-2">
                        {message.imageUploadStatus === "uploading" ? (
                          <div className="relative inline-block">
                            <img
                              src={message.imageUrl || message.imageBase64 || ''}
                              alt="Загружаемое изображение в чате"
                              className="max-w-full max-h-64 rounded-lg object-contain blur-sm"
                            />
                            <div className="absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                              <span className="ml-2 text-xs text-gray-600">Загрузка изображения...</span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={message.imageUrl || message.imageBase64 || ''}
                            alt={`Изображение в сообщении от ${message.sender === 'bot' ? botName : 'пользователя'}`}
                            className="max-w-full max-h-64 rounded-lg object-contain"
                          />
                        )}
                      </div>
                    )}
                    {message.text && (
                      <div className={`text-sm leading-relaxed ${isMobile ? 'pr-8' : 'pr-8'}`} style={{ wordBreak: 'break-word' }}>{formatMessageText(message.text)}</div>
                    )}
                    <p className={`text-xs mt-2 text-gray-500`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Заглушка с размытым фоном и кнопкой - только над областью сообщений */}
            {!isUnlocked && !showRules && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center px-6">
                  <Button
                    onClick={handleShowConsent}
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Попробуй ИИ продавца прямо сейчас
                  </Button>
                </div>
              </div>
            )}

            {/* Второй overlay с правилами использования - показывается после согласия на обработку персональных данных */}
            {!isUnlocked && showRules && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <div className="text-center px-6 max-w-md">
                  <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Правила использования</h3>
                    <div className="text-sm text-gray-700 space-y-2 text-left">
                      <p>• Назови свою нишу и я расскажу что мы можем в ней автоматизировать</p>
                      <p>• Либо протестируй ИИ-продавца нажав на любую кнопку над строкой ввода</p>
                      <p>• Ознакомься с контекстом сайта в появившемся окне</p>
                      <p>• Чтобы начать сначала, используй кнопку "Начать сначала" в шапке чата</p>
                    </div>
                    <Button
                      onClick={handleUnlockChat}
                      size="lg"
                      className="w-full mt-6 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Начать
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            ref={inputContainerRef}
            className={`${isMobile ? 'px-4 pt-4' : 'p-4'} border-t border-gray-200 bg-white backdrop-blur ${isMobile ? 'fixed bottom-0 left-0 right-0 z-10' : ''}`}
            style={isMobile ? {
              paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
            } : undefined}
          >
            {linkButtonsVisible && (
              <div className="flex flex-wrap gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSendLink(linkButton1)}
                  disabled={isLoading || !isUnlocked}
                  className="flex-1 min-w-0 text-xs sm:text-sm whitespace-normal break-words h-auto py-2 px-2"
                >
                  {linkButton1}
                </Button>
                {linkButton2 !== 'protec.one' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSendLink(linkButton2)}
                    disabled={isLoading || !isUnlocked}
                    className="flex-1 min-w-0 text-xs sm:text-sm whitespace-normal break-words h-auto py-2 px-2"
                  >
                    {linkButton2}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSendLink("Клининг")}
                  disabled={isLoading || !isUnlocked}
                  className="flex-1 min-w-0 text-xs sm:text-sm whitespace-normal break-words h-auto py-2 px-2"
                >
                  Клининг
                </Button>
              </div>
            )}
            {showProtecResultButton && (
              <div className="mb-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1O_TP4AiIH260OTCiHESVTSyWiZm2GAGHTzRiEcRYq5w/edit?gid=0#gid=0', '_blank')}
                  className="w-full text-sm py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Показать результат записи в таблице
                </Button>
              </div>
            )}
            {showVomolokoResultButton && (
              <div className="mb-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1DFPTgFBKTW28z-eF6yW_O_d5KexInIZUGLp_AJS8UtY/edit?usp=sharing', '_blank')}
                  className="w-full text-sm py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Посмотреть результаты в таблице
                </Button>
              </div>
            )}
            {showCliningResultButton && (
              <div className="mb-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1BH-XYLDFXMPxcR2ffP6tKdBow_QGM4e6ZTJGGLPoUXQ/edit?usp=sharing', '_blank')}
                  className="w-full text-sm py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Показать результаты в таблице
                </Button>
              </div>
            )}
            {messages.length >= 8 && (
              <div className="mb-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full text-sm py-2"
                >
                  Заказать внедрение бота
                </Button>
              </div>
            )}
            {replyingTo && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200 relative">
                <div className="pl-3 border-l-4 border-blue-500">
                  <div className="text-xs text-blue-500 mb-1">
                    В ответ
                  </div>
                  <div className="text-xs text-gray-700 line-clamp-2">
                    {replyingTo.text.length > 100
                      ? replyingTo.text.substring(0, 100) + '...'
                      : replyingTo.text}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyingTo(null)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full hover:bg-gray-200 text-black"
                >
                  <X className="h-3 w-3 text-black" />
                </Button>
              </div>
            )}
            {selectedImage && (
              <div className="mb-2 relative inline-block">
                <img
                  src={selectedImage}
                  alt="Предпросмотр изображения перед отправкой в чат"
                  className="max-w-full max-h-32 rounded-lg object-contain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedImage(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
                const target = e.target as HTMLElement
                // Если фокус не в textarea, не даем Enter открыть загрузчик
                if (!(target instanceof HTMLTextAreaElement)) {
                  e.preventDefault()
                  handleSend()
                }
              }
            }}
              className="flex gap-2 items-start"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !isUnlocked}
                className="shrink-0 h-[44px] w-[44px]"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите нам свой вопрос..."
                className="flex-1 bg-white border-gray-200 text-gray-900 min-h-[44px] max-h-[120px] resize-none text-[16px] sm:text-sm py-3"
                rows={1}
                disabled={!isUnlocked}
              />
              <Button type="submit" disabled={isLoading || (!input.trim() && !selectedImage) || !isUnlocked} size="icon" className="shrink-0 h-[44px] w-[44px]">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardContent>
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
        />
        <VomolokoContextModal
          isOpen={isVomolokoContextModalOpen}
          onClose={() => setIsVomolokoContextModalOpen(false)}
        />
        <ProtecContextModal
          isOpen={isProtecContextModalOpen}
          onClose={() => setIsProtecContextModalOpen(false)}
        />
        <CliningContextModal
          isOpen={isCliningContextModalOpen}
          onClose={() => setIsCliningContextModalOpen(false)}
        />
        <CustomContextModal
          isOpen={isCustomContextModalOpen}
          onClose={() => setIsCustomContextModalOpen(false)}
          contextText={customContextModalContent}
        />
        <PersonalDataConsentModal
          isOpen={showPersonalDataConsent}
          onClose={() => setShowPersonalDataConsent(false)}
          onAccept={handleConsentAccept}
        />
      </Card>

      {/* Выпадающий список возможностей */}
      <CapabilitiesList />
    </>
  )
}

