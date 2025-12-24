// Client-side chat service to replace Next.js server action
export async function sendChatMessage(messageText: string): Promise<{ message: string }> {
  try {
    const webhookUrl = import.meta.env.VITE_CHAT_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('Webhook URL not configured. Using mock response.')
      // Mock response for development
      return {
        message: `Спасибо за ваш вопрос: "${messageText}". ИИ-продавец обрабатывает ваш запрос. Для полной функциональности настройте VITE_CHAT_WEBHOOK_URL в .env файле.`
      }
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`)
    }

    const data = await response.json()

    // Parse response based on common formats
    return {
      message: data.response || data.message || data.text || "Извините, не удалось получить ответ"
    }
  } catch (err) {
    console.error('Chat service error:', err)
    throw new Error("Не удалось связаться с сервером. Пожалуйста, попробуйте позже.")
  }
}

