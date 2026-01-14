"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, Loader2, X, RotateCcw } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"
import { getLocalStorage, setLocalStorage, removeLocalStorage, formatTime } from "@/lib/utils"
import { Message } from "@/lib/types"
import { ConsultationModal } from "@/components/consultation-modal"
import { VomolokoContextModal } from "@/components/vomoloko-context-modal"
import { ProtecContextModal } from "@/components/protec-context-modal"
import { DEMO_CHAT_INACTIVITY_TIMEOUT, DEMO_CHAT_VOMOLOKO_WEBHOOK_URL, DEMO_CHAT_PROTEC_WEBHOOK_URL } from "@/lib/constants"

interface DemoChatProps {
  onClose?: () => void
  isMobile?: boolean
}

const INITIAL_MESSAGE_IDS = ["1", "2"] as const

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    text: "**Добавь в чат ссылку на свой сайт** и протестируй то как будет работать ИИ-продавец на твоей сайте",
    sender: "bot",
    timestamp: new Date(),
  },
  {
    id: "2",
    text: "**Либо используй готовый вариант**\n\n 1.  Кнопки над строкой это выбор готового бота, который грамотно настроен, **идеальный пример**\n 2.  Что бы начать сначала, в шапке чата есть значок **Начать сначала**\n3.  Ознакомься с контекстом сайта указанного в кнопке, окно с контекстом появится само.",
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

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])
  
  // Определяем видимость кнопок: показываем всегда, кроме случая когда были явно скрыты
  const [linkButtonsVisible, setLinkButtonsVisible] = useState(() => {
    // Проверяем, были ли кнопки скрыты ранее (только если пользователь нажал на одну из них)
    const buttonsHidden = getLocalStorage('demo-chat-buttons-hidden')
    // Показываем кнопки всегда, если они не были явно скрыты пользователем
    return buttonsHidden !== 'true'
  })
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const [isVomolokoContextModalOpen, setIsVomolokoContextModalOpen] = useState(false)
  const [isProtecContextModalOpen, setIsProtecContextModalOpen] = useState(false)
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
  const containsBookingConfirmation = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return lowerText.includes('подтверждаете запись') || 
           lowerText.includes('записала!') || 
           lowerText.includes('записала') ||
           lowerText.includes('вам придет смс с подтверждением записи') ||
           lowerText.includes('оформила заказ')
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
    
    // Закрываем модальные окна консультации и контекста при сбросе
    setIsConsultationModalOpen(false)
    setIsVomolokoContextModalOpen(false)
    setIsProtecContextModalOpen(false)
    
    // Скрываем кнопки результатов при сбросе
    setShowProtecResultButton(false)
    setShowVomolokoResultButton(false)
    
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
      msg.sender === "bot" && containsBookingConfirmation(msg.text)
    )

    if (currentWebhookUrl === DEMO_CHAT_PROTEC_WEBHOOK_URL) {
      // Для protec.one показываем кнопку результата записи
      setShowProtecResultButton(hasConfirmationMessage)
    } else {
      setShowProtecResultButton(false)
    }

    if (currentWebhookUrl === DEMO_CHAT_VOMOLOKO_WEBHOOK_URL) {
      // Для vomoloko.ru показываем кнопку результата заказа
      setShowVomolokoResultButton(hasConfirmationMessage)
    } else {
      setShowVomolokoResultButton(false)
    }
  }, [messages, currentWebhookUrl])

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => addUserMessage(prev, userMessage))
    setInput("")
    // Сбрасываем высоту textarea после отправки
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)
    updateLastActivity() // Обновляем активность при отправке сообщения

    try {
      const response = await sendChatMessage(messageText, 'demo', sessionId, currentWebhookUrl)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      
      // Проверяем, нужно ли показать кнопку результата записи/заказа
      if (containsBookingConfirmation(response.message)) {
        if (currentWebhookUrl === DEMO_CHAT_PROTEC_WEBHOOK_URL) {
          setShowProtecResultButton(true)
        }
        if (currentWebhookUrl === DEMO_CHAT_VOMOLOKO_WEBHOOK_URL) {
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Shift+Enter или Shift+Return на macOS позволяет сделать перенос строки
  }

  const handleSendLink = async (link: string) => {
    if (isLoading) return

    // Скрываем кнопки сразу при нажатии и сохраняем в localStorage
    setLinkButtonsVisible(false)
    setLocalStorage('demo-chat-buttons-hidden', 'true')

    // Если это кнопка vomoloko.ru, переключаемся на новый webhook
    if (link === "vomoloko.ru") {
      // Открываем модальное окно с контекстом
      setIsVomolokoContextModalOpen(true)
      
      // Устанавливаем новый webhook
      setCurrentWebhookUrl(DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
      setLocalStorage('demo-chat-webhook-url', DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
      
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
        
        console.log('Отправка запроса на webhook:', DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)
        console.log('Данные запроса:', { messageText, sessionId })
        
        // Отправляем фиксированное сообщение на новый webhook
        const response = await sendChatMessage(messageText, 'demo', sessionId, DEMO_CHAT_VOMOLOKO_WEBHOOK_URL)

        console.log('Ответ от webhook:', response)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        
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
      
      // Устанавливаем новый webhook
      setCurrentWebhookUrl(DEMO_CHAT_PROTEC_WEBHOOK_URL)
      setLocalStorage('demo-chat-webhook-url', DEMO_CHAT_PROTEC_WEBHOOK_URL)
      
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
        
        console.log('Отправка запроса на webhook:', DEMO_CHAT_PROTEC_WEBHOOK_URL)
        console.log('Данные запроса:', { messageText, sessionId })
        
        // Отправляем фиксированное сообщение на новый webhook
        const response = await sendChatMessage(messageText, 'demo', sessionId, DEMO_CHAT_PROTEC_WEBHOOK_URL)

        console.log('Ответ от webhook:', response)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
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
      // Для других кнопок (protec.one) используем стандартную логику
      const userMessage: Message = {
        id: Date.now().toString(),
        text: link,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => addUserMessage(prev, userMessage))
      setIsLoading(true)
      updateLastActivity()

      try {
        const response = await sendChatMessage(link, 'demo', sessionId, currentWebhookUrl)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        
        // Проверяем, нужно ли показать кнопку результата записи/заказа
        if (containsBookingConfirmation(response.message)) {
          if (currentWebhookUrl === DEMO_CHAT_PROTEC_WEBHOOK_URL) {
            setShowProtecResultButton(true)
          }
          if (currentWebhookUrl === DEMO_CHAT_VOMOLOKO_WEBHOOK_URL) {
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
    <Card className={`w-full ${isMobile ? 'h-full max-h-full' : 'max-w-[717px]'} mx-auto shadow-2xl border-gray-200 bg-white ${isMobile ? 'rounded-none' : ''} ${isMobile ? 'flex flex-col' : ''}`}>
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
        <div ref={messagesContainerRef} className={`${isMobile ? 'flex-1 min-h-0' : 'h-[500px]'} overflow-y-auto p-6 space-y-4 bg-gray-50`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="text-sm leading-relaxed">{formatMessageText(message.text)}</div>
                <p className={`text-xs mt-2 ${message.sender === "user" ? "text-primary-foreground/70" : "text-gray-500"}`}>
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
                disabled={isLoading}
                className="flex-1 text-xs sm:text-sm whitespace-normal break-words h-auto py-2 px-2"
              >
                vomoloko.ru
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSendLink("protec.one")}
                disabled={isLoading}
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
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2 items-end"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите нам свой вопрос..."
              className="flex-1 bg-white border-gray-200 text-gray-900 min-h-[44px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="shrink-0">
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
  )
}

