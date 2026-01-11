// Client-side chat service to replace Next.js server action
type ChatType = 'widget' | 'demo'

export async function sendChatMessage(
  messageText: string, 
  chatType: ChatType = 'widget',
  sessionId: string,
  customWebhookUrl?: string
): Promise<{ message: string }> {
  try {
    // Если передан кастомный webhook, используем его
    const webhookUrl = customWebhookUrl || (
      chatType === 'widget' 
        ? (import.meta.env.VITE_WIDGET_WEBHOOK_URL || 'https://n8n.alexlysov.ru/webhook/bc12fe55-7a98-4d81-b4ec-d3d74650e28a/chat')
        : 'https://n8n.alexlysov.ru/webhook/b74adb23-9f9b-4b80-8dc3-7a2fe09e980e/chat'
    )

    if (!webhookUrl) {
      console.warn(`Webhook URL for ${chatType} not configured. Using mock response.`)
      // Mock response for development
      return {
        message: `Спасибо за ваш вопрос: "${messageText}". ИИ-продавец обрабатывает ваш запрос. Для полной функциональности настройте ${chatType === 'widget' ? 'VITE_WIDGET_WEBHOOK_URL' : 'VITE_DEMO_WEBHOOK_URL'} в .env файле.`
      }
    }

    const requestBody = {
      message: messageText,
      sessionId: sessionId, // Уникальный идентификатор сессии
      timestamp: new Date().toISOString(),
      chatType: chatType, // Добавляем тип чата для различения на бэкенде
    }
    
    console.log('Отправка запроса на webhook:', webhookUrl)
    console.log('Тело запроса:', requestBody)
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Статус ответа:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('Ошибка ответа webhook:', errorText)
      throw new Error(`Webhook returned status ${response.status}: ${errorText || response.statusText}`)
    }

    const data = await response.json()
    
    console.log('Webhook response:', data)

    // Parse response based on common formats
    return {
      message: data.response || data.message || data.text || data.output || JSON.stringify(data) || "Извините, не удалось получить ответ"
    }
  } catch (err) {
    console.error(`Chat service error (${chatType}):`, err)
    throw new Error("Не удалось связаться с сервером. Пожалуйста, попробуйте позже.")
  }
}

