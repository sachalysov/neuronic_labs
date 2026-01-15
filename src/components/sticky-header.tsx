"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"
import { search, type SearchResult } from "@/services/search"
import { getAdminSettings, subscribeToAdminSettings, type AdminSettings } from "@/services/admin-settings"

const DEFAULT_MAINTENANCE_TEXT = 'На сайте ведутся технические работы. Возможны временные сбои в работе.'

interface StickyHeaderProps {
  onOpenDemoChat?: () => void
}

export function StickyHeader({ onOpenDemoChat }: StickyHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showMaintenanceBanner, setShowMaintenanceBanner] = useState(false)
  const [maintenanceText, setMaintenanceText] = useState(DEFAULT_MAINTENANCE_TEXT)
  const menuDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Загрузка настроек из Supabase
    const loadSettings = async () => {
      try {
        const settings = await getAdminSettings()
        if (settings) {
          setShowMaintenanceBanner(settings.maintenance_banner_enabled)
          setMaintenanceText(settings.maintenance_banner_text || DEFAULT_MAINTENANCE_TEXT)
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
        setShowMaintenanceBanner(false)
        setMaintenanceText(DEFAULT_MAINTENANCE_TEXT)
      }
    }

    loadSettings()

    // Подписка на изменения настроек в реальном времени
    const unsubscribe = subscribeToAdminSettings((settings: AdminSettings) => {
      setShowMaintenanceBanner(settings.maintenance_banner_enabled)
      setMaintenanceText(settings.maintenance_banner_text || DEFAULT_MAINTENANCE_TEXT)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (menuDropdownTimeoutRef.current) {
        clearTimeout(menuDropdownTimeoutRef.current)
      }
      if (productDropdownTimeoutRef.current) {
        clearTimeout(productDropdownTimeoutRef.current)
      }
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: "auto" })
      setIsMobileMenuOpen(false) // Закрываем меню после клика
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
    setIsMobileMenuOpen(false)
  }

  const navigateToContactsSection = (id: string) => {
    if (location.pathname === '/contacts') {
      // Если мы на странице контактов, скроллим к секции
      scrollToSection(id)
    } else {
      // Если мы не на странице контактов, переходим на страницу контактов с hash
      navigate(`/contacts#${id}`)
    }
    setIsMobileMenuOpen(false)
  }

  const handleChatBotClick = () => {
    // На мобильных устройствах (меньше md breakpoint = 768px) открываем демо чат
    // На более широких экранах переходим к секции
    if (window.innerWidth < 768 && onOpenDemoChat && location.pathname === '/') {
      onOpenDemoChat()
      setIsMobileMenuOpen(false)
    } else {
      navigateToSection("demo-chat")
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      setSearchResults([])
      setIsSearchLoading(false)
      return
    }

    // Debounce: ждем 300ms перед поиском
    setIsSearchLoading(true)
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await search(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Ошибка поиска:', error)
        setSearchResults([])
      } finally {
        setIsSearchLoading(false)
      }
    }, 300)
  }

  const selectSearchResult = (result: SearchResult) => {
    if (result.type === 'section') {
      // Для секций главной страницы
      if (location.pathname === '/') {
        scrollToSection(result.id)
      } else {
        navigate(`/#${result.id}`)
      }
    } else {
      // Для страниц, блогов и кейсов - навигация
      navigate(result.url)
    }
    
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
      {showMaintenanceBanner && (
        <div className="w-full bg-destructive text-destructive-foreground text-xs sm:text-sm text-center py-1 px-2">
          {maintenanceText}
        </div>
      )}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline sm:gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-primary">N</span>
                  <span className="text-xl sm:text-2xl font-bold text-foreground">LABS</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-2 md:mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                className="w-full px-2 py-1.5 pl-6 pr-6 sm:px-3 sm:pl-8 sm:pr-8 md:px-4 md:py-2 md:pl-10 md:pr-10 rounded-full bg-background/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                style={{ fontSize: '16px' }}
              />
              <svg
                className="hidden sm:block absolute left-1.5 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-foreground/50"
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
                  className="absolute right-1.5 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors p-0.5 sm:p-1"
                >
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Search Results */}
              {isSearchOpen && (searchResults.length > 0 || isSearchLoading) && (
                <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {isSearchLoading ? (
                    <div className="px-2 sm:px-4 py-2 sm:py-3 text-foreground/60 text-xs sm:text-sm text-center">
                      Поиск...
                    </div>
                  ) : (
                    searchResults.map((result) => {
                      const typeLabels: Record<SearchResult['type'], string> = {
                        section: 'Секция',
                        blog: 'Статья',
                        case: 'Кейс',
                        page: 'Страница'
                      }
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => selectSearchResult(result)}
                          className="w-full text-left px-2 sm:px-4 py-2 sm:py-3 hover:bg-primary/10 transition-colors border-b border-border last:border-0"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground text-sm sm:text-base truncate">
                                {result.title}
                              </div>
                              <div className="text-xs sm:text-sm text-foreground/60 mt-1 line-clamp-2">
                                {result.text}
                              </div>
                              {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.metadata.tags.slice(0, 2).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-foreground/40 whitespace-nowrap ml-2">
                              {typeLabels[result.type]}
                            </span>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
              
              {isSearchOpen && searchQuery.length >= 2 && !isSearchLoading && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 px-2 sm:px-4 py-2 sm:py-3 text-foreground/60 text-xs sm:text-sm">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>

          {/* Navigation & Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => navigateToSection("demo-chat")}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Протестировать чат-бот
              </button>
              <Link
                to="/"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: "auto" })
                }}
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Главная
              </Link>
              <div
                className="relative"
                onMouseEnter={() => {
                  if (productDropdownTimeoutRef.current) {
                    clearTimeout(productDropdownTimeoutRef.current)
                  }
                  setIsProductDropdownOpen(true)
                }}
                onMouseLeave={() => {
                  productDropdownTimeoutRef.current = setTimeout(() => {
                    setIsProductDropdownOpen(false)
                  }, 150)
                }}
              >
                <button
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className="text-foreground/90 hover:text-primary transition-colors font-medium flex items-center gap-1"
                >
                  О продукте
                  <svg
                    className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={() => {
                      if (productDropdownTimeoutRef.current) {
                        clearTimeout(productDropdownTimeoutRef.current)
                      }
                    }}
                    onMouseLeave={() => {
                      productDropdownTimeoutRef.current = setTimeout(() => {
                        setIsProductDropdownOpen(false)
                      }, 150)
                    }}
                  >
                    <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden min-w-max">
                      <button
                        onClick={() => {
                          navigateToSection("product")
                          setIsProductDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        О продукте
                      </button>
                      <button
                        onClick={() => {
                          navigateToSection("pricing")
                          setIsProductDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Тарифы и цены
                      </button>
                      <Link
                        to="/calculator"
                        onClick={() => setIsProductDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Рассчитать стоимость внедрения самостоятельно
                      </Link>
                      <Link
                        to="/business-cases"
                        onClick={() => setIsProductDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Кейсы бизнеса
                      </Link>
                      <button
                        onClick={() => {
                          navigateToSection("testimonials")
                          setIsProductDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Отзывы клиентов
                      </button>
                      <button
                        onClick={() => {
                          navigateToSection("faq")
                          setIsProductDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Частые вопросы
                      </button>
                    </div>
                  </div>
                )}
              </div>
             
              <div
                className="relative"
                onMouseEnter={() => {
                  if (menuDropdownTimeoutRef.current) {
                    clearTimeout(menuDropdownTimeoutRef.current)
                  }
                  setIsMenuDropdownOpen(true)
                }}
                onMouseLeave={() => {
                  menuDropdownTimeoutRef.current = setTimeout(() => {
                    setIsMenuDropdownOpen(false)
                  }, 150)
                }}
              >
                <button
                  onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  className="text-foreground/90 hover:text-primary transition-colors font-medium flex items-center gap-1"
                >
                  О нас
                  <svg
                    className={`w-4 h-4 transition-transform ${isMenuDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={() => {
                      if (menuDropdownTimeoutRef.current) {
                        clearTimeout(menuDropdownTimeoutRef.current)
                      }
                    }}
                    onMouseLeave={() => {
                      menuDropdownTimeoutRef.current = setTimeout(() => {
                        setIsMenuDropdownOpen(false)
                      }, 150)
                    }}
                  >
                    <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden min-w-max">
                      <Link
                        to="/partners"
                        onClick={() => setIsMenuDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Партнерская программа
                      </Link>
                      <button
                        onClick={() => {
                          navigateToSection("about")
                          setIsMenuDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        О нас
                      </button>
                      <Link
                        to="/contacts"
                        onClick={() => setIsMenuDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Контакты
                      </Link>
                      <Link
                        to="/conference"
                        onClick={() => setIsMenuDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Для участников конференции
                      </Link>
                      <button
                        onClick={() => {
                          navigateToContactsSection("payment-methods")
                          setIsMenuDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors font-medium whitespace-nowrap"
                      >
                        Способы оплаты
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/blog"
                className="text-foreground/90 hover:text-primary transition-colors font-medium"
              >
                Блог
              </Link>
            </nav>

            <ThemeToggle />

            <a 
              href="tel:+79930799177" 
              className="hidden md:flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm sm:text-base">+7 993 079 91 77</span>
            </a>

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
                onClick={handleChatBotClick}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Протестировать чат-бот
              </button>
              <Link
                to="/"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: "auto" })
                }}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Главная
              </Link>
              <div className="px-2">
                <button
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className="text-foreground/90 hover:text-primary transition-colors font-medium text-left flex items-center justify-between w-full py-2"
                >
                  <span>О продукте</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-border">
                    <button
                      onClick={() => {
                        navigateToSection("product")
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      О продукте
                    </button>
                    <button
                      onClick={() => {
                        navigateToSection("pricing")
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Тарифы и цены
                    </button>
                    <Link
                      to="/calculator"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Рассчитать стоимость внедрения самостоятельно
                    </Link>
                    <Link
                      to="/business-cases"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Кейсы бизнеса
                    </Link>
                    <button
                      onClick={() => {
                        navigateToSection("testimonials")
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Отзывы клиентов
                    </button>
                    <button
                      onClick={() => {
                        navigateToSection("faq")
                        setIsMobileMenuOpen(false)
                        setIsProductDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Частые вопросы
                    </button>
                  </div>
                )}
              </div>
              <div className="px-2">
                <button
                  onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  className="text-foreground/90 hover:text-primary transition-colors font-medium text-left flex items-center justify-between w-full py-2"
                >
                  <span>О нас</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isMenuDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-border">
                    <Link
                      to="/partners"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsMenuDropdownOpen(false)
                      }}
                      className="block text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Партнерская программа
                    </Link>
                    <button
                      onClick={() => {
                        navigateToSection("about")
                        setIsMenuDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      О нас
                    </button>
                    <Link
                      to="/contacts"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsMenuDropdownOpen(false)
                      }}
                      className="block text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Контакты
                    </Link>
                    <Link
                      to="/conference"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsMenuDropdownOpen(false)
                      }}
                      className="block text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Для участников конференции
                    </Link>
                    <button
                      onClick={() => {
                        navigateToContactsSection("payment-methods")
                        setIsMenuDropdownOpen(false)
                      }}
                      className="block text-left text-foreground/90 hover:text-primary transition-colors font-medium py-2"
                    >
                      Способы оплаты
                    </button>
                  </div>
                )}
              </div>
              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground/90 hover:text-primary transition-colors font-medium text-left px-2 py-2"
              >
                Блог
              </Link>
              <a 
                href="tel:+79930799177" 
                className="flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors font-medium px-2 py-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+7 993 079 91 77</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

