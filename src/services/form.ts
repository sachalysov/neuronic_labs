export interface FormData {
  name: string
  phone: string
  email: string
  username: string
  comment?: string
}

export async function submitFormData(formData: FormData): Promise<void> {
  const webhookUrl = import.meta.env.VITE_FORM_WEBHOOK_URL || 'https://n8n.alexlysov.ru/webhook/contact'
  
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
      let errorText = ''
      try {
        const errorData = await response.json()
        errorText = errorData.message || JSON.stringify(errorData)
        
        if (response.status === 404) {
          throw new Error("Вебхук не найден. Убедитесь, что workflow активирован в n8n.")
        }
      } catch (parseError) {
        errorText = await response.text().catch(() => 'Не удалось прочитать ответ')
      }
      
      console.error('Ошибка ответа:', errorText)
      throw new Error(`Ошибка сервера (${response.status}): ${errorText}`)
    }

    // Попытаемся прочитать ответ, даже если он пустой
    try {
      const data = await response.json()
      console.log('Данные ответа:', data)
    } catch (e) {
      // Игнорируем, если ответ не JSON
      console.log('Ответ не содержит JSON, это нормально для вебхуков')
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

