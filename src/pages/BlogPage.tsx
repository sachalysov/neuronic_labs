import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchBlogPosts, type BlogPost } from "@/services/blog"
import { Calendar, ArrowRight, Loader2, Tag } from "lucide-react"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const blogPosts = await fetchBlogPosts()
        setPosts(blogPosts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить статьи")
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // Группировка статей по темам (тегам)
  const postsByTag = useMemo(() => {
    const grouped: Record<string, BlogPost[]> = {}
    
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          if (!grouped[tag]) {
            grouped[tag] = []
          }
          grouped[tag].push(post)
        })
      } else {
        // Статьи без тегов помещаем в общую категорию
        if (!grouped['Все статьи']) {
          grouped['Все статьи'] = []
        }
        grouped['Все статьи'].push(post)
      }
    })
    
    return grouped
  }, [posts])

  // Получаем список всех уникальных тегов
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [posts])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-primary">Блог</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
              Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Загрузка статей...</span>
            </div>
          )}

          {error && (
            <div className="max-w-3xl mx-auto text-center py-20">
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="p-6">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                  >
                    Попробовать снова
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="max-w-3xl mx-auto text-center py-20">
              <Card className="bg-card/10 border-border">
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg">
                    Статей пока нет. Скоро здесь появятся интересные материалы!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-7xl mx-auto">
              {/* Боковая колонка с навигацией по темам */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <Card className="bg-card/10 border-border">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Статьи по темам
                      </h2>
                      <nav className="space-y-4">
                        {allTags.length > 0 ? (
                          allTags.map((tag) => {
                            const tagPosts = postsByTag[tag] || []
                            return (
                              <div key={tag} className="border-b border-border pb-4 last:border-0 last:pb-0">
                                <h3 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                    {tagPosts.length}
                                  </span>
                                  {tag}
                                </h3>
                                <ul className="space-y-2">
                                  {tagPosts.slice(0, 5).map((post) => (
                                    <li key={post.id}>
                                      <Link
                                        to={`/blog/${post.id}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                                      >
                                        {post.title}
                                      </Link>
                                    </li>
                                  ))}
                                  {tagPosts.length > 5 && (
                                    <li>
                                      <span className="text-xs text-muted-foreground">
                                        и еще {tagPosts.length - 5}...
                                      </span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            <p>Статьи пока не имеют тегов</p>
                          </div>
                        )}
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Основной контент со статьями */}
              <div>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-card/10 border-border hover:border-primary transition-all duration-300 hover:scale-105 flex flex-col"
                    >
                      {post.imageUrl && (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                          {post.excerpt && (
                            <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                          )}
                          {!post.excerpt && post.content && (
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            {post.author && (
                              <div className="flex items-center gap-2">
                                <span>{post.author}</span>
                              </div>
                            )}
                          </div>
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Link to={`/blog/${post.id}`}>
                            <Button variant="outline" className="w-full">
                              Читать далее
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-4 border-t border-border mt-20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-base sm:text-lg mb-3 sm:mb-4">
            <span className="text-primary font-bold">NEURONIC</span>
            <span className="text-foreground font-bold">LABS</span>
          </p>
          <p className="text-sm sm:text-base">&copy; 2025 NEURONIC LABS. Все права защищены.</p>
        </div>
      </footer>

      <ChatWidget />
    </main>
  )
}

