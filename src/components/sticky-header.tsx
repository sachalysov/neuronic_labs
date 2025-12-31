"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string; text: string }>>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      setSearchResults([])
      return
    }

    const sections = [
      { id: "demo-chat", title: "Чат-бот", selector: "#demo-chat" },
      { id: "product", title: "О продукте", selector: "#product" },
      { id: "process", title: "Этапы работ", selector: "#process" },
      { id: "about", title: "О нас", selector: "#about" },
      { id: "cases", title: "Кейсы бизнеса", selector: "#cases" },
      { id: "services", title: "Услуги", selector: "#services" },
    ]

    const results: Array<{ id: string; title: string; text: string }> = []
    const normalizedQuery = trimmedQuery.toLowerCase().replace(/\s+/g, '')

    sections.forEach((section) => {
      const element = document.querySelector(section.selector)
      if (element) {
        const text = element.textContent || ""
        const normalizedText = text.toLowerCase().replace(/\s+/g, '')
        const normalizedTitle = section.title.toLowerCase().replace(/\s+/g, '')
        
        if (normalizedText.includes(normalizedQuery) || normalizedTitle.includes(normalizedQuery)) {
          const index = text.toLowerCase().indexOf(trimmedQuery.toLowerCase())
          const start = Math.max(0, index > -1 ? index - 40 : 0)
          const end = Math.min(text.length, index > -1 ? index + trimmedQuery.length + 40 : 100)
          const snippet = text.substring(start, end).trim()
          
          results.push({
            id: section.id,
            title: section.title,
            text: snippet || text.substring(0, 100),
          })
        }
      }
    })

    setSearchResults(results)
  }

  const selectSearchResult = (id: string) => {
    scrollToSection(id)
    setSearchQuery("")
    setSearchResults([])
    setIsSearchOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">N</span>
                  <span className="text-2xl font-bold text-foreground">L</span>
                </div>
              </div>
            </div>
          </a>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-md mx-2 md:mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                className="w-full px-3 py-1.5 pl-8 pr-8 md:px-4 md:py-2 md:pl-10 md:pr-10 rounded-full bg-background/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ fontSize: '16px' }}
              />
              <svg
                className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              
              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                    setIsSearchOpen(false)
                  }}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors p-1"
                >
                  <svg
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Search Results */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => selectSearchResult(result.id)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border last:border-0"
                    >
                      <div className="font-medium text-foreground">{result.title}</div>
                      <div className="text-sm text-foreground/60 mt-1 line-clamp-2">{result.text}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearchOpen && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 px-4 py-3 text-foreground/60">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>

          {/* Navigation & Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("demo-chat")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Чат-бот
              </button>
              <button
                onClick={() => scrollToSection("product")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                О продукте
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Этапы работ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                О нас
              </button>
              <button
                onClick={() => scrollToSection("cases")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Кейсы бизнеса
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Услуги
              </button>
            </nav>

            <ThemeToggle />

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
          <nav className="lg:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("demo-chat")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Чат-бот
              </button>
              <button
                onClick={() => scrollToSection("product")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                О продукте
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Этапы работ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                О нас
              </button>
              <button
                onClick={() => scrollToSection("cases")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Кейсы бизнеса
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Услуги
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

