-- Настройка Storage для изображений бизнес-кейсов
-- Выполните этот файл после создания таблицы business_cases

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

-- Политика доступа: только авторизованные пользователи могут загружать изображения
CREATE POLICY "Authenticated users can upload business case images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-cases-images' AND
  auth.role() = 'authenticated'
);

-- Политика доступа: только авторизованные пользователи могут обновлять изображения
CREATE POLICY "Authenticated users can update business case images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-cases-images' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'business-cases-images' AND
  auth.role() = 'authenticated'
);

-- Политика доступа: только авторизованные пользователи могут удалять изображения
CREATE POLICY "Authenticated users can delete business case images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-cases-images' AND
  auth.role() = 'authenticated'
);

-- Примечание: После создания bucket и политик вы можете загружать изображения через:
-- 1. Supabase Dashboard -> Storage -> business-cases-images
-- 2. Или через API: supabase.storage.from('business-cases-images').upload(path, file)
-- 
-- После загрузки изображения получите публичный URL:
-- const { data } = supabase.storage.from('business-cases-images').getPublicUrl(path)
-- И используйте этот URL в поле image_url таблицы business_cases

