"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, Loader2, X, RotateCcw } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"
import { getLocalStorage, setLocalStorage, removeLocalStorage, formatTime } from "@/lib/utils"
import { Message } from "@/lib/types"
import { ConsultationModal } from "@/components/consultation-modal"

interface DemoChatProps {
  onClose?: () => void
  isMobile?: boolean
}

const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 60 минут в миллисекундах

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    text: "Добавь в чат ссылку на свой сайт и протестируй то как будет работать ИИ-продавец на твоей нише",
    sender: "bot",
    timestamp: new Date(),
  },
  {
    id: "2",
    text: "Так же можешь описать свою нишу, ответь всего на пару вопросов:\n 1. Какая твоя ниша?\n2. Топ 3 твоих продукта?\n3. Опиши кратко преимущества твоего продукта",
    sender: "bot",
    timestamp: new Date(),
  },
]

export function DemoChat({ onClose, isMobile = false }: DemoChatProps) {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId, setSessionId] = useState(() => {
    const stored = getLocalStorage('demo-chat-session-id')
    const lastActivity = getLocalStorage('demo-chat-last-activity')
    
    // Проверяем неактивность при загрузке
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
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
      if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
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
  const [linkButtonsVisible, setLinkButtonsVisible] = useState(true)
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleResetChatRef = useRef<(() => void) | null>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Функция для сброса чата
  const handleResetChat = useCallback(() => {
    // Генерируем новый sessionId
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setSessionId(newId)
    
    // Очищаем localStorage
    removeLocalStorage('demo-chat-session-id')
    removeLocalStorage('demo-chat-messages')
    removeLocalStorage('demo-chat-last-activity')
    
    // Сохраняем новый sessionId и время активности
    setLocalStorage('demo-chat-session-id', newId)
    setLocalStorage('demo-chat-last-activity', Date.now().toString())
    
    // Сбрасываем сообщения на начальные
    setMessages(getInitialMessages())
    
    // Показываем кнопки со ссылками снова
    setLinkButtonsVisible(true)
    
    // Закрываем модальное окно консультации при сбросе
    setIsConsultationModalOpen(false)
    
    // Сбрасываем таймер неактивности
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (handleResetChatRef.current) {
        handleResetChatRef.current()
      }
    }, INACTIVITY_TIMEOUT)
  }, [])

  // Сохраняем ссылку на функцию в ref
  useEffect(() => {
    handleResetChatRef.current = handleResetChat
  }, [handleResetChat])

  // Функция для обновления времени последней активности
  const updateLastActivity = useCallback(() => {
    setLocalStorage('demo-chat-last-activity', Date.now().toString())
    
    // Сбрасываем таймер неактивности
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Устанавливаем новый таймер на 60 минут
    inactivityTimerRef.current = setTimeout(() => {
      if (handleResetChatRef.current) {
        handleResetChatRef.current()
      }
    }, INACTIVITY_TIMEOUT)
  }, [])

  // Сохраняем сообщения в localStorage при каждом изменении
  useEffect(() => {
    setLocalStorage('demo-chat-messages', JSON.stringify(messages))
    // Обновляем время активности при изменении сообщений
    updateLastActivity()
  }, [messages, updateLastActivity])

  // Инициализация таймера неактивности при монтировании
  useEffect(() => {
    updateLastActivity()
    
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [updateLastActivity])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    updateLastActivity() // Обновляем активность при отправке сообщения

    try {
      const response = await sendChatMessage(input, 'demo', sessionId)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      updateLastActivity() // Обновляем активность при получении ответа
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Извините, произошла ошибка. Попробуйте позже.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSendLink = async (link: string) => {
    if (isLoading) return

    // Скрываем кнопки после выбора ссылки
    setLinkButtonsVisible(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: link,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    updateLastActivity()

    try {
      const response = await sendChatMessage(link, 'demo', sessionId)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      updateLastActivity()
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Извините, произошла ошибка. Попробуйте позже.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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
              <h3 className="text-lg font-bold text-gray-900">ИИ-продавец NEURONIC LABS</h3>
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
                className="flex-1 text-sm"
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
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите нам свой вопрос..."
              className="flex-1 bg-white border-gray-200 text-gray-900"
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
    </Card>
  )
}

