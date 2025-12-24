"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, X } from "lucide-react"
import { sendChatMessage } from "@/app/actions/chat"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "ИИ-продавец - это умный чат-бот",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Мультиканален - это когда контент сайта подстраивается под языковые запросы пользователя. Ясная? Доступна Инфа. Идем? Доступна Инфа.",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "ИИ-продавец, это умный чат-бот на базе нейросети, который ведет полноценное продающее диалоги с вашими лидами 24/7. Это значит, что даже ночью ваша система с настроении обрабатывая сотруднии, который консультирует, закрывает возражения",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
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
      const botResponseText = await sendChatMessage(userMessage.text)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
      console.error("[v0] Error sending message:", err)
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
    <div className="fixed bottom-8 right-8 w-[380px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between rounded-t-2xl">
        <h3 className="font-semibold text-lg">Добро пожаловать в чат!</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/20">
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
                  message.sender === "user" ? "bg-muted" : "bg-primary"
                }`}
              >
                <span className="text-sm font-semibold">{message.sender === "user" ? "👤" : "🤖"}</span>
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-muted text-foreground rounded-tr-sm"
                    : "bg-primary text-primary-foreground rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-slide-in-left">
            <div className="flex items-start gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tl-sm">
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
            placeholder="Напишите нам свой вопрос..."
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
