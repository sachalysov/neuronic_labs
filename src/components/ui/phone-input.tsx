"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { CIS_COUNTRIES, type Country } from "@/lib/phone-validation"
import { ChevronDown } from "lucide-react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onCountryChange?: (country: Country) => void
  placeholder?: string
  required?: boolean
  className?: string
  error?: string
}

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  placeholder,
  required,
  className,
  error,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(CIS_COUNTRIES[0]) // Россия по умолчанию
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Извлекаем только цифры номера (без кода страны) для отображения в поле ввода
  const getDisplayValue = (country?: Country): string => {
    if (!value) return ''
    const countryToUse = country || selectedCountry
    // Убираем код страны из значения
    const dialCodeDigits = countryToUse.dialCode.replace(/\+/g, '')
    const digitsOnly = value.replace(/[^\d]/g, '')
    if (digitsOnly.startsWith(dialCodeDigits)) {
      const numberPart = digitsOnly.slice(dialCodeDigits.length)
      return numberPart
    }
    // Если номер не начинается с кода выбранной страны, пытаемся найти код в начале
    for (const c of CIS_COUNTRIES) {
      const codeDigits = c.dialCode.replace(/\+/g, '')
      if (digitsOnly.startsWith(codeDigits)) {
        return digitsOnly.slice(codeDigits.length)
      }
    }
    // Если не нашли код, возвращаем все цифры (на случай если код уже был удален)
    return digitsOnly
  }

  // Определяем страну по текущему значению при первой загрузке
  useEffect(() => {
    if (value) {
      // Ищем код страны в начале значения
      for (const country of CIS_COUNTRIES) {
        if (value.startsWith(country.dialCode)) {
          if (country.code !== selectedCountry.code) {
            setSelectedCountry(country)
            onCountryChange?.(country)
          }
          break
        }
      }
    }
  }, []) // Только при монтировании

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCountrySelect = (country: Country) => {
    // Получаем только цифры номера (без старого кода страны) ДО изменения selectedCountry
    const displayValue = getDisplayValue(selectedCountry)
    
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    onCountryChange?.(country)
    
    // Обновляем значение с новым кодом страны только если есть номер
    if (displayValue) {
      // Ограничиваем длину номера согласно лимитам новой страны
      const dialCodeDigits = country.dialCode.replace(/\+/g, '')
      const maxNumberDigits = country.maxDigits - dialCodeDigits.length
      const limitedNumber = displayValue.slice(0, maxNumberDigits)
      onChange(country.dialCode + limitedNumber)
    } else {
      // Если номера нет, оставляем пустым
      onChange("")
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    // Убираем все кроме цифр - пользователь вводит только цифры номера
    inputValue = inputValue.replace(/[^\d]/g, '')
    
    // Если поле пустое, оставляем пустым
    if (!inputValue) {
      onChange("")
      return
    }
    
    // Ограничиваем длину номера согласно лимитам выбранной страны
    const dialCodeDigits = selectedCountry.dialCode.replace(/\+/g, '')
    const maxNumberDigits = selectedCountry.maxDigits - dialCodeDigits.length
    const limitedNumber = inputValue.slice(0, maxNumberDigits)
    
    // Формируем полное значение с кодом страны
    const fullValue = selectedCountry.dialCode + limitedNumber
    onChange(fullValue)
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className={`flex border rounded-md transition-[border-color,box-shadow] ${
          error 
            ? 'border-destructive' 
            : isFocused || isDropdownOpen
            ? 'border-ring ring-ring/50 ring-[3px]'
            : 'border-input'
        }`}
      >
        {/* Dropdown для выбора страны */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              // Не убираем фокус, если фокус переходит на input
              if (!containerRef.current?.querySelector('input')?.contains(e.relatedTarget as Node)) {
                setTimeout(() => setIsFocused(false), 100)
              }
            }}
            className="px-2 h-9 border-r border-input bg-transparent hover:bg-secondary/50 focus:outline-none text-sm flex items-center justify-center gap-0.5 min-w-[50px] rounded-l-md"
            aria-label="Выбрать страну"
          >
            <span className="text-xs font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[200px]">
              {CIS_COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-4 py-2 hover:bg-secondary focus:bg-secondary focus:outline-none text-sm ${
                    selectedCountry.code === country.code ? 'bg-primary/10 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">{country.dialCode}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Поле ввода телефона - показываем только цифры номера (без кода страны) */}
        <Input
          type="tel"
          value={getDisplayValue()}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            // Не убираем фокус, если фокус переходит на кнопку
            if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
              setTimeout(() => setIsFocused(false), 100)
            }
          }}
          placeholder={placeholder || "(___) ___-__-__"}
          required={required}
          className={`flex-1 border-0 rounded-l-none rounded-r-md focus-visible:ring-0 focus-visible:border-0 ${className || ''}`}
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

