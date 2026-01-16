-- =====================================================
-- МИГРАЦИЯ: Добавление полей для управления видимостью секций
-- Добавление полей testimonials_enabled и business_cases_enabled
-- =====================================================
-- Выполните этот скрипт в Supabase SQL Editor
-- Скрипт безопасен для повторного запуска
-- =====================================================

-- Добавление полей для управления видимостью секций
DO $$ 
BEGIN
  -- Флаг видимости секции "Отзывы"
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'testimonials_enabled'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN testimonials_enabled BOOLEAN DEFAULT true;
    RAISE NOTICE '✓ Добавлено поле testimonials_enabled';
  ELSE
    RAISE NOTICE '→ Поле testimonials_enabled уже существует';
  END IF;

  -- Флаг видимости секции "Кейсы бизнеса"
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'business_cases_enabled'
  ) THEN
    ALTER TABLE admin_settings ADD COLUMN business_cases_enabled BOOLEAN DEFAULT true;
    RAISE NOTICE '✓ Добавлено поле business_cases_enabled';
  ELSE
    RAISE NOTICE '→ Поле business_cases_enabled уже существует';
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
    'testimonials_enabled',
    'business_cases_enabled'
  )
ORDER BY column_name;

