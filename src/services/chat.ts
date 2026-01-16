// Client-side chat service to replace Next.js server action
import { getWebhookFromSettings } from './admin-settings'

type ChatType = 'widget' | 'demo'

export async function sendChatMessage(
  messageText: string, 
  chatType: ChatType = 'widget',
  sessionId: string,
  customWebhookUrl?: string,
  imageBase64?: string
): Promise<{ message: string; imageUrl?: string }> {
  try {
    // Если передан кастомный webhook, используем его
    let webhookUrl = customWebhookUrl
    
    if (!webhookUrl) {
      // Пытаемся получить вебхук из админ настроек
      if (chatType === 'widget') {
        webhookUrl = await getWebhookFromSettings('webhook_widget_chat')
      } else {
        webhookUrl = await getWebhookFromSettings('webhook_demo_chat')
      }
      
      // Если вебхук не настроен в админке, используем значения по умолчанию из env или хардкод
      if (!webhookUrl) {
        webhookUrl = chatType === 'widget' 
          ? (import.meta.env.VITE_WIDGET_WEBHOOK_URL || 'https://n8n.alexlysov.ru/webhook/bc12fe55-7a98-4d81-b4ec-d3d74650e28a/chat')
          : (import.meta.env.VITE_DEMO_WEBHOOK_URL || 'https://n8n.alexlysov.ru/webhook/b74adb23-9f9b-4b80-8dc3-7a2fe09e980e/chat')
      }
    }

    if (!webhookUrl) {
      console.warn(`Webhook URL for ${chatType} not configured. Using mock response.`)
      // Mock response for development
      return {
        message: `Спасибо за ваш вопрос: "${messageText}". ИИ-продавец обрабатывает ваш запрос. Для полной функциональности настройте ${chatType === 'widget' ? 'VITE_WIDGET_WEBHOOK_URL' : 'VITE_DEMO_WEBHOOK_URL'} в .env файле.`
      }
    }

    const requestBody: any = {
      message: messageText,
      sessionId: sessionId, // Уникальный идентификатор сессии
      timestamp: new Date().toISOString(),
      chatType: chatType, // Добавляем тип чата для различения на бэкенде
    }
    
    // Добавляем изображение если оно есть
    if (imageBase64) {
      requestBody.image = imageBase64
    }
    
    console.log('Отправка запроса на webhook:', webhookUrl)
    console.log('Тело запроса:', { ...requestBody, image: imageBase64 ? '[base64 image]' : undefined })
    
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
      message: data.response || data.message || data.text || data.output || JSON.stringify(data) || "Извините, не удалось получить ответ",
      imageUrl: data.imageUrl || data.image || data.image_url
    }
  } catch (err) {
    console.error(`Chat service error (${chatType}):`, err)
    
    // Обработка различных типов сетевых ошибок
    if (err instanceof TypeError) {
      if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
        throw new Error("Проблема с подключением к серверу. Проверьте интернет-соединение и попробуйте позже.")
      }
      if (err.message.includes('DNS') || err.message.includes('dns')) {
        throw new Error("Не удалось найти сервер. Возможно, проблема с DNS или сервер временно недоступен.")
      }
    }
    
    // Если ошибка уже является Error с понятным сообщением, пробрасываем её
    if (err instanceof Error && err.message.includes('Webhook returned status')) {
      throw err
    }
    
    // Общая ошибка для остальных случаев
    throw new Error("Не удалось связаться с сервером. Пожалуйста, попробуйте позже.")
  }
}

