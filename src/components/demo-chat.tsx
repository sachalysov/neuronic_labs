"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import { sendChatMessage } from "@/services/chat"
import { parseMarkdown } from "@/lib/markdown-parser"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function DemoChat() {
  // Генерируем уникальный sessionId при монтировании компонента
  const [sessionId] = useState(() => 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9))
  
  const [messages, setMessages] = useState<Message[]>([
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
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    try {
      const response = await sendChatMessage(input, 'demo', sessionId)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
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

  return (
    <Card className="w-full max-w-[717px] mx-auto shadow-2xl border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-200 bg-white backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <img src="/images/robot-transparent.png" alt="AI" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">ИИ-продавец NEURONIC LABS</h3>
            <p className="text-sm text-gray-600">Онлайн • Отвечает мгновенно</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={messagesContainerRef} className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{parseMarkdown(message.text)}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white backdrop-blur">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите нам свой вопрос..."
              disabled={isLoading}
              className="flex-1 bg-white border-gray-200 text-gray-900"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="shrink-0">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

