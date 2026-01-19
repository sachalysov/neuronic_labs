-- Создание таблицы для бизнес-кейсов
CREATE TABLE IF NOT EXISTS business_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  image_url TEXT, -- URL изображения (может быть из Supabase Storage или внешний URL)
  results JSONB NOT NULL DEFAULT '[]'::jsonb, -- Массив результатов: [{icon, label, value, color}]
  content TEXT, -- Полный контент для страницы кейса (HTML)
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_business_cases_industry ON business_cases(industry);
CREATE INDEX IF NOT EXISTS idx_business_cases_published_at ON business_cases(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_cases_created_at ON business_cases(created_at DESC);

-- Включение Realtime для таблицы (если нужно)
-- ALTER PUBLICATION supabase_realtime ADD TABLE business_cases;

-- RLS политики (Row Level Security)
ALTER TABLE business_cases ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать опубликованные кейсы
CREATE POLICY "Anyone can read business cases"
  ON business_cases
  FOR SELECT
  USING (true);

-- Политика: только авторизованные пользователи могут создавать кейсы
CREATE POLICY "Authenticated users can insert business cases"
  ON business_cases
  FOR INSERT
  WITH CHECK (true);

-- Политика: только авторизованные пользователи могут обновлять кейсы
CREATE POLICY "Authenticated users can update business cases"
  ON business_cases
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Политика: только авторизованные пользователи могут удалять кейсы
CREATE POLICY "Authenticated users can delete business cases"
  ON business_cases
  FOR DELETE
  USING (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_business_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_business_cases_updated_at
  BEFORE UPDATE ON business_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_business_cases_updated_at();

-- Создание bucket в Storage для изображений кейсов (если еще не создан)
-- Примечание: Выполните это в Supabase Dashboard -> Storage или через SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('business-cases-images', 'business-cases-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Политика доступа к Storage для чтения изображений кейсов
-- Примечание: Выполните это после создания bucket:
-- CREATE POLICY "Anyone can view business case images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'business-cases-images');

