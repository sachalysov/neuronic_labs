import { supabase } from '@/lib/supabase'

export interface AdminSettings {
  id?: string
  key?: string
  maintenance_banner_enabled: boolean
  maintenance_banner_text: string
  created_at?: string
  updated_at?: string
}

const SETTINGS_KEY = 'main'

/**
 * Получить настройки админ-панели из Supabase
 */
export async function getAdminSettings(): Promise<AdminSettings | null> {
  if (!supabase) {
    console.warn('Supabase не настроен, используем значения по умолчанию')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', SETTINGS_KEY)
      .single()

    if (error) {
      // Если записи нет, создаем её с дефолтными значениями
      if (error.code === 'PGRST116') {
        return await createDefaultSettings()
      }
      console.error('Ошибка получения настроек:', error)
      return null
    }

    return data as AdminSettings
  } catch (error) {
    console.error('Ошибка получения настроек:', error)
    return null
  }
}

/**
 * Создать настройки по умолчанию
 */
async function createDefaultSettings(): Promise<AdminSettings | null> {
  if (!supabase) return null

  try {
    const defaultSettings = {
      key: SETTINGS_KEY,
      maintenance_banner_enabled: false,
      maintenance_banner_text: 'На сайте ведутся технические работы. Возможны временные сбои в работе.',
    }

    const { data, error } = await supabase
      .from('admin_settings')
      .insert(defaultSettings)
      .select()
      .single()

    if (error) {
      console.error('Ошибка создания настроек:', error)
      return null
    }

    return data as AdminSettings
  } catch (error) {
    console.error('Ошибка создания настроек:', error)
    return null
  }
}

/**
 * Обновить настройки админ-панели
 */
export async function updateAdminSettings(
  updates: Partial<Pick<AdminSettings, 'maintenance_banner_enabled' | 'maintenance_banner_text'>>
): Promise<AdminSettings | null> {
  if (!supabase) {
    console.warn('Supabase не настроен')
    return null
  }

  try {
    // Сначала проверяем, существует ли запись
    const existing = await getAdminSettings()
    
    if (!existing) {
      // Если записи нет, создаем её
      const defaultSettings = {
        key: SETTINGS_KEY,
        maintenance_banner_enabled: updates.maintenance_banner_enabled ?? false,
        maintenance_banner_text: updates.maintenance_banner_text ?? 'На сайте ведутся технические работы. Возможны временные сбои в работе.',
      }

      const { data, error } = await supabase
        .from('admin_settings')
        .insert(defaultSettings)
        .select()
        .single()

      if (error) {
        console.error('Ошибка создания настроек:', error)
        return null
      }

      return data as AdminSettings
    }

    // Обновляем существующую запись
    const { data, error } = await supabase
      .from('admin_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('key', SETTINGS_KEY)
      .select()
      .single()

    if (error) {
      console.error('Ошибка обновления настроек:', error)
      return null
    }

    return data as AdminSettings
  } catch (error) {
    console.error('Ошибка обновления настроек:', error)
    return null
  }
}

/**
 * Подписаться на изменения настроек через Supabase Realtime
 */
export function subscribeToAdminSettings(
  callback: (settings: AdminSettings) => void
): () => void {
  if (!supabase) {
    return () => {}
  }

  const channel = supabase
    .channel('admin_settings_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'admin_settings',
        filter: `key=eq.${SETTINGS_KEY}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as AdminSettings)
        }
      }
    )
    .subscribe()

  return () => {
    if (supabase) {
      supabase.removeChannel(channel)
    }
  }
}

