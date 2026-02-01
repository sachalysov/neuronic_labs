import { getWebhookFromSettings } from './admin-settings'

export interface FormData {
  name: string
  phone: string
  email: string
  username: string
  comment?: string
}

export async function submitFormData(formData: FormData): Promise<void> {
  // Пытаемся получить вебхук из админ настроек
  let webhookUrl = await getWebhookFromSettings('webhook_form')
  
  // Если вебхук не настроен в админке, используем значение по умолчанию из env или хардкод
  if (!webhookUrl) {
    webhookUrl = import.meta.env.VITE_FORM_WEBHOOK_URL || 'https://n8n.alexlysov.ru/webhook/contact'
  }
  
  const payload = {
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    username: formData.username,
    comment: formData.comment || "",
  }

  console.log('Отправка данных формы:', { webhookUrl, payload })

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log('Ответ от вебхука:', { status: response.status, statusText: response.statusText })

    if (!response.ok) {
      const raw = await response.text().catch(() => '')
      let errorText = raw
      try {
        if (raw.trim()) {
          const errorData = JSON.parse(raw)
          errorText = errorData.message || raw
        }
      } catch {
        // оставляем errorText = raw
      }
      if (response.status === 404) {
        throw new Error("Вебхук не найден. Убедитесь, что workflow активирован в n8n.")
      }
      console.error('Ошибка ответа:', errorText)
      throw new Error(`Ошибка сервера (${response.status}): ${errorText || response.statusText}`)
    }

    const raw = await response.text().catch(() => '')
    if (raw.trim()) {
      try {
        const data = JSON.parse(raw)
        console.log('Данные ответа:', data)
      } catch {
        console.log('Ответ не JSON, это нормально для вебхуков')
      }
    }

    console.log('Форма успешно отправлена в n8n')
  } catch (err) {
    console.error('Ошибка при отправке формы:', err)
    
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error("Не удалось подключиться к серверу. Проверьте подключение к интернету или обратитесь к администратору.")
    }
    
    if (err instanceof Error) {
      // Если это уже наша ошибка, просто пробрасываем её
      if (err.message.includes('Не удалось')) {
        throw err
      }
      throw new Error(`Ошибка при отправке: ${err.message}`)
    }
    
    throw new Error("Не удалось отправить форму. Пожалуйста, попробуйте позже.")
  }
}

