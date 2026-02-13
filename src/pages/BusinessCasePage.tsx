import { useEffect, useState, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchBusinessCaseById, type BusinessCase } from "@/services/business-cases"
import { ArrowLeft, Loader2, Users } from "lucide-react"
import { useMeta } from "@/hooks/useMeta"
import { createBusinessCaseMetaTags } from "@/lib/meta"
import { iconMap } from "@/lib/constants"
import { OptimizedImage } from "@/components/optimized-image"
import { generateBusinessCaseSchema, generateBreadcrumbList, addSchemaToHead } from "@/lib/schema-org"

export default function BusinessCasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Устанавливаем мета-теги на основе загруженного кейса
  const metaTags = useMemo(() => {
    if (businessCase) {
      return createBusinessCaseMetaTags(
        businessCase.title,
        businessCase.description,
        businessCase.image,
        `/business-cases/${businessCase.id}`
      )
    }
    return createBusinessCaseMetaTags('Загрузка кейса...', undefined, undefined, id ? `/business-cases/${id}` : '/business-cases')
  }, [businessCase, id])
  
  useMeta(metaTags)

  // Генерируем Schema.org разметку для кейса и хлебных крошек
  useEffect(() => {
    if (businessCase) {
      const schema = generateBusinessCaseSchema({
        title: businessCase.title,
        description: businessCase.description,
        challenge: businessCase.challenge,
        solution: businessCase.solution,
        image: businessCase.image,
        industry: businessCase.industry,
        results: businessCase.results.map(r => ({ label: r.label, value: r.value })),
        publishedAt: businessCase.publishedAt,
        url: `https://neuroniclabs.ru/business-cases/${businessCase.id}`
      })
      addSchemaToHead(schema, 'schema-business-case')
      
      // Добавляем BreadcrumbList
      const breadcrumbSchema = generateBreadcrumbList([
        { name: 'Главная', url: '/' },
        { name: 'Кейсы бизнеса', url: '/business-cases' },
        { name: businessCase.title, url: `/business-cases/${businessCase.id}` }
      ])
      addSchemaToHead(breadcrumbSchema, 'schema-breadcrumb')
    }
  }, [businessCase])

  useEffect(() => {
    if (!id) {
      setError("ID кейса не указан")
      setLoading(false)
      return
    }

    const loadCase = async () => {
      setLoading(true)
      setError(null)
      try {
        const caseData = await fetchBusinessCaseById(id)
        if (!caseData) {
          setError("Кейс не найден")
        } else {
          setBusinessCase(caseData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить кейс")
      } finally {
        setLoading(false)
      }
    }

    loadCase()
  }, [id])

  const renderContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} className="business-case-content prose prose-invert max-w-none" />
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Case Content Section */}
      <section className="pt-32 pb-12 sm:pb-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/business-cases">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к кейсам
              </Button>
            </Link>
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Загрузка кейса...</span>
              </div>
            )}

            {error && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="p-6 text-center">
                  <p className="text-destructive font-medium mb-4">{error}</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/business-cases')} variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к кейсам
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      Попробовать снова
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && businessCase && (
              <article className="pb-6 sm:pb-8 md:pb-12" itemScope itemType="https://schema.org/CaseStudy">
                {/* Hero Image */}
                {businessCase.image && (
                  <header className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
                    <figure className="relative w-full h-full">
                      <OptimizedImage
                        src={businessCase.image}
                        alt={`Кейс внедрения ИИ-автоматизации: ${businessCase.title} в отрасли ${businessCase.industry} - ${businessCase.description ? businessCase.description.substring(0, 100) : 'реальный пример автоматизации бизнеса с помощью ИИ'}`}
                        className="w-full h-full object-cover"
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 800px"
                        itemProp="image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        {businessCase.industry && (
                          <span className="inline-block px-3 py-1 bg-primary/90 text-sm font-semibold rounded-full mb-2" itemProp="industry">
                            {businessCase.industry}
                          </span>
                        )}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" itemProp="name">{businessCase.title}</h1>
                      </div>
                    </figure>
                  </header>
                )}

                {/* Results */}
                <div className="mb-8">
                  <div className="grid grid-cols-3 gap-4">
                    {businessCase.results.map((result, idx) => {
                      const ResultIcon = iconMap[result.icon] || Users
                      return (
                        <Card key={idx} className="bg-card/10 border-border">
                          <CardContent className="p-6 text-center space-y-2">
                            <div className="flex justify-center">
                              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                                <ResultIcon className={`h-6 w-6 ${result.color}`} />
                              </div>
                            </div>
                            <div>
                              <p className={`text-2xl font-bold ${result.color}`}>{result.value}</p>
                              <p className="text-sm text-muted-foreground">{result.label}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="mb-8 space-y-4">
                  <section>
                    <Card className="bg-card/10 border-border">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-3 text-foreground">Вызов</h2>
                        <p className="text-muted-foreground" itemProp="problem">{businessCase.challenge}</p>
                      </CardContent>
                    </Card>
                  </section>
                  <section>
                    <Card className="bg-card/10 border-border">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-3 text-foreground">Решение</h2>
                        <p className="text-muted-foreground" itemProp="solution">{businessCase.solution}</p>
                      </CardContent>
                    </Card>
                  </section>
                </div>

                {/* Full Content */}
                {businessCase.content && (
                  <section className="mt-8" itemProp="description">
                    {renderContent(businessCase.content)}
                  </section>
                )}

                {/* Description if no content */}
                {!businessCase.content && businessCase.description && (
                  <section className="mt-8">
                    <p className="text-muted-foreground text-lg leading-relaxed" itemProp="description">{businessCase.description}</p>
                  </section>
                )}

                <div className="mt-12 pt-8 border-t border-border">
                  <Link to="/business-cases">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к кейсам
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

