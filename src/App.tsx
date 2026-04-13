import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ConsentGate } from './components/consent-gate'

// Главная — lazy, чтобы не тянуть ~2000 строк и все секции в основной поток (Lighthouse: минимизировать работу main thread)
const HomePage = lazy(() => import('./pages/HomePage'))

const ADMIN_THEME_STORAGE_KEY = "admin_theme"
const USER_THEME_STORAGE_KEY = "theme"

// Code splitting: Lazy loading для страниц блога (контент ниже первого экрана)
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const BusinessCasesPage = lazy(() => import('./pages/BusinessCasesPage'))
const BusinessCasePage = lazy(() => import('./pages/BusinessCasePage'))
const PartnerPage = lazy(() => import('./pages/PartnerPage'))
const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const ConferencePage = lazy(() => import('./pages/ConferencePage'))
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'))
const ChatBotLandingPage = lazy(() => import('./pages/ChatBotLandingPage'))

// Админ-страницы: lazy loading для уменьшения начального бандла
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminBlogPage = lazy(() => import('./pages/AdminBlogPage'))
const AdminBusinessCasesPage = lazy(() => import('./pages/AdminBusinessCasesPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const OfferPage = lazy(() => import('./pages/OfferPage'))
const ConsentRequiredPage = lazy(() => import('./pages/ConsentRequiredPage'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Загрузка...</div>
  </div>
)

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

// При смене страницы — прокрутка вверх (ссылки в хедере/футере)
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function applyThemeFromStorage(storageKey: string) {
  const saved = localStorage.getItem(storageKey) as "light" | "dark" | null
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const theme = saved ?? (prefersDark ? "dark" : "light")
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark"
  } else {
    delete document.documentElement.dataset.theme
  }
}

function ThemeManager() {
  const location = useLocation()

  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin')
    applyThemeFromStorage(isAdminPage ? ADMIN_THEME_STORAGE_KEY : USER_THEME_STORAGE_KEY)

    // Слушаем изменения темы админки
    const handleAdminThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">
      if (location.pathname.startsWith('/admin')) {
        if (customEvent.detail === "dark") {
          document.documentElement.dataset.theme = "dark"
        } else {
          delete document.documentElement.dataset.theme
        }
      }
    }

    window.addEventListener("admin-theme-changed", handleAdminThemeChange as EventListener)

    return () => {
      window.removeEventListener("admin-theme-changed", handleAdminThemeChange as EventListener)
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ThemeManager />
      <ScrollToTop />
      <ConsentGate>
        <Routes>
          <Route path="/" element={<S><HomePage /></S>} />
          <Route path="/blog" element={<S><BlogPage /></S>} />
          <Route path="/blog/:slug" element={<S><BlogPostPage /></S>} />
          <Route path="/business-cases" element={<S><BusinessCasesPage /></S>} />
          <Route path="/business-cases/:id" element={<S><BusinessCasePage /></S>} />
          <Route path="/partners" element={<S><PartnerPage /></S>} />
          <Route path="/contacts" element={<S><ContactsPage /></S>} />
          <Route path="/conference" element={<S><ConferencePage /></S>} />
          <Route path="/calculator" element={<S><CalculatorPage /></S>} />
          <Route path="/chatbot" element={<S><ChatBotLandingPage /></S>} />
          <Route path="/politika-konfidentsialnosti" element={<S><PrivacyPolicyPage /></S>} />
          <Route path="/publichnaya-oferta" element={<S><OfferPage /></S>} />
          <Route path="/consent-required" element={<S><ConsentRequiredPage /></S>} />
          <Route path="/admin" element={<S><AdminDashboardPage /></S>} />
          <Route path="/admin/login" element={<S><AdminLoginPage /></S>} />
          <Route path="/admin/blog" element={<S><AdminBlogPage /></S>} />
          <Route path="/admin/business-cases" element={<S><AdminBusinessCasesPage /></S>} />
        </Routes>
      </ConsentGate>
    </BrowserRouter>
  )
}

export default App

