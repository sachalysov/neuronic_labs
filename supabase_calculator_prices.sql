-- Создание таблицы для цен калькулятора
CREATE TABLE IF NOT EXISTS calculator_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  option_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  category_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, option_name)
);

-- Включение Realtime для таблицы
ALTER PUBLICATION supabase_realtime ADD TABLE calculator_prices;

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_calculator_prices_category ON calculator_prices(category);
CREATE INDEX IF NOT EXISTS idx_calculator_prices_category_order ON calculator_prices(category_order, display_order);

-- RLS политики (Row Level Security)
ALTER TABLE calculator_prices ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать цены
CREATE POLICY "Anyone can read calculator prices"
  ON calculator_prices
  FOR SELECT
  USING (true);

-- Политика: только авторизованные пользователи могут обновлять цены
CREATE POLICY "Authenticated users can update calculator prices"
  ON calculator_prices
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Политика: только авторизованные пользователи могут создавать цены
CREATE POLICY "Authenticated users can insert calculator prices"
  ON calculator_prices
  FOR INSERT
  WITH CHECK (true);

-- Политика: только авторизованные пользователи могут удалять цены
CREATE POLICY "Authenticated users can delete calculator prices"
  ON calculator_prices
  FOR DELETE
  USING (true);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_calculator_prices_updated_at
  BEFORE UPDATE ON calculator_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Вставка начальных данных
INSERT INTO calculator_prices (category, option_name, price, display_order, category_order) VALUES
  -- Количество каналов продаж
  ('Количество каналов продаж', '1', 0, 1, 1),
  ('Количество каналов продаж', '2', 5000, 2, 1),
  ('Количество каналов продаж', '3', 10000, 3, 1),
  ('Количество каналов продаж', '4 и более', 15000, 4, 1),
  
  -- Где вести учет?
  ('Где вести учет?', 'Таблицы для учета (google sheets и др.)', 0, 1, 2),
  ('Где вести учет?', 'CRM система (bitrix24, ycients и др.)', 3000, 2, 2),
  
  -- Дополнительные функции
  ('Дополнительные функции', 'Анализ фотографий', 5000, 1, 3),
  ('Дополнительные функции', 'Ежедневный отчет о продажах', 3000, 2, 3),
  ('Дополнительные функции', 'Самообучение модели', 8000, 3, 3)
ON CONFLICT (category, option_name) DO NOTHING;

