-- Миграция: Добавление полей вебхуков к существующей таблице admin_settings
-- Выполните этот скрипт, если таблица admin_settings уже существует

-- Добавление полей вебхуков к существующей таблице
DO $$ 
BEGIN
  -- Вебхук для демо чата (основной)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat TEXT;
    RAISE NOTICE 'Добавлено поле webhook_demo_chat';
  END IF;

  -- Вебхук для демо чата - кнопка vomoloko.ru
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat_vomoloko'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_vomoloko TEXT;
    RAISE NOTICE 'Добавлено поле webhook_demo_chat_vomoloko';
  END IF;

  -- Вебхук для демо чата - кнопка protec.one
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_demo_chat_protec'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_demo_chat_protec TEXT;
    RAISE NOTICE 'Добавлено поле webhook_demo_chat_protec';
  END IF;

  -- Вебхук для виджет чата
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_widget_chat'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_widget_chat TEXT;
    RAISE NOTICE 'Добавлено поле webhook_widget_chat';
  END IF;

  -- Вебхук для форм обратной связи
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'webhook_form'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN webhook_form TEXT;
    RAISE NOTICE 'Добавлено поле webhook_form';
  END IF;

  RAISE NOTICE 'Миграция завершена успешно';
END $$;

