import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HomePage from './pages/HomePage'

// Code splitting: Lazy loading для страниц блога (контент ниже первого экрана)
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

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
      </Routes>
    </BrowserRouter>
  )
}

export default App

