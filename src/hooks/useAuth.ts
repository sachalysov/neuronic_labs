import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_AUTH_STORAGE_KEY = 'nlabs_admin_auth'
const DEVICE_ID_STORAGE_KEY = 'nlabs_device_id'

// Генерируем уникальный ID устройства при первом использовании
function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId)
  }
  return deviceId
}

// Проверяем локальную авторизацию для текущего устройства
function checkLocalAuth(): boolean {
  try {
    const authData = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)
    if (!authData) return false
    
    const parsed = JSON.parse(authData)
    const currentDeviceId = getDeviceId()
    
    // Проверяем, что авторизация для текущего устройства
    return parsed.deviceId === currentDeviceId && parsed.authenticated === true
  } catch {
    return false
  }
}

// Удаляем локальную авторизацию
function clearLocalAuth() {
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
}

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем только локальную авторизацию для текущего устройства
    const isAuthenticated = checkLocalAuth()
    
    if (isAuthenticated) {
      // Получаем email из сохраненных данных
      try {
        const authData = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)
        if (authData) {
          const parsed = JSON.parse(authData)
          setUser({ email: parsed.email || 'admin' })
        } else {
          setUser({ email: 'admin' })
        }
      } catch {
        setUser({ email: 'admin' })
      }
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase не настроен')
    }

    // Проверяем credentials через Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // После успешного логина сохраняем локальную авторизацию для текущего устройства
    const deviceId = getDeviceId()
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify({
      deviceId,
      authenticated: true,
      email: email,
      timestamp: Date.now()
    }))

    // Сразу выходим из Supabase сессии, чтобы она не синхронизировалась
    await supabase.auth.signOut()

    // Обновляем состояние
    setUser({ email })

    return data
  }

  const signOut = async () => {
    // Удаляем только локальную авторизацию текущего устройства
    clearLocalAuth()
    setUser(null)
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
