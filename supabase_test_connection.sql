-- Тестовый SQL для проверки таблицы blog_posts
-- Выполни этот запрос в SQL Editor Supabase

-- 1. Проверка существования таблицы
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'blog_posts';

-- 2. Проверка структуры таблицы
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 3. Проверка количества записей
SELECT COUNT(*) as total_posts FROM blog_posts;

-- 4. Проверка всех записей
SELECT id, title, published_at, author 
FROM blog_posts 
ORDER BY published_at DESC;

-- 5. Проверка RLS политик
SELECT * 
FROM pg_policies 
WHERE tablename = 'blog_posts';

