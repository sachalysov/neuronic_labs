import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HomePage from './pages/HomePage'

// Code splitting: Lazy loading для страниц блога (контент ниже первого экрана)
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const BusinessCasesPage = lazy(() => import('./pages/BusinessCasesPage'))
const BusinessCasePage = lazy(() => import('./pages/BusinessCasePage'))
const PartnerPage = lazy(() => import('./pages/PartnerPage'))
const ContactsPage = lazy(() => import('./pages/ContactsPage'))

// Fallback компонент для загрузки (минимальный, чтобы не блокировать рендер)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Загрузка...</div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
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
          path="/blog/:id" 
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
      </Routes>
    </BrowserRouter>
  )
}

export default App

