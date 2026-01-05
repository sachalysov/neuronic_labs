// Константы для стран СНГ
export interface Country {
  code: string
  name: string
  dialCode: string
  maxDigits: number // Максимальное количество цифр в номере (включая код страны)
  minDigits: number // Минимальное количество цифр
}

export const CIS_COUNTRIES: Country[] = [
  {
    code: 'ru',
    name: 'Россия',
    dialCode: '+7',
    maxDigits: 11, // +7 (9XX) XXX-XX-XX
    minDigits: 11,
  },
  {
    code: 'by',
    name: 'Беларусь',
    dialCode: '+375',
    maxDigits: 12, // +375 (XX) XXX-XX-XX
    minDigits: 12,
  },
  {
    code: 'kz',
    name: 'Казахстан',
    dialCode: '+7',
    maxDigits: 11, // +7 (7XX) XXX-XX-XX
    minDigits: 11,
  },
  {
    code: 'ua',
    name: 'Украина',
    dialCode: '+380',
    maxDigits: 12, // +380 (XX) XXX-XX-XX
    minDigits: 12,
  },
  {
    code: 'am',
    name: 'Армения',
    dialCode: '+374',
    maxDigits: 11, // +374 (XX) XXX-XXX
    minDigits: 11,
  },
  {
    code: 'az',
    name: 'Азербайджан',
    dialCode: '+994',
    maxDigits: 12, // +994 (XX) XXX-XX-XX
    minDigits: 12,
  },
  {
    code: 'kg',
    name: 'Кыргызстан',
    dialCode: '+996',
    maxDigits: 12, // +996 (XXX) XX-XX-XX
    minDigits: 12,
  },
  {
    code: 'tj',
    name: 'Таджикистан',
    dialCode: '+992',
    maxDigits: 12, // +992 (XX) XXX-XX-XX
    minDigits: 12,
  },
  {
    code: 'tm',
    name: 'Туркменистан',
    dialCode: '+993',
    maxDigits: 11, // +993 (XX) XX-XX-XX
    minDigits: 11,
  },
  {
    code: 'uz',
    name: 'Узбекистан',
    dialCode: '+998',
    maxDigits: 12, // +998 (XX) XXX-XX-XX
    minDigits: 12,
  },
]

// Получить страну по коду
export function getCountryByCode(code: string): Country | undefined {
  return CIS_COUNTRIES.find(country => country.code === code)
}

// Получить страну по dial code
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return CIS_COUNTRIES.find(country => country.dialCode === dialCode)
}

// Валидация телефона по стране
export function validatePhone(phone: string, country: Country): { valid: boolean; error?: string } {
  // Убираем все нецифровые символы, кроме +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Если номер пустой или только код страны, это невалидно
  if (!cleaned || cleaned === country.dialCode) {
    return { valid: false, error: 'Введите номер телефона' }
  }
  
  // Проверяем, что номер начинается с кода страны
  if (!cleaned.startsWith(country.dialCode)) {
    return { valid: false, error: `Номер должен начинаться с ${country.dialCode}` }
  }
  
  // Получаем только цифры
  const digitsOnly = cleaned.replace(/\+/g, '')
  
  // Проверяем, что в номере только цифры
  if (!/^\d+$/.test(digitsOnly)) {
    return { valid: false, error: 'Номер может содержать только цифры' }
  }
  
  // Проверяем минимальное и максимальное количество цифр
  if (digitsOnly.length < country.minDigits) {
    return { valid: false, error: `Недостаточно цифр. Минимум ${country.minDigits} цифр` }
  }
  
  if (digitsOnly.length > country.maxDigits) {
    return { valid: false, error: `Слишком много цифр. Максимум ${country.maxDigits} цифр` }
  }
  
  return { valid: true }
}

// Форматирование телефона (базовое)
export function formatPhone(phone: string, country: Country): string {
  // Убираем все нецифровые символы, кроме +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // Если пусто, возвращаем код страны
  if (!cleaned || cleaned === '+') {
    return country.dialCode
  }
  
  // Если номер не начинается с кода страны, добавляем его
  if (!cleaned.startsWith(country.dialCode)) {
    // Если начинается с 8 для России/Казахстана, заменяем на +7
    if (country.dialCode === '+7' && cleaned.startsWith('8')) {
      cleaned = '+7' + cleaned.slice(1)
    } else if (!cleaned.startsWith('+')) {
      // Если просто цифры без +, добавляем код страны
      cleaned = country.dialCode + cleaned
    } else {
      // Если начинается с другого кода, возвращаем как есть (пользователь сам выбрал)
      return cleaned
    }
  }
  
  // Ограничиваем длину - только цифры после кода страны
  const digitsOnly = cleaned.replace(/\+/g, '')
  
  // Проверяем, что номер не превышает максимальную длину
  if (digitsOnly.length > country.maxDigits) {
    const limitedDigits = digitsOnly.slice(0, country.maxDigits)
    cleaned = '+' + limitedDigits
  }
  
  return cleaned
}

// Валидация имени (без цифр)
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'Имя обязательно для заполнения' }
  }
  
  // Проверяем, что в имени нет цифр
  if (/\d/.test(name)) {
    return { valid: false, error: 'Имя не может содержать цифры' }
  }
  
  // Проверяем минимальную длину
  if (name.trim().length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' }
  }
  
  return { valid: true }
}

// Валидация комментария
export function validateComment(comment: string, maxLength: number = 1500): { valid: boolean; error?: string } {
  if (comment.length > maxLength) {
    return { valid: false, error: `Комментарий не может быть длиннее ${maxLength} символов` }
  }
  
  return { valid: true }
}

