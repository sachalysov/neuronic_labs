"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, Loader2, X, RotateCcw, Image as ImageIcon } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"
import { getLocalStorage, setLocalStorage, removeLocalStorage, formatTime } from "@/lib/utils"
import { Message } from "@/lib/types"
import { ConsultationModal } from "@/components/consultation-modal"
import { VomolokoContextModal } from "@/components/vomoloko-context-modal"
import { ProtecContextModal } from "@/components/protec-context-modal"
import { CapabilitiesList } from "@/components/capabilities-list"
import { DEMO_CHAT_INACTIVITY_TIMEOUT, DEMO_CHAT_VOMOLOKO_WEBHOOK_URL, DEMO_CHAT_PROTEC_WEBHOOK_URL } from "@/lib/constants"
import { getWebhookFromSettings } from "@/services/admin-settings"

interface DemoChatProps {
  onClose?: () => void
  isMobile?: boolean
}

const INITIAL_MESSAGE_IDS = ["1", "2"] as const

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    text: "**Привет! Меня зовут Маша и я бот)** Просто выбери кнопку над стройкой ввода сообщения и начнем тестирование.",
    sender: "bot",
    timestamp: new Date(),
  },
  {
    id: "2",
    text: "**Либо добавь в чат ссылку на свой сайт** и протестируй то как будет работать ИИ-продавец на твоем сайте. Но есть небольшая пометка, если на выбранном сайте стоит проверка от роботов, я не смогу его проанализировать, так что жмите -**Начать сначала**- и пробуйте другой",
    sender: "bot",
    timestamp: new Date(),
  },
]

// Вспомогательная функция для добавления пользовательского сообщения с удалением стартовых
const addUserMessage = (prevMessages: Message[], userMessage: Message): Message[] => {
  const hasUserMessages = prevMessages.some(msg => msg.sender === "user")
  if (!hasUserMessages) {
    return prevMessages.filter(msg => !INITIAL_MESSAGE_IDS.includes(msg.id as typeof INITIAL_MESSAGE_IDS[number])).concat([userMessage])
  }
  return [...prevMessages, userMessage]
}

