# НЕЙРО МОДУЛЬ - Landing Page

Статический лендинг на Vite + React + TypeScript с автоматическим деплоем на Timeweb.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

## 📦 Деплой

### Автоматический деплой (рекомендуется)

```bash
npm run deploy
```

Эта команда:
1. ✅ Коммитит изменения
2. ✅ Пушит в GitHub
3. ✅ Собирает проект (`npm run build`)
4. ✅ Деплоит на Timeweb через rsync/FTP

### Настройка деплоя

1. **Создайте файл `.env`** (скопируйте из `.env.example`):

```bash
cp .env.example .env
```

2. **Заполните данные Timeweb**:

```env
HOSTING=timeweb
TIMEWEB_HOST=your-site.host.timeweb.ru
TIMEWEB_USER=ftpusername
TIMEWEB_PASS=yourftppassword
SITE_URL=https://your-site.host.timeweb.ru
```

3. **Для macOS установите sshpass** (для быстрого rsync):

```bash
brew install hudochenkov/sshpass/sshpass
```

Или используйте FTP (автоматически, если sshpass недоступен):

```bash
brew install lftp
```

### GitHub Actions (CI/CD)

Автоматический деплой при каждом push в `main`:

1. Добавьте секреты в GitHub (Settings → Secrets → Actions):
   - `TIMEWEB_HOST` - ваш хост Timeweb
   - `TIMEWEB_USER` - FTP логин
   - `TIMEWEB_PASS` - FTP пароль

2. Push в `main` → автоматический деплой ✨

## 🛠 Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка production |
| `npm run preview` | Превью production сборки |
| `npm run deploy` | Полный деплой (git + build + upload) |
| `npm run lint` | Проверка линтером |

## 📁 Структура

```
├── src/
│   ├── components/     # React компоненты
│   ├── pages/          # Страницы
│   ├── services/       # Сервисы (API и т.д.)
│   └── lib/            # Утилиты
├── public/             # Статические файлы
├── dist/               # Production сборка
├── deploy.sh           # Скрипт деплоя
└── .github/workflows/  # GitHub Actions
```

## 🔧 Технологии

- **Vite** - быстрый dev-сервер
- **React 19** + **TypeScript** - UI
- **Tailwind CSS 4** - стили
- **Radix UI** - компоненты
- **Lucide** - иконки

## 📝 Deployment Flow

```
npm run deploy
    │
    ├─→ git add . && git commit
    │
    ├─→ git push origin main
    │       │
    │       └─→ GitHub Actions (автоматически)
    │           ├─→ npm ci
    │           ├─→ npm run build
    │           └─→ rsync → Timeweb
    │
    ├─→ npm run build
    │
    └─→ rsync/FTP → Timeweb ✅
```

## 🐛 Troubleshooting

### Deploy script permission denied
```bash
chmod +x deploy.sh
```

### sshpass not found (macOS)
```bash
brew install hudochenkov/sshpass/sshpass
```

### FTP connection timeout
Проверьте настройки файрвола Timeweb и доступы FTP в панели управления.

### Build failed
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Поддержка

При проблемах с деплоем проверьте:
1. ✅ Правильность данных в `.env`
2. ✅ Доступность FTP (проверьте в панели Timeweb)
3. ✅ Права на запись в `/public_html/`

---

Made with ❤️ by НЕЙРО МОДУЛЬ
