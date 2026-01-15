import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'

const MAINTENANCE_STORAGE_KEY = 'nlabs_maintenance_banner'
const MAINTENANCE_TEXT_STORAGE_KEY = 'nlabs_maintenance_banner_text'
const MAINTENANCE_EVENT_NAME = 'nlabs_maintenance_banner_change'
const DEFAULT_MAINTENANCE_TEXT = 'На сайте ведутся технические работы. Возможны временные сбои в работе.'

export default function AdminDashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false)
  const [maintenanceText, setMaintenanceText] = useState(DEFAULT_MAINTENANCE_TEXT)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(MAINTENANCE_STORAGE_KEY)
      setMaintenanceEnabled(value === '1')
      
      const textValue = window.localStorage.getItem(MAINTENANCE_TEXT_STORAGE_KEY)
      if (textValue) {
        setMaintenanceText(textValue)
      }
    } catch {
      setMaintenanceEnabled(false)
    }
  }, [])

  const handleToggleMaintenance = (value: boolean) => {
    setMaintenanceEnabled(value)
    try {
      if (value) {
        window.localStorage.setItem(MAINTENANCE_STORAGE_KEY, '1')
      } else {
        window.localStorage.removeItem(MAINTENANCE_STORAGE_KEY)
      }
      window.dispatchEvent(new Event(MAINTENANCE_EVENT_NAME))
    } catch {
      // ignore storage errors
    }
  }

  const handleTextChange = (text: string) => {
    setMaintenanceText(text)
    try {
      if (text.trim()) {
        window.localStorage.setItem(MAINTENANCE_TEXT_STORAGE_KEY, text)
      } else {
        window.localStorage.setItem(MAINTENANCE_TEXT_STORAGE_KEY, DEFAULT_MAINTENANCE_TEXT)
      }
      window.dispatchEvent(new Event(MAINTENANCE_EVENT_NAME))
    } catch {
      // ignore storage errors
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Админ панель</h1>
              <p className="text-muted-foreground mt-1">
                Общие настройки сайта и переход в разделы админки
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <AdminThemeToggle />
              <Button variant="outline" onClick={() => navigate('/')}>
                Открыть сайт
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/blog')}>
                Админка блога
              </Button>
              <Button variant="outline" onClick={signOut}>
                Выйти
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки сайта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleMaintenance(!maintenanceEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    maintenanceEnabled ? 'bg-destructive' : 'bg-muted'
                  }`}
                  aria-pressed={maintenanceEnabled}
                  aria-label="Переключить уведомление о технических работах"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      maintenanceEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <div className="font-medium">
                    Вывести уведомление о технических работах в шапке сайта
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Показывает на всех страницах компактный баннер поверх шапки с
                    сообщением о возможных технических работах и сбоях.
                  </p>
                </div>
              </div>
              
              {maintenanceEnabled && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="block text-sm font-medium">
                    Текст уведомления
                  </label>
                  <Input
                    type="text"
                    value={maintenanceText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={DEFAULT_MAINTENANCE_TEXT}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Текст будет отображаться в красном баннере в верхней части всех страниц сайта.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Разделы админ-панели</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Управление блогом</div>
                  <p className="text-sm text-muted-foreground">
                    Создание, редактирование и удаление статей блога.
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate('/admin/blog')}>
                  Перейти
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


