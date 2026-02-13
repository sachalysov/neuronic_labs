import { useEffect, useState, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchBlogPostBySlug, type BlogPost } from "@/services/blog"
import { Calendar, ArrowLeft, Loader2 } from "lucide-react"
import { useMeta } from "@/hooks/useMeta"
import { createBlogMetaTags } from "@/lib/meta"
import { formatDate } from "@/lib/utils"
import { OptimizedImage } from "@/components/optimized-image"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Устанавливаем мета-теги на основе загруженной статьи
  const metaTags = useMemo(() => {
    if (post && post.title) {
      return createBlogMetaTags(
        post.title,
        post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Статья блога NEURONIC LABS',
        post.imageUrl,
        `/blog/${post.slug}`
      )
    }
    // Пока статья не загружена, используем дефолтный title
    return createBlogMetaTags('Блог | NEURONIC LABS', undefined, undefined, '/blog')
  }, [post])
  
  useMeta(metaTags)

  useEffect(() => {
    if (!slug) {
      setError("Slug статьи не указан")
      setLoading(false)
      return
    }

    const loadPost = async () => {
      setLoading(true)
      setError(null)
      try {
        const blogPost = await fetchBlogPostBySlug(slug)
        if (!blogPost) {
          setError("Статья не найдена")
        } else {
          setPost(blogPost)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить статью")
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])


  const renderContent = (content: string) => {
    // Рендеринг HTML контента с кастомными стилями для секций
    return <div dangerouslySetInnerHTML={{ __html: content }} className="blog-content" />
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Post Content Section */}
      <section className="pt-32 pb-12 sm:pb-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к блогу
              </Button>
            </Link>
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Загрузка статьи...</span>
              </div>
            )}

            {error && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="p-6 text-center">
                  <p className="text-destructive font-medium mb-4">{error}</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/blog')} variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к блогу
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      Попробовать снова
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && post && (
              <article className="pb-6 sm:pb-8 md:pb-12">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.author && (
                      <>
                        <span>•</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

                {post.imageUrl && (
                  <div className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={post.imageUrl}
                      alt={`Иллюстрация к статье "${post.title}" - ${post.excerpt ? post.excerpt.substring(0, 100) : 'статья блога NEURONIC LABS об автоматизации бизнеса и ИИ'}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                )}

                <div className="mt-8">
                  {post.content ? (
                    renderContent(post.content)
                  ) : (
                    <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <Link to="/blog">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к блогу
                    </Button>
                  </Link>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </main>
  )
}