export function DemoChat({ onClose, isMobile = false }: DemoChatProps) {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId, setSessionId] = useState(() => {
    const stored = getLocalStorage('demo-chat-session-id')
    const lastActivity = getLocalStorage('demo-chat-last-activity')
    
    // Проверяем неактивность при загрузке
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > DEMO_CHAT_INACTIVITY_TIMEOUT) {
        // Сессия истекла, очищаем и создаем новую
        removeLocalStorage('demo-chat-session-id')
        removeLocalStorage('demo-chat-messages')
        removeLocalStorage('demo-chat-last-activity')
        const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        setLocalStorage('demo-chat-session-id', newId)
        setLocalStorage('demo-chat-last-activity', Date.now().toString())
        return newId
      }
    }
    
    if (stored) {
      // Обновляем время последней активности при загрузке
      setLocalStorage('demo-chat-last-activity', Date.now().toString())
      return stored
    }
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setLocalStorage('demo-chat-session-id', newId)
    setLocalStorage('demo-chat-last-activity', Date.now().toString())
    return newId
  })
  
  // Загружаем сообщения из localStorage или используем начальные
  const [messages, setMessages] = useState<Message[]>(() => {
    const lastActivity = getLocalStorage('demo-chat-last-activity')
    
    // Если сессия истекла, возвращаем начальные сообщения
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > DEMO_CHAT_INACTIVITY_TIMEOUT) {
        return getInitialMessages()
      }
    }
    
    const stored = getLocalStorage('demo-chat-messages')
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
    return getInitialMessages()
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Состояние для блокировки чата заглушкой (всегда заблокирован при загрузке)
  const [isUnlocked, setIsUnlocked] = useState(false)
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
    const stored = getLocalStorage('demo-chat-messages')
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
  // Вебхуки из админ настроек
  const [webhookVomoloko, setWebhookVomoloko] = useState<string | undefined>(undefined)
  const [webhookProtec, setWebhookProtec] = useState<string | undefined>(undefined)
  // Храним текущий webhook URL (по умолчанию стандартный для demo)
  const [currentWebhookUrl, setCurrentWebhookUrl] = useState<string | undefined>(() => {
    const stored = getLocalStorage('demo-chat-webhook-url')
    return stored || undefined
  })
  // Состояние для отображения кнопки результата записи для protec.one
  const [showProtecResultButton, setShowProtecResultButton] = useState(false)
  // Состояние для отображения кнопки результата заказа для vomoloko.ru
  const [showVomolokoResultButton, setShowVomolokoResultButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleResetChatRef = useRef<(() => void) | null>(null)

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

  // Функция для обновления времени последней активности
  const updateLastActivity = useCallback(() => {
    setLocalStorage('demo-chat-last-activity', Date.now().toString())
    
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
  }, [])

  // Функция для сброса чата
  const handleResetChat = useCallback(() => {
    // Генерируем новый sessionId
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setSessionId(newId)
    
    // Очищаем localStorage
    removeLocalStorage('demo-chat-session-id')
    removeLocalStorage('demo-chat-messages')
    removeLocalStorage('demo-chat-last-activity')
    removeLocalStorage('demo-chat-webhook-url')
    removeLocalStorage('demo-chat-buttons-hidden')
    
    // Сохраняем новый sessionId и время активности
    setLocalStorage('demo-chat-session-id', newId)
    setLocalStorage('demo-chat-last-activity', Date.now().toString())
    
    // Сбрасываем сообщения на начальные
    setMessages(getInitialMessages())
    
    // Показываем кнопки со ссылками снова и удаляем флаг из localStorage
    setLinkButtonsVisible(true)
    removeLocalStorage('demo-chat-buttons-hidden')
    
    // Блокируем чат снова при сбросе
    setIsUnlocked(false)
    setShowRules(false)
    
    // Закрываем модальные окна консультации и контекста при сбросе
    setIsConsultationModalOpen(false)
    setIsVomolokoContextModalOpen(false)
    setIsProtecContextModalOpen(false)
    
    // Скрываем кнопки результатов при сбросе
    setShowProtecResultButton(false)
    setShowVomolokoResultButton(false)
    
    // Сбрасываем изображение
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    // Сбрасываем webhook на исходный (undefined = стандартный для demo)
    setCurrentWebhookUrl(undefined)
    removeLocalStorage('demo-chat-webhook-url')
    
    // Переустанавливаем таймер неактивности для новой сессии
    updateLastActivity()
  }, [updateLastActivity])

  // Сохраняем актуальную ссылку на handleResetChat в ref
  useEffect(() => {
    handleResetChatRef.current = handleResetChat
  }, [handleResetChat])

  // Сохраняем сообщения в localStorage при каждом изменении
  useEffect(() => {
    setLocalStorage('demo-chat-messages', JSON.stringify(messages))
    // Обновляем время активности при изменении сообщений (не сразу, чтобы избежать лишних таймеров)
    // Это будет вызываться только при реальных изменениях сообщений, не при каждом рендере
  }, [messages])

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
  }, [messages, currentWebhookUrl, webhookProtec, webhookVomoloko])

  // Загрузка вебхуков из админ настроек при монтировании
  useEffect(() => {
    const loadWebhooks = async () => {
      try {
        const vomoloko = await getWebhookFromSettings('webhook_demo_chat_vomoloko')
        const protec = await getWebhookFromSettings('webhook_demo_chat_protec')
        
        // Используем вебхуки из админки, если они есть, иначе используем константы
        setWebhookVomoloko(vomoloko || DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
        setWebhookProtec(protec || DEMO_CHAT_PROTEC_WEBHOOK_URL)
      } catch (error) {
        console.error('Ошибка загрузки вебхуков:', error)
        // Используем константы при ошибке
        setWebhookVomoloko(DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
        setWebhookProtec(DEMO_CHAT_PROTEC_WEBHOOK_URL)
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
    }

    // Проверяем, есть ли уже пользовательские сообщения перед добавлением нового
    const hasExistingUserMessages = messages.some(msg => msg.sender === "user")
    
    setMessages((prev) => addUserMessage(prev, userMessage))
    
    // Если это первое пользовательское сообщение, скрываем кнопки
    if (!hasExistingUserMessages && linkButtonsVisible) {
      setLinkButtonsVisible(false)
      setLocalStorage('demo-chat-buttons-hidden', 'true')
    }
    setInput("")
    setSelectedImage(null)
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
      const response = await sendChatMessage(messageText, 'demo', sessionId, currentWebhookUrl, imageBase64)

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

  // Функция для показа правил использования
  const handleShowRules = () => {
    setShowRules(true)
  }

  // Функция для полной разблокировки чата
  const handleUnlockChat = () => {
    setIsUnlocked(true)
    setShowRules(false)
  }

  const handleSendLink = async (link: string) => {
    if (isLoading || !isUnlocked) return

    // Скрываем кнопки сразу при нажатии и сохраняем в localStorage
    setLinkButtonsVisible(false)
    setLocalStorage('demo-chat-buttons-hidden', 'true')

    // Если это кнопка vomoloko.ru, переключаемся на новый webhook
    if (link === "vomoloko.ru") {
      // Открываем модальное окно с контекстом
      setIsVomolokoContextModalOpen(true)
      
      // Используем вебхук из админ настроек или константу
      const vomolokoWebhook = webhookVomoloko || DEMO_CHAT_VOMOLOKO_WEBHOOK_URL
      
      // Устанавливаем новый webhook
      setCurrentWebhookUrl(vomolokoWebhook)
      setLocalStorage('demo-chat-webhook-url', vomolokoWebhook)
      
      setIsLoading(true)
      updateLastActivity()

      try {
        const messageText = "У меня есть пара вопросов"
        
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
    } else if (link === "protec.one") {
      // Открываем модальное окно с контекстом
      setIsProtecContextModalOpen(true)
      
      // Используем вебхук из админ настроек или константу
      const protecWebhook = webhookProtec || DEMO_CHAT_PROTEC_WEBHOOK_URL
      
      // Устанавливаем новый webhook
      setCurrentWebhookUrl(protecWebhook)
      setLocalStorage('demo-chat-webhook-url', protecWebhook)
      
      setIsLoading(true)
      updateLastActivity()

      try {
        const messageText = "У меня есть пара вопросов"
        
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
    } else {
      // Для других ссылок используем стандартную логику
      const userMessage: Message = {
        id: Date.now().toString(),
        text: link,
        sender: "user",
        timestamp: new Date(),
      }

      // Проверяем, есть ли уже пользовательские сообщения перед добавлением нового
      const hasExistingUserMessages = messages.some(msg => msg.sender === "user")
      
      setMessages((prev) => addUserMessage(prev, userMessage))
      
      // Если это первое пользовательское сообщение, скрываем кнопки
      if (!hasExistingUserMessages && linkButtonsVisible) {
        setLinkButtonsVisible(false)
        setLocalStorage('demo-chat-buttons-hidden', 'true')
      }
      setIsLoading(true)
      updateLastActivity()

      try {
        const response = await sendChatMessage(link, 'demo', sessionId, currentWebhookUrl)

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
    <Card className={`w-full ${isMobile ? 'h-full max-h-full' : 'max-w-[717px]'} ${isMobile ? '' : 'mx-auto'} ${isMobile ? '' : 'shadow-2xl'} border-gray-200 bg-white ${isMobile ? 'rounded-none border-0' : ''} ${isMobile ? 'flex flex-col' : ''} relative`}>
      <CardHeader className={`border-b border-gray-200 bg-white backdrop-blur ${isMobile ? 'flex-shrink-0' : ''}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <img src="/images/robot-transparent.png" alt="AI" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Бот Мария</h3>
              <p className="text-sm text-gray-600">Онлайн • Отвечает мгновенно</p>
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
      <CardContent className={`p-0 ${isMobile ? 'flex flex-col flex-1 min-h-0' : ''}`}>
        <div ref={messagesContainerRef} className={`relative ${isMobile ? 'flex-1 min-h-0' : 'h-[500px]'} overflow-y-auto p-6 space-y-4 bg-gray-50`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.sender === "user" ? "bg-white border border-gray-200 text-gray-900" : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                {/* Отображаем изображение отдельно только если оно не встроено в текст */}
                {(message.imageUrl || message.imageBase64) && !hasImageUrlInText(message.text || '') && (
                  <div className="mb-2">
                    <img
                      src={message.imageUrl || message.imageBase64 || ''}
                      alt="Изображение"
                      className="max-w-full max-h-64 rounded-lg object-contain"
                    />
                  </div>
                )}
                {message.text && (
                  <div className="text-sm leading-relaxed">{formatMessageText(message.text)}</div>
                )}
                <p className={`text-xs mt-2 text-gray-500`}>
                  {formatTime(message.timestamp)}
                </p>
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
                  onClick={handleShowRules}
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Попробуй ИИ продавца прямо сейчас
                </Button>
              </div>
            </div>
          )}
          
          {/* Второй overlay с правилами использования - едва размытый */}
          {!isUnlocked && showRules && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="text-center px-6 max-w-md">
                <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Правила использования</h3>
                  <div className="text-sm text-gray-700 space-y-2 text-left">
                    <p>• Добавь в чат ссылку на свой сайт и протестируй работу ИИ-продавца</p>
                    <p>• Либо используй готовый вариант с кнопок над строкой ввода</p>
                    <p>• Чтобы начать сначала, используй кнопку "Начать сначала" в шапке чата</p>
                    <p>• Ознакомься с контекстом сайта, указанного в кнопке</p>
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
          className={`p-4 border-t border-gray-200 bg-white backdrop-blur ${isMobile ? 'flex-shrink-0' : ''}`}
        >
          {linkButtonsVisible && (
            <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSendLink("vomoloko.ru")}
              disabled={isLoading || !isUnlocked}
              className="flex-1 text-xs sm:text-sm whitespace-normal break-words h-auto py-2 px-2"
            >
              vomoloko.ru
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSendLink("protec.one")}
              disabled={isLoading || !isUnlocked}
              className="flex-1 text-sm"
            >
              protec.one
            </Button>
            </div>
          )}
          {showProtecResultButton && (
            <div className="mb-2">
              <Button
                type="button"
                variant="default"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/1O_TP4AiIH260OTCiHESVTSyWiZm2GAGHTzRiEcRYq5w/edit?gid=0#gid=0', '_blank')}
                className="w-full text-sm py-2"
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
                className="w-full text-sm py-2"
              >
                Посмотреть результаты в таблице
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
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img
                src={selectedImage}
                alt="Предпросмотр"
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
            className="flex gap-2 items-end"
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
              className="shrink-0"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите нам свой вопрос..."
              className="flex-1 bg-white border-gray-200 text-gray-900 min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              disabled={!isUnlocked}
            />
            <Button type="submit" disabled={isLoading || (!input.trim() && !selectedImage) || !isUnlocked} size="icon" className="shrink-0">
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
    </Card>
    
    {/* Выпадающий список возможностей */}
    <CapabilitiesList />
    </>
  )
}

