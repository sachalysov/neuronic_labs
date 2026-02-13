import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import HomePage from './pages/HomePage'
import { ConsentGate } from './components/consent-gate'

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

// Админ-страницы: lazy loading для уменьшения начального бандла
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminBlogPage = lazy(() => import('./pages/AdminBlogPage'))
const AdminBusinessCasesPage = lazy(() => import('./pages/AdminBusinessCasesPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const OfferPage = lazy(() => import('./pages/OfferPage'))
const ConsentRequiredPage = lazy(() => import('./pages/ConsentRequiredPage'))

// Fallback компонент для загрузки (минимальный, чтобы не блокировать рендер)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Загрузка...</div>
  </div>
)

// При смене страницы — прокрутка вверх (ссылки в хедере/футере)
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Компонент для управления темой в зависимости от пути
function ThemeManager() {
  const location = useLocation()

  useEffect(() => {
    const applyTheme = () => {
      const isAdminPage = location.pathname.startsWith('/admin')
      
      if (isAdminPage) {
        // Применяем тему админки
        const adminTheme = localStorage.getItem(ADMIN_THEME_STORAGE_KEY) as "light" | "dark" | null
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const theme = adminTheme || (prefersDark ? "dark" : "light")
        
        if (theme === "dark") {
          document.documentElement.dataset.theme = "dark"
        } else {
          delete document.documentElement.dataset.theme
        }
      } else {
        // Применяем тему пользователя
        const userTheme = localStorage.getItem(USER_THEME_STORAGE_KEY) as "light" | "dark" | null
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const theme = userTheme || (prefersDark ? "dark" : "light")
        
        if (theme === "dark") {
          document.documentElement.dataset.theme = "dark"
        } else {
          delete document.documentElement.dataset.theme
        }
      }
    }

    applyTheme()

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
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/blog" 
            element={
              <Suspense fallback={<PageLoader />}>
                <BlogPage />
              </Suspense>
            } 
          />
          <Route 
            path="/blog/:slug" 
            element={
              <Suspense fallback={<PageLoader />}>
                <BlogPostPage />
              </Suspense>
            } 
          />
          <Route 
            path="/business-cases" 
            element={
              <Suspense fallback={<PageLoader />}>
                <BusinessCasesPage />
              </Suspense>
            } 
          />
          <Route 
            path="/business-cases/:id" 
            element={
              <Suspense fallback={<PageLoader />}>
                <BusinessCasePage />
              </Suspense>
            } 
          />
          <Route 
            path="/partners" 
            element={
              <Suspense fallback={<PageLoader />}>
                <PartnerPage />
              </Suspense>
            } 
          />
          <Route 
            path="/contacts" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ContactsPage />
              </Suspense>
            } 
          />
          <Route 
            path="/conference" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ConferencePage />
              </Suspense>
            } 
          />
          <Route 
            path="/calculator" 
            element={
              <Suspense fallback={<PageLoader />}>
                <CalculatorPage />
              </Suspense>
            } 
          />
          {/* Страницы, доступные без согласия */}
          <Route 
            path="/politika-konfidentsialnosti" 
            element={
              <Suspense fallback={<PageLoader />}>
                <PrivacyPolicyPage />
              </Suspense>
            } 
          />
          <Route 
            path="/publichnaya-oferta" 
            element={
              <Suspense fallback={<PageLoader />}>
                <OfferPage />
              </Suspense>
            } 
          />
          <Route 
            path="/consent-required" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ConsentRequiredPage />
              </Suspense>
            } 
          />
          {/* Админ-панель доступна без согласия */}
          <Route 
            path="/admin" 
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminDashboardPage />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminLoginPage />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/blog" 
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminBlogPage />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/business-cases" 
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminBusinessCasesPage />
              </Suspense>
            } 
          />
        </Routes>
      </ConsentGate>
    </BrowserRouter>
  )
}

export default App

