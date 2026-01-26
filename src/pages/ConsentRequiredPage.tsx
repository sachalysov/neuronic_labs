import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { Footer } from "@/components/footer"
import { Lock, ArrowLeft } from "lucide-react"
import { setConsentStatus } from "@/lib/consent"

export default function ConsentRequiredPage() {
  const navigate = useNavigate()

  const handleAccept = () => {
    setConsentStatus('accepted')
    navigate('/')
    // Перезагружаем страницу для применения изменений
    window.location.reload()
  }

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      <section className="relative overflow-hidden min-h-[80vh] flex items-center pb-0 pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/10 border-border">
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Доступ требует согласия
                  </h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    Для использования сайта необходимо согласие на обработку персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
                  </p>
                  <p className="text-base text-muted-foreground">
                    Без вашего согласия мы не можем предоставить доступ к сайту и его функциям.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleAccept} size="lg" className="min-w-[200px]">
                    Принять и продолжить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/politika-konfidentsialnosti')}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Политика конфиденциальности
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Вернуться на главную
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
