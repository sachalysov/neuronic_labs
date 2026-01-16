-- Создание таблицы для настроек админ-панели
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL DEFAULT 'main',
  maintenance_banner_enabled BOOLEAN DEFAULT false,
  maintenance_banner_text TEXT DEFAULT 'На сайте ведутся технические работы. Возможны временные сбои в работе.',
  -- Вебхуки для различных компонентов
  webhooks_enabled BOOLEAN DEFAULT true,
  webhook_demo_chat TEXT,
  webhook_demo_chat_vomoloko TEXT,
  webhook_demo_chat_protec TEXT,
  webhook_widget_chat TEXT,
  webhook_form TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включение Realtime для таблицы
ALTER PUBLICATION supabase_realtime ADD TABLE admin_settings;

-- Создание индекса для быстрого поиска по ключу
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- RLS политики (Row Level Security)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Политика: только авторизованные пользователи могут читать настройки
CREATE POLICY "Anyone can read admin settings"
  ON admin_settings
  FOR SELECT
  USING (true);

-- Политика: только авторизованные пользователи могут обновлять настройки
-- ВАЖНО: Настройте эту политику в соответствии с вашей системой авторизации
-- Например, если используете Supabase Auth, можно использовать auth.uid()
CREATE POLICY "Authenticated users can update admin settings"
  ON admin_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Политика: только авторизованные пользователи могут создавать настройки
CREATE POLICY "Authenticated users can insert admin settings"
  ON admin_settings
  FOR INSERT
  WITH CHECK (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Добавление полей вебхуков к существующей таблице (если таблица уже создана)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhook_demo_chat') THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhook_demo_chat_vomoloko') THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_vomoloko TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhook_demo_chat_protec') THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_protec TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhook_widget_chat') THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_widget_chat TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhook_form') THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_form TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_settings' AND column_name = 'webhooks_enabled') THEN
    ALTER TABLE admin_settings ADD COLUMN webhooks_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

