import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChatWidget } from "@/components/chat-widget"
import { StickyHeader } from "@/components/sticky-header"
import { DemoChat } from "@/components/demo-chat"
import { BusinessCasesCarousel } from "@/components/business-cases-carousel"
import {
  Bot,
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  HeadphonesIcon,
  Lightbulb,
  Users,
  ArrowRight,
  Target,
  Award,
  Zap,
} from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/robot-hero-2.jpeg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 hero-image-overlay" />
          <div className="absolute bottom-0 left-0 right-0 h-32 hero-bottom-fade" />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-20 z-[1]" />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="space-y-8">
              <div className="inline-block">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
                  <span className="text-primary">NEURONIC</span> <br />
                  <span className="text-muted-foreground">LABS</span>
                </h1>
                <p className="text-muted-foreground text-[20px] uppercase tracking-wider">
                  Агентство по внедрению
               
                  автоматизации в бизнес
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Внедряем решение под ключ за 14 дней
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                ИИ-сотрудник работает 24/7, увеличивает заявки в 2-3 раза и снижает фонд оплаты труда
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  Получить консультацию
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chat Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Попробуйте ИИ-продавца прямо сейчас</h2>
            <p className="text-xl text-muted-foreground">
              Задайте вопрос нашему ИИ-ассистенту и убедитесь в его возможностях. Он отвечает мгновенно, консультирует и
              закрывает возражения 24/7.
            </p>
          </div>

          <DemoChat />

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Демо-версия показывает базовые возможности. Полная версия подключается через вебхук к вашей системе
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="product" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
            Внедряем решение под ключ за 14 дней
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Грамотно внедренный ИИ-продавец + мультиканален + Яндекс. Директ может увеличить конверсию в заявку в 2-3
            раза
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">ИИ-сотрудник работает 24/7, пока конкуренты спят</h3>
                <p className="text-muted-foreground">
                  Мгновенно отвечает на любые вопросы, 24/7 - круглосуточная коммуникация, недоступная вашим конкурентам
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">В 2-3 раза больше клиентов</h3>
                <p className="text-muted-foreground">
                  Грамотно внедренный ИИ-продавец + мультиканален + Яндекс. Директ может увеличить конверсию в заявку в
                  2-3 раза
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Сокращение фонда оплаты труда</h3>
                <p className="text-muted-foreground">
                  Один ИИ-продавец способен полностью заменить линейных менеджеров, которые занимаются первичной
                  обработкой лидов и справляется с любым объемом заявок
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Мгновенные ответы клиентам</h3>
                <p className="text-muted-foreground">
                  ИИ отвечает мгновенно, не заставляя клиентов ждать. Быстрая реакция повышает доверие и увеличивает
                  конверсию
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Как мы работаем</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Анализ бизнеса</h3>
              <p className="text-muted-foreground">Изучаем ваши процессы, потребности клиентов и точки автоматизации</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Разработка решения</h3>
              <p className="text-muted-foreground">Создаем и обучаем ИИ-сотрудника под специфику вашего бизнеса</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Внедрение и поддержка</h3>
              <p className="text-muted-foreground">Интегрируем систему и обеспечиваем постоянную техподдержку</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">О нас</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы команда экспертов в области искусственного интеллекта и автоматизации бизнес-процессов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">200+</h3>
                  <p className="text-muted-foreground">Успешно внедренных проектов</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">5 лет</h3>
                  <p className="text-muted-foreground">Опыта в разработке ИИ-решений</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">14 дней</h3>
                  <p className="text-muted-foreground">Среднее время внедрения</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold">Наша миссия</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Мы помогаем бизнесу расти, внедряя передовые технологии искусственного интеллекта. Наша цель —
                    сделать ИИ-автоматизацию доступной для компаний любого масштаба, от стартапов до крупных корпораций.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    За годы работы мы разработали проверенную методологию внедрения, которая гарантирует результат за 14
                    дней. Мы не просто создаем ИИ-ассистентов — мы интегрируем их в бизнес-процессы так, чтобы они
                    приносили реальную прибыль с первого дня работы.
                  </p>
                  <div className="pt-4">
                    <h4 className="text-xl font-bold mb-4">Наши ценности:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Прозрачность — вы всегда знаете, на каком этапе находится проект</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Результативность — фокусируемся на метриках, которые важны для вашего бизнеса</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Инновации — используем только проверенные и эффективные технологии</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Cases Section */}
      <section id="cases" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Кейсы бизнеса</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные результаты внедрения ИИ-автоматизации в различных отраслях
            </p>
          </div>

          <BusinessCasesCarousel />

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Хотите получить такие же результаты для вашего бизнеса?</p>
            <Button size="lg" className="text-lg px-8 py-6">
              Обсудить ваш проект
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Сценарии использования</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Продажи</h3>
                <p className="text-muted-foreground">Консультация клиентов, презентация продуктов, закрытие сделок</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <HeadphonesIcon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Поддержка</h3>
                <p className="text-muted-foreground">Ответы на частые вопросы, решение проблем клиентов 24/7</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Лидогенерация</h3>
                <p className="text-muted-foreground">Квалификация лидов, сбор контактов, запись на встречи</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Консультации</h3>
                <p className="text-muted-foreground">Экспертные советы, подбор решений, персональные рекомендации</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-balance">Готовы внедрить ИИ в ваш бизнес?</h2>
                <p className="text-xl text-muted-foreground">
                  Оставьте заявку, и наши эксперты свяжутся с вами в течение 15 минут, чтобы обсудить возможности
                  автоматизации вашего бизнеса
                </p>

                <form className="max-w-md mx-auto space-y-4">
                  <Input type="text" placeholder="Ваше имя" className="bg-background border-border" />
                  <Input type="tel" placeholder="Телефон" className="bg-background border-border" />
                  <Input type="email" placeholder="Email" className="bg-background border-border" />
                  <Button size="lg" className="w-full text-lg py-6">
                    Получить бесплатную консультацию
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-lg mb-4">
            <span className="text-primary font-bold">NEURO</span>
            <span className="text-foreground font-bold">MODUL</span>
          </p>
          <p>&copy; 2025 NeuroModul. Все права защищены.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}

