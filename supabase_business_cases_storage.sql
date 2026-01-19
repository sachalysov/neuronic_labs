-- Настройка Storage для изображений бизнес-кейсов
-- Выполните этот файл после создания таблицы business_cases

-- Удаление старых политик (если они существуют)
DROP POLICY IF EXISTS "Authenticated users can upload business case images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update business case images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete business case images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload business case images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update business case images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete business case images" ON storage.objects;

-- Создание bucket для изображений кейсов (если еще не создан)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-cases-images',
  'business-cases-images',
  true,
  5242880, -- 5MB лимит на файл
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Политика доступа: все могут просматривать изображения кейсов
CREATE POLICY "Anyone can view business case images"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-cases-images');

-- Политика доступа: все могут загружать изображения (для публичного bucket)
-- ВАЖНО: Если нужна безопасность, используйте Supabase Auth или service_role key
CREATE POLICY "Anyone can upload business case images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'business-cases-images');

-- Политика доступа: все могут обновлять изображения
CREATE POLICY "Anyone can update business case images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'business-cases-images')
WITH CHECK (bucket_id = 'business-cases-images');

-- Политика доступа: все могут удалять изображения
CREATE POLICY "Anyone can delete business case images"
ON storage.objects FOR DELETE
USING (bucket_id = 'business-cases-images');

-- Примечание: После создания bucket и политик вы можете загружать изображения через:
-- 1. Supabase Dashboard -> Storage -> business-cases-images
-- 2. Или через API: supabase.storage.from('business-cases-images').upload(path, file)
-- 
-- После загрузки изображения получите публичный URL:
-- const { data } = supabase.storage.from('business-cases-images').getPublicUrl(path)
-- И используйте этот URL в поле image_url таблицы business_cases

