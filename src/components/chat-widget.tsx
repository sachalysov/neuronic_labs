"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, X, RotateCcw, Loader2, Image as ImageIcon } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"
import { getLocalStorage, setLocalStorage, removeLocalStorage, formatTime } from "@/lib/utils"
import { Message } from "@/lib/types"
import { TelegramLink } from "@/components/telegram-link"

const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 60 минут в миллисекундах

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    text: "Ответим моментально на любой вопрос",
    sender: "bot",
    timestamp: new Date(),
  },
]

export function ChatWidget() {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId, setSessionId] = useState(() => {
    const stored = getLocalStorage('chat-widget-session-id')
    const lastActivity = getLocalStorage('chat-widget-last-activity')

    // Проверяем неактивность при загрузке
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
        // Сессия истекла, очищаем и создаем новую
        removeLocalStorage('chat-widget-session-id')
        removeLocalStorage('chat-widget-messages')
        removeLocalStorage('chat-widget-last-activity')
        const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        setLocalStorage('chat-widget-session-id', newId)
        setLocalStorage('chat-widget-last-activity', Date.now().toString())
        return newId
      }
    }

    if (stored) {
      // Обновляем время последней активности при загрузке
      setLocalStorage('chat-widget-last-activity', Date.now().toString())
      return stored
    }
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setLocalStorage('chat-widget-session-id', newId)
    setLocalStorage('chat-widget-last-activity', Date.now().toString())
    return newId
  })

  const [isOpen, setIsOpen] = useState(false)
  // Загружаем сообщения из localStorage или используем начальные
  const [messages, setMessages] = useState<Message[]>(() => {
    const lastActivity = getLocalStorage('chat-widget-last-activity')

    // Если сессия истекла, возвращаем начальные сообщения
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity, 10)
      const now = Date.now()
      if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
        return getInitialMessages()
      }
    }

    const stored = getLocalStorage('chat-widget-messages')
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
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleResetChatRef = useRef<(() => void) | null>(null)
  const imageUploadTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Функция для конвертации файла в base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Обработчик выбора изображения
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 5MB')
      return
    }

    try {
      const base64 = await convertImageToBase64(file)
      setSelectedImage(base64)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error)
      alert('Не удалось загрузить изображение')
    }
  }

  // Функция для сброса чата
  const handleResetChat = useCallback(() => {
    // Генерируем новый sessionId
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setSessionId(newId)

    // Очищаем localStorage
    removeLocalStorage('chat-widget-session-id')
    removeLocalStorage('chat-widget-messages')
    removeLocalStorage('chat-widget-last-activity')

    // Сохраняем новый sessionId и время активности
    setLocalStorage('chat-widget-session-id', newId)
    setLocalStorage('chat-widget-last-activity', Date.now().toString())

    // Сбрасываем сообщения на начальные
    setMessages(getInitialMessages())

    // Сбрасываем изображение
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Сбрасываем таймеры загрузки изображений
    Object.values(imageUploadTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout))
    imageUploadTimeoutsRef.current = {}

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
    setLocalStorage('chat-widget-last-activity', Date.now().toString())

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
    setLocalStorage('chat-widget-messages', JSON.stringify(messages))
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

  // Очистка таймеров загрузки изображений при размонтировании
  useEffect(() => {
    return () => {
      Object.values(imageUploadTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout))
      imageUploadTimeoutsRef.current = {}
    }
  }, [])

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [inputValue])

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return

    const messageText = inputValue.trim() || ""
    const imageBase64 = selectedImage || undefined

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      imageBase64: imageBase64,
      imageUploadStatus: imageBase64 ? "uploading" : undefined,
    }

    setMessages((prev) => [...prev, userMessage])

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

    setInputValue("")
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Сбрасываем высоту textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)
    setError(null)
    updateLastActivity()

    try {
      const response = await sendChatMessage(messageText, 'widget', sessionId, undefined, imageBase64)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
        imageUrl: response.imageUrl || undefined,
      }

      setMessages((prev) => [...prev, botMessage])
      updateLastActivity()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        <TelegramLink />
        {/* Chat Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform"
          size="icon"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
      <TelegramLink />
      {/* Chat Widget */}
      <div className="w-[380px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border p-4 sm:p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src="/images/bot-mariya.png" alt="AI" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Мария</h3>
              <p className="text-sm text-muted-foreground">Онлайн</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetChat}
              className="hover:bg-secondary flex-shrink-0"
              title="Начать сначала"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-secondary flex-shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                } animate-slide-in-${message.sender === "user" ? "right" : "left"}`}
            >
              <div
                className={`max-w-[85%]`}
              >
                <div
                  className={`p-3 rounded-2xl ${message.sender === "user"
                    ? "bg-muted/50 text-foreground rounded-tr-sm"
                    : "bg-primary/50 text-primary-foreground rounded-tl-sm"
                    }`}
                >
                  {/* Отображение изображения */}
                  {(message.imageUrl || message.imageBase64) && (
                    <div className="mb-2">
                      {message.imageUploadStatus === "uploading" ? (
                        <div className="relative inline-block">
                          <img
                            src={message.imageUrl || message.imageBase64 || ''}
                            alt="Изображение"
                            className="max-w-full max-h-48 rounded-lg object-contain blur-sm"
                          />
                          <div className="absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                            <span className="ml-2 text-xs text-gray-600">Загрузка...</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={message.imageUrl || message.imageBase64 || ''}
                          alt="Изображение"
                          className="max-w-full max-h-48 rounded-lg object-contain"
                        />
                      )}
                    </div>
                  )}
                  {message.text && (
                    <div className="text-sm leading-relaxed">{formatMessageText(message.text)}</div>
                  )}
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-foreground/70" : "text-primary-foreground/70"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-slide-in-left">
              <div className="bg-primary/50 text-primary-foreground p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          {error && <div className="text-center text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img
                src={selectedImage}
                alt="Предпросмотр"
                className="max-w-full max-h-24 rounded-lg object-contain"
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
          <div className="flex items-end gap-2">
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
              disabled={isLoading}
              className="shrink-0 h-[40px] w-[40px]"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите свой вопрос..."
              disabled={isLoading}
              className="flex-1 bg-secondary border-border min-h-[40px] max-h-[120px] resize-none text-sm py-2"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && !selectedImage) || isLoading}
              className="shrink-0 h-[40px] w-[40px]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

