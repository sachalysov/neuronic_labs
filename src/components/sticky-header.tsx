"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsMobileMenuOpen(false) // Закрываем меню после клика
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">NEURONIC</span>
                  <span className="text-2xl font-bold text-foreground">LABS</span>
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">
                  Агентство по внедрению
                  <br />
                  автоматизации в бизнес
                </div>
              </div>
            </div>
          </a>

          {/* Theme Toggle & Navigation */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("product")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                О продукте
              </button>
              <button
                onClick={() => scrollToSection("cases")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Кейсы бизнеса
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Этапы работ
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                О нас
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-foreground p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("product")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                О продукте
              </button>
              <button
                onClick={() => scrollToSection("cases")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Кейсы бизнеса
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Этапы работ
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                О нас
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

