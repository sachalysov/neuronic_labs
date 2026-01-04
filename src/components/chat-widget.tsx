"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, X } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { formatMessageText } from "@/lib/text-formatter"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// Вспомогательная функция для безопасной работы с localStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Игнорируем ошибки (например, переполнение хранилища)
  }
}

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function ChatWidget() {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId] = useState(() => {
    const stored = getLocalStorage('chat-widget-session-id')
    if (stored) return stored
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    setLocalStorage('chat-widget-session-id', newId)
    return newId
  })
  
  const [isOpen, setIsOpen] = useState(false)
  // Загружаем сообщения из localStorage или используем начальные
  const [messages, setMessages] = useState<Message[]>(() => {
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
    return [
      {
        id: "1",
        text: "Ответим моментально на любой вопрос",
        sender: "bot",
        timestamp: new Date(),
      },
    ]
  })
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Сохраняем сообщения в localStorage при каждом изменении
  useEffect(() => {
    setLocalStorage('chat-widget-messages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage(userMessage.text, 'widget', sessionId)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
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
    )
  }

  return (
    <div className="fixed bottom-8 right-8 w-[380px] h-[600px] bg-card/10 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-destructive/10 border-b border-destructive/30 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-2xl sm:text-3xl">💬</div>
          <h3 className="font-semibold text-lg">Добро пожаловать в чат!</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-destructive/20 flex-shrink-0">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } animate-slide-in-${message.sender === "user" ? "right" : "left"}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user" ? "bg-muted/50" : "bg-primary/50"
                }`}
              >
                <span className="text-sm font-semibold">{message.sender === "user" ? "👤" : "🤖"}</span>
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-muted/50 text-foreground rounded-tr-sm"
                    : "bg-primary/50 text-primary-foreground rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{formatMessageText(message.text)}</p>
                <p className={`text-xs mt-2 ${message.sender === "user" ? "text-foreground/70" : "text-primary-foreground/70"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-slide-in-left">
            <div className="flex items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
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
          </div>
        )}
        {error && <div className="text-center text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите свой вопрос..."
            disabled={isLoading}
            className="flex-1 bg-secondary border-border"
          />
          <Button size="icon" variant="ghost" className="flex-shrink-0" disabled>
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

