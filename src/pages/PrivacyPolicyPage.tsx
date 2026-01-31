import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { StickyHeader } from "@/components/sticky-header"
import { SpaceDust } from "@/components/space-dust"
import { Footer } from "@/components/footer"
import { useMeta } from "@/hooks/useMeta"
import { createPrivacyPolicyMetaTags } from "@/lib/meta"
import { Shield, FileText, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  const location = useLocation()
  useMeta(createPrivacyPolicyMetaTags())

  useEffect(() => {
    const hash = location.hash.substring(1)
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        setTimeout(() => {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({ top: offsetPosition, behavior: "auto" })
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname)
          }, 100)
        }, 50)
      } else {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [location.hash])

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pb-0 pt-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 pt-3 pb-0 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-6">
              <span className="text-primary">Политика конфиденциальности</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
              Обработка персональных данных в соответствии с 152-ФЗ
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* Оператор персональных данных */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Оператор персональных данных</h2>
                    <div className="space-y-2 text-base">
                      <p><strong>Наименование:</strong> NEURONIC LABS</p>
                      <p><strong>ИНН:</strong> 130102424667</p>
                      <p><strong>Адрес:</strong> Россия, Санкт-Петербург</p>
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:neuroniclabs@yandex.ru"
                          className="text-primary hover:underline"
                        >
                          neuroniclabs@yandex.ru
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Какие персональные данные мы собираем */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      Какие персональные данные мы собираем
                    </h2>
                    <p className="mb-4">
                      При использовании сайта и наших услуг мы собираем следующие персональные данные:
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>Имя</strong> — при заполнении форм обратной связи</li>
                      <li><strong>Номер телефона</strong> — при заполнении форм обратной связи и использовании чата</li>
                      <li><strong>Email адрес</strong> — при заполнении форм обратной связи</li>
                      <li><strong>Сообщения и комментарии</strong> — текст сообщений в чате и формах обратной связи</li>
                      <li><strong>Telegram username</strong> — при указании в формах (опционально)</li>
                      <li><strong>Технические данные</strong> — IP-адрес, данные браузера, cookies (через Яндекс.Метрику)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Цели обработки */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Цели обработки персональных данных</h2>
                <p className="mb-4">
                  Мы обрабатываем ваши персональные данные для следующих целей:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Обработка заявок и обращений через формы обратной связи</li>
                  <li>Предоставление консультаций и ответов на вопросы через чат-бот</li>
                  <li>Связь с вами для обсуждения услуг и заключения договоров</li>
                  <li>Обработка лидов и управление продажами</li>
                  <li>Анализ использования сайта для улучшения пользовательского опыта (Яндекс.Метрика)</li>
                  <li>Соблюдение требований законодательства РФ</li>
                </ul>
              </CardContent>
            </Card>

            {/* Категории обработки */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Категории обработки персональных данных
                </h2>
                <p className="mb-4">
                  Мы осуществляем следующие действия с персональными данными:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Сбор</strong> — получение данных через формы и чат-бот</li>
                  <li><strong>Хранение</strong> — сохранение данных на защищенных серверах</li>
                  <li><strong>Использование</strong> — применение данных для указанных целей</li>
                  <li><strong>Передача</strong> — передача данных третьим лицам (см. раздел ниже)</li>
                  <li><strong>Уничтожение</strong> — удаление данных по истечении срока хранения</li>
                </ul>
              </CardContent>
            </Card>

            {/* Третьи лица */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Третьи лица, обрабатывающие персональные данные
                </h2>
                <p className="mb-4">
                  Мы передаем персональные данные следующим третьим лицам:
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">Яндекс.Метрика</h3>
                    <p className="text-sm text-muted-foreground mb-1">Счетчик: 106099175</p>
                    <p className="text-sm">
                      Собирает технические данные (IP-адрес, данные браузера, cookies) для анализа посещаемости сайта.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">Провайдер чат-бота и ИИ-сервисов</h3>
                    <p className="text-sm">
                      Обрабатывает сообщения пользователей в чате для предоставления ответов через ИИ.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Трансграничная передача */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Трансграничная передача персональных данных
                </h2>
                <p className="mb-2">
                  В случае использования не-российских ИИ-сервисов или провайдеров чат-ботов, ваши персональные данные (сообщения в чате) могут передаваться на серверы, расположенные за пределами Российской Федерации.
                </p>
                <p>
                  Такая передача осуществляется только при вашем явном согласии и в целях предоставления услуг.
                </p>
              </CardContent>
            </Card>

            {/* Сроки хранения */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Сроки хранения персональных данных
                </h2>
                <p className="mb-4">Персональные данные хранятся:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>До достижения целей обработки</li>
                  <li>До отзыва согласия на обработку персональных данных</li>
                  <li>В течение срока, установленного законодательством РФ (для документов, связанных с договорами)</li>
                  <li>Данные Яндекс.Метрики хранятся согласно политике Яндекс.Метрики (обычно до 26 месяцев)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Ваши права */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ваши права</h2>
                <p className="mb-4">
                  В соответствии с Федеральным законом № 152-ФЗ «О персональных данных» вы имеете право:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Получать информацию об обработке ваших персональных данных</li>
                  <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                  <li>Отозвать согласие на обработку персональных данных</li>
                  <li>Обжаловать действия оператора в уполномоченном органе по защите прав субъектов персональных данных</li>
                </ul>
              </CardContent>
            </Card>

            {/* Отзыв согласия */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      Отзыв согласия на обработку персональных данных
                    </h2>
                    <p className="mb-4">
                      Вы можете отозвать согласие на обработку персональных данных в любое время, отправив запрос по адресу:
                    </p>
                    <p className="mb-4">
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:neuroniclabs@yandex.ru"
                        className="text-primary hover:underline"
                      >
                        neuroniclabs@yandex.ru
                      </a>
                    </p>
                    <p>
                      После отзыва согласия мы прекратим обработку ваших персональных данных и удалим их, за исключением случаев, когда обработка необходима для выполнения обязательств по договору или требований законодательства.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Реестр операторов */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Реестр операторов персональных данных
                </h2>
                <p className="mb-4">
                  В соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных» 
                  оператор обязан уведомить Роскомнадзор о начале обработки персональных данных (за исключением 
                  случаев, когда обработка осуществляется без использования средств автоматизации).
                </p>
                <p>
                  Информация о регистрации в реестре операторов персональных данных Роскомнадзора 
                  (при наличии) может быть предоставлена по запросу на{" "}
                  <a href="mailto:neuroniclabs@yandex.ru" className="text-primary hover:underline">
                    neuroniclabs@yandex.ru
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Правовая основа */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Правовая основа</h2>
                <p className="mb-4">
                  Обработка персональных данных осуществляется в соответствии с:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                  </li>
                  <li>
                    Постановлением Правительства РФ от 01.11.2012 № 1119 «Об утверждении требований к защите персональных данных при их обработке в информационных системах персональных данных»
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Ссылки на связанные документы */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Связанные документы</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <Link to="/publichnaya-oferta" className="text-primary hover:underline">
                      Публичная оферта
                    </Link>{" "}
                    — условия предоставления услуг, правила использования контента
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Footer info */}
            <Card className="bg-card/10 border-border">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Дата последнего обновления:</strong> {new Date().toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    По всем вопросам, связанным с обработкой персональных данных, обращайтесь:{" "}
                    <a
                      href="mailto:neuroniclabs@yandex.ru"
                      className="text-primary hover:underline"
                    >
                      neuroniclabs@yandex.ru
                    </a>
                  </p>
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
