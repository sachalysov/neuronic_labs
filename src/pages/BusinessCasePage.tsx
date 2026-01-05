import { useEffect, useState, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchBusinessCaseById, type BusinessCase } from "@/services/business-cases"
import { ArrowLeft, Loader2, TrendingUp, Users, Clock } from "lucide-react"
import { useMeta } from "@/hooks/useMeta"
import { createBusinessCaseMetaTags } from "@/lib/meta"

const iconMap: Record<string, typeof Users> = {
  Users,
  TrendingUp,
  Clock,
}

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
              <article className="pb-6 sm:pb-8 md:pb-12">
                {/* Hero Image */}
                {businessCase.image && (
                  <div className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
                    <img
                      src={businessCase.image}
                      alt={businessCase.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-primary/90 text-sm font-semibold rounded-full mb-2">
                        {businessCase.industry}
                      </span>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{businessCase.title}</h1>
                    </div>
                  </div>
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
                  <Card className="bg-card/10 border-border">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-3 text-foreground">Вызов</h2>
                      <p className="text-muted-foreground">{businessCase.challenge}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/10 border-border">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-3 text-foreground">Решение</h2>
                      <p className="text-muted-foreground">{businessCase.solution}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Full Content */}
                {businessCase.content && (
                  <div className="mt-8">
                    {renderContent(businessCase.content)}
                  </div>
                )}

                {/* Description if no content */}
                {!businessCase.content && businessCase.description && (
                  <div className="mt-8">
                    <p className="text-muted-foreground text-lg leading-relaxed">{businessCase.description}</p>
                  </div>
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

