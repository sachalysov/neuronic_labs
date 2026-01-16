import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { getAdminSettings, updateAdminSettings, subscribeToAdminSettings, clearWebhooksCache, type AdminSettings } from '@/services/admin-settings'

const DEFAULT_MAINTENANCE_TEXT = 'На сайте ведутся технические работы. Возможны временные сбои в работе.'

export default function AdminDashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false)
  const [maintenanceText, setMaintenanceText] = useState(DEFAULT_MAINTENANCE_TEXT)
  const [webhooksEnabled, setWebhooksEnabled] = useState(true)
  const [isEditingWebhooks, setIsEditingWebhooks] = useState(false)
  const [webhookDemoChat, setWebhookDemoChat] = useState('')
  const [webhookDemoChatVomoloko, setWebhookDemoChatVomoloko] = useState('')
  const [webhookDemoChatProtec, setWebhookDemoChatProtec] = useState('')
  const [webhookWidgetChat, setWebhookWidgetChat] = useState('')
  const [webhookForm, setWebhookForm] = useState('')
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
          setWebhooksEnabled(settings.webhooks_enabled ?? true)
          setWebhookDemoChat(settings.webhook_demo_chat || '')
          setWebhookDemoChatVomoloko(settings.webhook_demo_chat_vomoloko || '')
          setWebhookDemoChatProtec(settings.webhook_demo_chat_protec || '')
          setWebhookWidgetChat(settings.webhook_widget_chat || '')
          setWebhookForm(settings.webhook_form || '')
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
      // Игнорируем обновления от Realtime, если пользователь сам вводит текст или редактирует вебхуки
      if (!isUserTypingRef.current && !isEditingWebhooks) {
        setMaintenanceEnabled(settings.maintenance_banner_enabled)
        setMaintenanceText(settings.maintenance_banner_text || DEFAULT_MAINTENANCE_TEXT)
        setWebhooksEnabled(settings.webhooks_enabled ?? true)
        setWebhookDemoChat(settings.webhook_demo_chat || '')
        setWebhookDemoChatVomoloko(settings.webhook_demo_chat_vomoloko || '')
        setWebhookDemoChatProtec(settings.webhook_demo_chat_protec || '')
        setWebhookWidgetChat(settings.webhook_widget_chat || '')
        setWebhookForm(settings.webhook_form || '')
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

  const handleToggleWebhooks = async (value: boolean) => {
    setWebhooksEnabled(value)
    setSaving(true)
    try {
      await updateAdminSettings({ webhooks_enabled: value })
      clearWebhooksCache()
    } catch (error) {
      console.error('Ошибка обновления настроек вебхуков:', error)
      // Откатываем изменение при ошибке
      setWebhooksEnabled(!value)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWebhooks = async () => {
    setSaving(true)
    try {
      await updateAdminSettings({
        webhook_demo_chat: webhookDemoChat.trim() || undefined,
        webhook_demo_chat_vomoloko: webhookDemoChatVomoloko.trim() || undefined,
        webhook_demo_chat_protec: webhookDemoChatProtec.trim() || undefined,
        webhook_widget_chat: webhookWidgetChat.trim() || undefined,
        webhook_form: webhookForm.trim() || undefined,
      })
      clearWebhooksCache()
      setIsEditingWebhooks(false)
    } catch (error) {
      console.error('Ошибка сохранения вебхуков:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEditWebhooks = async () => {
    // Загружаем исходные значения из базы
    try {
      const settings = await getAdminSettings()
      if (settings) {
        setWebhookDemoChat(settings.webhook_demo_chat || '')
        setWebhookDemoChatVomoloko(settings.webhook_demo_chat_vomoloko || '')
        setWebhookDemoChatProtec(settings.webhook_demo_chat_protec || '')
        setWebhookWidgetChat(settings.webhook_widget_chat || '')
        setWebhookForm(settings.webhook_form || '')
      }
    } catch (error) {
      console.error('Ошибка загрузки вебхуков:', error)
    }
    setIsEditingWebhooks(false)
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

        <Card>
          <CardHeader>
            <CardTitle>Настройки вебхуков</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSettings && (
              <div className="text-sm text-muted-foreground">Загрузка настроек...</div>
            )}
            
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => handleToggleWebhooks(!webhooksEnabled)}
                disabled={saving || loadingSettings}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  webhooksEnabled ? 'bg-primary' : 'bg-muted'
                }`}
                style={{
                  minHeight: '24px',
                  maxHeight: '24px',
                  height: '24px',
                  minWidth: '44px',
                  maxWidth: '44px',
                  width: '44px'
                }}
                aria-pressed={webhooksEnabled}
                aria-label="Переключить вебхуки"
              >
                <span
                  className={`pointer-events-none absolute top-1/2 left-0.5 -translate-y-1/2 inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-all duration-200 ease-in-out ${
                    webhooksEnabled ? 'translate-x-[20px]' : 'translate-x-0'
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
                  Выключить вебхуки
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  При выключении вебхуки не будут использоваться, будут применяться значения по умолчанию из конфигурации.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
              <div>
                <div className="font-medium">Редактирование вебхуков</div>
                <p className="text-sm text-muted-foreground">
                  Нажмите "Редактировать" чтобы изменить вебхуки, затем "Сохранить" для применения изменений.
                </p>
              </div>
              <div className="flex gap-2">
                {!isEditingWebhooks ? (
                  <Button 
                    size="sm" 
                    onClick={() => setIsEditingWebhooks(true)}
                    disabled={saving || loadingSettings}
                  >
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCancelEditWebhooks}
                      disabled={saving}
                    >
                      Отмена
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveWebhooks}
                      disabled={saving}
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Вебхук для демо чата (основной)
                </label>
                <Input
                  type="url"
                  value={webhookDemoChat}
                  onChange={(e) => setWebhookDemoChat(e.target.value)}
                  placeholder="https://n8n.example.com/webhook/demo-chat"
                  disabled={!isEditingWebhooks || saving || loadingSettings}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется в демо чате для отправки сообщений пользователя
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Вебхук для демо чата - кнопка vomoloko.ru
                </label>
                <Input
                  type="url"
                  value={webhookDemoChatVomoloko}
                  onChange={(e) => setWebhookDemoChatVomoloko(e.target.value)}
                  placeholder="https://n8n.example.com/webhook/vomoloko"
                  disabled={!isEditingWebhooks || saving || loadingSettings}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется при нажатии на кнопку vomoloko.ru в демо чате
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Вебхук для демо чата - кнопка protec.one
                </label>
                <Input
                  type="url"
                  value={webhookDemoChatProtec}
                  onChange={(e) => setWebhookDemoChatProtec(e.target.value)}
                  placeholder="https://n8n.example.com/webhook/protec"
                  disabled={!isEditingWebhooks || saving || loadingSettings}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется при нажатии на кнопку protec.one в демо чате
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Вебхук для виджет чата
                </label>
                <Input
                  type="url"
                  value={webhookWidgetChat}
                  onChange={(e) => setWebhookWidgetChat(e.target.value)}
                  placeholder="https://n8n.example.com/webhook/widget-chat"
                  disabled={!isEditingWebhooks || saving || loadingSettings}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется в виджет чате на сайте для отправки сообщений
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Вебхук для форм обратной связи
                </label>
                <Input
                  type="url"
                  value={webhookForm}
                  onChange={(e) => setWebhookForm(e.target.value)}
                  placeholder="https://n8n.example.com/webhook/contact"
                  disabled={!isEditingWebhooks || saving || loadingSettings}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется для отправки данных из форм обратной связи
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


