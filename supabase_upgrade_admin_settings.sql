-- =====================================================
-- МИГРАЦИЯ: Обновление таблицы admin_settings
-- Добавление полей для вебхуков
-- =====================================================
-- Выполните этот скрипт в Supabase SQL Editor
-- Скрипт безопасен для повторного запуска
-- =====================================================

-- Добавление полей вебхуков к существующей таблице admin_settings
DO $$ 
BEGIN
  -- Флаг включения/выключения вебхуков
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhooks_enabled'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhooks_enabled BOOLEAN DEFAULT true;
    RAISE NOTICE '✓ Добавлено поле webhooks_enabled';
  ELSE
    RAISE NOTICE '→ Поле webhooks_enabled уже существует';
  END IF;

  -- Вебхук для демо чата (основной)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat TEXT;
    RAISE NOTICE '✓ Добавлено поле webhook_demo_chat';
  ELSE
    RAISE NOTICE '→ Поле webhook_demo_chat уже существует';
  END IF;

  -- Вебхук для демо чата - кнопка vomoloko.ru
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat_vomoloko'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_vomoloko TEXT;
    RAISE NOTICE '✓ Добавлено поле webhook_demo_chat_vomoloko';
  ELSE
    RAISE NOTICE '→ Поле webhook_demo_chat_vomoloko уже существует';
  END IF;

  -- Вебхук для демо чата - кнопка protec.one
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat_protec'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_protec TEXT;
    RAISE NOTICE '✓ Добавлено поле webhook_demo_chat_protec';
  ELSE
    RAISE NOTICE '→ Поле webhook_demo_chat_protec уже существует';
  END IF;

  -- Вебхук для виджет чата
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_widget_chat'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_widget_chat TEXT;
    RAISE NOTICE '✓ Добавлено поле webhook_widget_chat';
  ELSE
    RAISE NOTICE '→ Поле webhook_widget_chat уже существует';
  END IF;

  -- Вебхук для форм обратной связи
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_form'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_form TEXT;
    RAISE NOTICE '✓ Добавлено поле webhook_form';
  ELSE
    RAISE NOTICE '→ Поле webhook_form уже существует';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Миграция завершена успешно!';
  RAISE NOTICE '========================================';
END $$;

-- Проверка результата миграции
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'admin_settings'
  AND column_name IN (
    'webhooks_enabled',
    'webhook_demo_chat',
    'webhook_demo_chat_vomoloko',
    'webhook_demo_chat_protec',
    'webhook_widget_chat',
    'webhook_form'
  )
ORDER BY column_name;

