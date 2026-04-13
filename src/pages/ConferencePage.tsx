import { Link } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { ChatWidget } from "@/components/chat-widget"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


import {
  Calendar,
  MessageCircle,
  ArrowRight,
  Bot,
} from "lucide-react"

export default function ConferencePage() {


  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-primary">Для участников конференции</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8">
              Специальные предложения для участников AI-Fest
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 md:gap-8">
            {/* Кнопка 0: Протестировать Нейро продавца */}
            <Card className="bg-card/10 border-border hover:border-primary transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Протестируйте Нейро продавца
                      </h3>
                      <p className="text-muted-foreground">
                        Убедитесь в работе ИИ-продавца на главной странице — попробуйте демо-чат и оцените, как бот общается с клиентами
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link to="/#demo-chat">
                      Перейти к демо
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопка 1: Бесплатный аудит */}
            <Card className="bg-card/10 border-border hover:border-primary transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Запишитесь на бесплатный аудит вашего бизнеса
                      </h3>
                      <p className="text-muted-foreground">
                        Получите профессиональную консультацию и узнайте как автоматизировать ваш бизнес с помощью ИИ
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a 
                      href="https://t.me/aslysov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Записаться на аудит
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопка 2: Телеграм канал */}
            <Card className="bg-card/10 border-border hover:border-primary transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Бесплатный бот финансит в телеграм
                      </h3>
                      <p className="text-muted-foreground">
                        Только для участников AI-Fest. Получите доступ к эксклюзивным материалам и боту
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a 
                      href="https://t.me/neuroniclabs_financier_bot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Перейти
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопка 3: Бот транскрибатор */}
            <Card className="bg-card/10 border-border hover:border-primary transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Бесплатный бот транскрибатор в телеграм
                      </h3>
                      <p className="text-muted-foreground">
                        Только для участников AI-Fest. Получите доступ к боту-транскрибатору для расшифровки аудио и видео
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a 
                      href="https://t.me/neuroniclabs_transcriber_bot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Перейти
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </main>
  )
}

