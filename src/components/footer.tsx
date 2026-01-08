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
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            <button
              onClick={() => navigateToSection("demo-chat")}
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              Протестировать чат-бота
            </button>
            <button
              onClick={() => navigateToSection("product")}
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              О продукте
            </button>
            <button
              onClick={() => navigateToSection("pricing")}
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              Тарифы и цены
            </button>
            <button
              onClick={() => navigateToSection("about")}
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              О нас
            </button>
            <Link
              to="/business-cases"
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              Кейсы бизнеса
            </Link>
            <Link
              to="/blog"
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              Блог
            </Link>
            <Link
              to="/partners"
              className="text-foreground/80 hover:text-primary transition-colors text-sm sm:text-base"
            >
              Партнерская программа
            </Link>
          </nav>
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

