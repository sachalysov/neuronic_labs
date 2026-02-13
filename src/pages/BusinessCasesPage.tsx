import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchBusinessCases, type BusinessCase } from "@/services/business-cases"
import { ArrowRight, Loader2, Users } from "lucide-react"
import { useMeta } from "@/hooks/useMeta"
import { createBusinessCaseMetaTags } from "@/lib/meta"
import { iconMap } from "@/lib/constants"
import { OptimizedImage } from "@/components/optimized-image"

export default function BusinessCasesPage() {
  useMeta(createBusinessCaseMetaTags(
    'Кейсы бизнеса | Реальные примеры внедрения ИИ-автоматизации',
    'Реальные кейсы внедрения ИИ-автоматизации в бизнес. Узнайте, как компании увеличили продажи, конверсию и оптимизировали процессы с помощью ИИ-агентов.',
    undefined,
    '/business-cases'
  ))
  
  const [cases, setCases] = useState<BusinessCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCases = async () => {
      setLoading(true)
      setError(null)
      try {
        const businessCases = await fetchBusinessCases()
        setCases(businessCases)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить кейсы")
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [])

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-primary">Кейсы бизнеса</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
              Реальные примеры внедрения ИИ-автоматизации и их результаты
            </p>
          </div>
        </div>
      </section>

      {/* Business Cases Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Загрузка кейсов...</span>
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

          {!loading && !error && cases.length === 0 && (
            <div className="max-w-3xl mx-auto text-center py-20">
              <Card className="bg-card/10 border-border">
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg">
                    Кейсы пока нет. Скоро здесь появятся интересные примеры!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !error && cases.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-6xl mx-auto">
              {cases.map((businessCase) => {
                return (
                  <article itemScope itemType="https://schema.org/CaseStudy">
                    <Link
                      key={businessCase.id}
                      to={`/business-cases/${businessCase.id}`}
                      className="block"
                    >
                      <Card className="bg-card/10 border-border hover:border-primary transition-all duration-300 lg:hover:scale-105 flex flex-col cursor-pointer h-full">
                        {businessCase.image && (
                          <header className="relative w-full h-48 overflow-hidden rounded-t-lg">
                            <figure className="relative w-full h-full">
                              <OptimizedImage
                                src={businessCase.image}
                                alt={`Кейс внедрения ИИ-автоматизации: ${businessCase.title} в отрасли ${businessCase.industry} - ${businessCase.description ? businessCase.description.substring(0, 80) : 'реальный пример автоматизации бизнеса'}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                itemProp="image"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                {businessCase.industry && (
                                  <span className="inline-block px-3 py-1 bg-primary/90 text-xs font-semibold rounded-full mb-2" itemProp="industry">
                                    {businessCase.industry}
                                  </span>
                                )}
                                <h2 className="text-xl font-bold text-white" itemProp="name">{businessCase.title}</h2>
                              </div>
                            </figure>
                          </header>
                        )}
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            {businessCase.description && (
                              <p className="text-muted-foreground mb-4 line-clamp-3" itemProp="description">{businessCase.description}</p>
                            )}
                          
                          {/* Results Preview */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {businessCase.results.slice(0, 3).map((result, idx) => {
                              const ResultIcon = iconMap[result.icon] || Users
                              return (
                                <div key={idx} className="text-center space-y-2">
                                  <div className="flex justify-center">
                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                      <ResultIcon className={`h-5 w-5 ${result.color}`} />
                                    </div>
                                  </div>
                                  <div>
                                    <p className={`text-xl font-bold ${result.color}`}>{result.value}</p>
                                    <p className="text-xs text-muted-foreground">{result.label}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button variant="outline" className="w-full pointer-events-none">
                            Подробнее
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </main>
  )
}

