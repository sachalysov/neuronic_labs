import { Link, useLocation, useNavigate } from "react-router-dom"
import { Mail, Send } from "lucide-react"

export function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  const navigateToSection = (id: string) => {
    if (location.pathname === '/') {
      // Если мы на главной, скроллим к секции
      scrollToSection(id)
    } else {
      // Если мы не на главной, переходим на главную с hash
      // HomePage сам обработает hash и прокрутит к секции
      navigate(`/#${id}`)
    }
  }

  const navigateToContactsSection = (id: string) => {
    if (location.pathname === '/contacts') {
      // Если мы на странице контактов, скроллим к секции
      scrollToSection(id)
    } else {
      // Если мы не на странице контактов, переходим на страницу контактов с hash
      navigate(`/contacts#${id}`)
    }
  }

  return (
    <footer className="py-8 sm:py-12 px-3 sm:px-4 border-t border-border mt-20 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-border">
          {/* Колонка 1 - Логотип и информация о компании */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">NEURONIC</span>
                <span className="text-2xl font-bold text-foreground">LABS</span>
              </div>
            </Link>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Агентство по внедрению нейро-продавцов и автоматизации бизнеса. Создаём ИИ-агентов и чат-ботов для автоматизации бизнеса. Интеллектуальная автоматизация процессов, интеграция ИИ в работу, автоматизация рутинных задач.
            </p>

             <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link
                to="/politika-konfidentsialnosti"
                className="text-primary hover:underline"
              >
                Политика конфиденциальности
              </Link>
              <Link
                to="/publichnaya-oferta"
                className="text-primary hover:underline"
              >
                Публичная оферта
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 © NEURONIC LABS. Все права защищены.
            </p>
           
          </div>

          {/* Колонка 2 - Продукт */}
          <div className="flex flex-col mt-6 sm:mt-0">
            <h3 className="text-foreground font-semibold mb-1.5 sm:mb-4 text-base">Продукт</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-3">
              <button
                onClick={() => navigateToSection("demo-chat")}
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Протестировать чат-бота
              </button>
              <button
                onClick={() => navigateToSection("product")}
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                О продукте
              </button>
              <button
                onClick={() => navigateToSection("pricing")}
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Тарифы и цены
              </button>
            </nav>
          </div>

          {/* Колонка 3 - О компании */}
          <div className="flex flex-col mt-6 sm:mt-0">
            <h3 className="text-foreground font-semibold mb-1.5 sm:mb-4 text-base">О компании</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-3">
              <button
                onClick={() => navigateToSection("about")}
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                О нас
              </button>
              <Link
                to="/blog"
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Блог
              </Link>
            </nav>
          </div>

          {/* Колонка 4 - Клиентам */}
          <div className="flex flex-col mt-6 sm:mt-0">
            <h3 className="text-foreground font-semibold mb-1.5 sm:mb-4 text-base">Клиентам</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-3">
              <Link
                to="/business-cases"
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Кейсы бизнеса
              </Link>
              <Link
                to="/contacts"
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Контакты
              </Link>
              <button
                onClick={() => navigateToContactsSection("payment-methods")}
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Способы оплаты
              </button>
              <Link
                to="/partners"
                className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
              >
                Партнерская программа
              </Link>
            </nav>
          </div>

          {/* Колонка 5 - Контакты */}
          <div className="flex flex-col mt-6 sm:mt-0">
            <h3 className="text-foreground font-semibold mb-1.5 sm:mb-4 text-base">Контакты</h3>
            <div className="flex flex-col gap-2 sm:gap-4">
              <div>
                <a
                  href="mailto:neuroniclabs@yandex.ru"
                  className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  neuroniclabs@yandex.ru
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  по всем вопросам и предложениям
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Телефоны и другие контакты находятся в разделе{" "}
                  <Link
                    to="/contacts"
                    className="text-primary hover:underline"
                  >
                    контакты
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Подписывайтесь на нас</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://t.me/neuroniclabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors"
                    aria-label="Telegram"
                  >
                    <Send className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

