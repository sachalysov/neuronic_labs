import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { getAdminSettings, updateAdminSettings, subscribeToAdminSettings, type AdminSettings } from '@/services/admin-settings'

const DEFAULT_MAINTENANCE_TEXT = 'На сайте ведутся технические работы. Возможны временные сбои в работе.'

export default function AdminDashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false)
  const [maintenanceText, setMaintenanceText] = useState(DEFAULT_MAINTENANCE_TEXT)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [saving, setSaving] = useState(false)
  const textSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUserTypingRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login')
    }
  }, [user, authLoading, navigate])

  // Загрузка настроек из Supabase
  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      setLoadingSettings(true)
      try {
        const settings = await getAdminSettings()
        if (settings) {
          setMaintenanceEnabled(settings.maintenance_banner_enabled)
          setMaintenanceText(settings.maintenance_banner_text || DEFAULT_MAINTENANCE_TEXT)
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()

    // Подписка на изменения настроек в реальном времени
    const unsubscribe = subscribeToAdminSettings((settings: AdminSettings) => {
      // Игнорируем обновления от Realtime, если пользователь сам вводит текст
      if (!isUserTypingRef.current) {
        setMaintenanceEnabled(settings.maintenance_banner_enabled)
        setMaintenanceText(settings.maintenance_banner_text || DEFAULT_MAINTENANCE_TEXT)
      }
    })

    return () => {
      unsubscribe()
      // Очищаем таймер при размонтировании
      if (textSaveTimeoutRef.current) {
        clearTimeout(textSaveTimeoutRef.current)
      }
    }
  }, [user])

  const handleToggleMaintenance = async (value: boolean) => {
    setMaintenanceEnabled(value)
    setSaving(true)
    try {
      await updateAdminSettings({ maintenance_banner_enabled: value })
    } catch (error) {
      console.error('Ошибка обновления настроек:', error)
      // Откатываем изменение при ошибке
      setMaintenanceEnabled(!value)
    } finally {
      setSaving(false)
    }
  }

  const handleTextChange = (text: string) => {
    // Обновляем локальное состояние сразу для отзывчивости UI
    setMaintenanceText(text)
    
    // Устанавливаем флаг, что пользователь вводит текст
    isUserTypingRef.current = true
    
    // Очищаем предыдущий таймер
    if (textSaveTimeoutRef.current) {
      clearTimeout(textSaveTimeoutRef.current)
    }
    
    // Сохраняем в Supabase только после паузы в вводе (3500ms)
    textSaveTimeoutRef.current = setTimeout(async () => {
      isUserTypingRef.current = false
      setSaving(true)
      try {
        await updateAdminSettings({ 
          maintenance_banner_text: text.trim() || DEFAULT_MAINTENANCE_TEXT 
        })
      } catch (error) {
        console.error('Ошибка обновления текста:', error)
      } finally {
        setSaving(false)
      }
    }, 3500)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Ошибка выхода:', error)
      // Всё равно редиректим на логин
      navigate('/admin/login')
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
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                type="button"
                className="touch-manipulation"
              >
                Открыть сайт
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/blog')}
                type="button"
                className="touch-manipulation"
              >
                Админка блога
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                type="button"
                className="touch-manipulation min-w-[80px]"
              >
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
              {loadingSettings && (
                <div className="text-sm text-muted-foreground">Загрузка настроек...</div>
              )}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleMaintenance(!maintenanceEnabled)}
                  disabled={saving || loadingSettings}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    maintenanceEnabled ? 'bg-destructive' : 'bg-muted'
                  }`}
                  style={{
                    minHeight: '24px',
                    maxHeight: '24px',
                    height: '24px',
                    minWidth: '44px',
                    maxWidth: '44px',
                    width: '44px'
                  }}
                  aria-pressed={maintenanceEnabled}
                  aria-label="Переключить уведомление о технических работах"
                >
                  <span
                    className={`pointer-events-none absolute top-1/2 left-0.5 -translate-y-1/2 inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-all duration-200 ease-in-out ${
                      maintenanceEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                    }`}
                    style={{
                      minHeight: '20px',
                      maxHeight: '20px',
                      height: '20px',
                      minWidth: '20px',
                      maxWidth: '20px',
                      width: '20px'
                    }}
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
              
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="block text-sm font-medium">
                  Текст уведомления
                </label>
                <Input
                  type="text"
                  value={maintenanceText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={DEFAULT_MAINTENANCE_TEXT}
                  disabled={saving || loadingSettings}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Текст будет отображаться в красном баннере в верхней части всех страниц сайта.
                </p>
              </div>
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


