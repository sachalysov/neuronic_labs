import { Link, useLocation } from "react-router-dom"

export function Footer() {
  const location = useLocation()

  const navigateToSection = (id: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      window.location.href = `/#${id}`
    }
  }

  return (
    <footer className="py-8 sm:py-12 px-3 sm:px-4 border-t border-border mt-20">
      <div className="container mx-auto">
        {/* Верхняя часть - ссылки */}
        <div className="mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Продукт */}
            <div className="flex flex-col">
              <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Продукт</h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
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

            {/* О компании */}
            <div className="flex flex-col">
              <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">О компании</h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
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

            {/* Клиентам */}
            <div className="flex flex-col">
              <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Клиентам</h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
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
              </nav>
            </div>

            {/* Партнерам */}
            <div className="flex flex-col">
              <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Партнерам</h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
                <Link
                  to="/partners"
                  className="text-foreground/80 hover:text-primary transition-colors text-sm text-left"
                >
                  Партнерская программа
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Нижняя часть - логотип и копирайт */}
        <div className="text-center text-muted-foreground">
          <p className="text-base sm:text-lg mb-3 sm:mb-4">
            <span className="text-primary font-bold">NEURONIC</span>
            <span className="text-foreground font-bold">LABS</span>
          </p>
          <p className="text-sm sm:text-base">&copy; 2025 NEURONIC LABS. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

