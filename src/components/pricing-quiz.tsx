import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, ChevronRight, RotateCcw, X, Sparkles } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = "radio" | "checkbox"

interface Option {
  label: string
  value: number
}

interface Question {
  id: number
  text: string
  type: QuestionType
  options: Option[]
}

interface Block {
  title: string
  icon: string
  questions: Question[]
}

// answers: questionId → selected option index (radio) or set of selected indices (checkbox)
type Answers = Record<number, number | Set<number>>

// ─── Quiz Data ────────────────────────────────────────────────────────────────

const quizBlocks: Block[] = [
  {
    title: "Масштаб бизнеса",
    icon: "📊",
    questions: [
      {
        id: 1,
        text: "Сколько заявок в месяц вы получаете?",
        type: "radio",
        options: [
          { label: "до 50", value: 0 },
          { label: "50–150", value: 1 },
          { label: "150–500", value: 2 },
          { label: "500+", value: 3 },
        ],
      },
      {
        id: 2,
        text: "Средний чек одной продажи?",
        type: "radio",
        options: [
          { label: "до 5 000 ₽", value: 0 },
          { label: "5 000 – 30 000 ₽", value: 1 },
          { label: "30 000 – 100 000 ₽", value: 2 },
          { label: "100 000 ₽ и выше", value: 3 },
        ],
      },
      {
        id: 3,
        text: "Формат бизнеса",
        type: "radio",
        options: [
          { label: "Один бизнес / один город", value: 0 },
          { label: "2–3 точки / региона", value: 1 },
          { label: "Сеть / франшиза", value: 2 },
        ],
      },
    ],
  },
  {
    title: "Каналы общения",
    icon: "💬",
    questions: [
      {
        id: 4,
        text: "Через какие каналы клиенты с вами общаются?",
        type: "checkbox",
        options: [
          { label: "Сайт", value: 0 },
          { label: "WhatsApp", value: 1 },
          { label: "Telegram", value: 1 },
          { label: "VK", value: 1 },
          { label: "Avito", value: 1 },
          { label: "Маркетплейсы", value: 2 },
        ],
      },
      {
        id: 5,
        text: "Сколько каналов нужно обрабатывать одновременно?",
        type: "radio",
        options: [
          { label: "1", value: 0 },
          { label: "2", value: 1 },
          { label: "3–4", value: 2 },
          { label: "5+", value: 3 },
        ],
      },
    ],
  },
  {
    title: "Работа менеджеров",
    icon: "👥",
    questions: [
      {
        id: 6,
        text: "Кто отвечает клиентам сейчас?",
        type: "radio",
        options: [
          { label: "Собственник", value: 2 },
          { label: "1 менеджер", value: 1 },
          { label: "2+ менеджера / отдел", value: 0 },
        ],
      },
      {
        id: 7,
        text: "Теряются ли заявки?",
        type: "radio",
        options: [
          { label: "Практически нет", value: 0 },
          { label: "Иногда", value: 1 },
          { label: "Часто / не контролируем", value: 2 },
        ],
      },
      {
        id: 8,
        text: "Сколько времени уходит на однотипные вопросы?",
        type: "radio",
        options: [
          { label: "Меньше 30% времени", value: 0 },
          { label: "Примерно половина", value: 1 },
          { label: "Большая часть времени", value: 2 },
        ],
      },
    ],
  },
  {
    title: "Цена и расчёты",
    icon: "💰",
    questions: [
      {
        id: 9,
        text: "Как формируется цена?",
        type: "radio",
        options: [
          { label: "Фиксированная", value: 0 },
          { label: "По понятным параметрам", value: 1 },
          { label: "Считает менеджер вручную", value: 2 },
        ],
      },
      {
        id: 10,
        text: "Клиенту важно получить цену сразу в чате?",
        type: "radio",
        options: [
          { label: "Не критично", value: 0 },
          { label: "Да, это влияет на решение", value: 1 },
        ],
      },
    ],
  },
  {
    title: "CRM и управление",
    icon: "⚙️",
    questions: [
      {
        id: 11,
        text: "Используете ли вы CRM?",
        type: "radio",
        options: [
          { label: "Нет", value: 0 },
          { label: "Используем частично", value: 1 },
          { label: "CRM — основной инструмент", value: 2 },
        ],
      },
      {
        id: 12,
        text: "Что из этого хотелось бы автоматизировать?",
        type: "checkbox",
        options: [
          { label: "Создание сделок", value: 1 },
          { label: "Воронку продаж", value: 1 },
          { label: "Распределение заявок", value: 1 },
          { label: "Расписание / записи", value: 1 },
        ],
      },
    ],
  },
  {
    title: "Деньги и закрытие сделки",
    icon: "💳",
    questions: [
      {
        id: 13,
        text: "Как чаще всего происходит оплата?",
        type: "radio",
        options: [
          { label: "После общения с менеджером", value: 0 },
          { label: "По счёту / ссылке", value: 1 },
          { label: "Онлайн сразу", value: 2 },
        ],
      },
      {
        id: 14,
        text: "Хотели бы сократить путь до оплаты?",
        type: "radio",
        options: [
          { label: "Нет", value: 0 },
          { label: "Да", value: 1 },
        ],
      },
    ],
  },
  {
    title: "Масштабирование и интеграции",
    icon: "🚀",
    questions: [
      {
        id: 15,
        text: "Есть ли у вас:",
        type: "checkbox",
        options: [
          { label: "1С / бухгалтерия", value: 1 },
          { label: "Склад", value: 1 },
          { label: "Поставщики", value: 1 },
          { label: "Логистика", value: 1 },
          { label: "Телефония", value: 1 },
        ],
      },
      {
        id: 16,
        text: "Планируете масштабирование в ближайший год?",
        type: "radio",
        options: [
          { label: "Нет", value: 0 },
          { label: "Думаем / возможно", value: 1 },
          { label: "Да, есть план", value: 2 },
        ],
      },
    ],
  },
]

const planResults = [
  {
    id: "lite",
    name: "Lite",
    price: "15 000",
    minScore: 0,
    maxScore: 5,
    description: "Простой старт — идеально для тестирования ИИ-ассистента без больших вложений.",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/50",
  },
  {
    id: "basic",
    name: "Basic",
    price: "30 000",
    minScore: 6,
    maxScore: 11,
    description: "Для малого бизнеса — автоматизация основных процессов и CRM-интеграция.",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/50",
  },
  {
    id: "business",
    name: "Business",
    price: "60 000",
    minScore: 12,
    maxScore: 18,
    description: "Оптимальный для роста — мультиканальность, аналитика и продвинутый ИИ.",
    color: "from-primary/20 to-primary/10",
    borderColor: "border-primary/50",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "100 000",
    minScore: 19,
    maxScore: Infinity,
    description: "Для крупного бизнеса — полная интеграция, телефония и премиум-поддержка.",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/50",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllQuestions(): Question[] {
  return quizBlocks.flatMap((b) => b.questions)
}

function calcScore(answers: Answers): number {
  const allQ = getAllQuestions()
  let score = 0
  for (const q of allQ) {
    const ans = answers[q.id]
    if (ans === undefined) continue
    if (q.type === "radio") {
      // ans is an option index
      const idx = ans as number
      score += q.options[idx]?.value ?? 0
    } else {
      // ans is a Set of option indices
      const indices = ans as Set<number>
      for (const idx of indices) {
        score += q.options[idx]?.value ?? 0
      }
    }
  }
  return score
}

function getPlan(score: number) {
  return planResults.find((p) => score >= p.minScore && score <= p.maxScore) || planResults[0]
}

function pluralBalls(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "балл"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "балла"
  return "баллов"
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PricingQuizProps {
  onContactClick: () => void
}

export function PricingQuiz({ onContactClick }: PricingQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [showResult, setShowResult] = useState(false)
  const [slideState, setSlideState] = useState<"idle" | "out" | "in">("idle")
  const blockRef = useRef<HTMLDivElement>(null)
  const quizRef = useRef<HTMLDivElement>(null)

  const totalBlocks = quizBlocks.length

  // Scroll into view on open
  useEffect(() => {
    if (isOpen && quizRef.current) {
      setTimeout(() => {
        quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 150)
    }
  }, [isOpen])

  // Scroll to current block on change
  useEffect(() => {
    if (slideState === "idle" && blockRef.current) {
      setTimeout(() => {
        blockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [currentBlock, showResult, slideState])

  const handleRadioSelect = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }))
  }

  const handleCheckboxToggle = (questionId: number, optionIdx: number, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as Set<number>) || new Set<number>()
      const next = new Set(current)
      if (checked) {
        next.add(optionIdx)
      } else {
        next.delete(optionIdx)
      }
      return { ...prev, [questionId]: next }
    })
  }

  const isBlockComplete = (blockIdx: number): boolean => {
    const block = quizBlocks[blockIdx]
    return block.questions.every((q) => {
      if (q.type === "radio") return answers[q.id] !== undefined
      return true // checkboxes optional
    })
  }

  const goNext = () => {
    setSlideState("out")
    setTimeout(() => {
      if (currentBlock < totalBlocks - 1) {
        setCurrentBlock((p) => p + 1)
      } else {
        setShowResult(true)
      }
      setSlideState("in")
      setTimeout(() => setSlideState("idle"), 350)
    }, 300)
  }

  const resetQuiz = () => {
    setShowResult(false)
    setCurrentBlock(0)
    setAnswers({})
    setSlideState("in")
    setTimeout(() => setSlideState("idle"), 350)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setShowResult(false)
    setCurrentBlock(0)
    setAnswers({})
    setSlideState("idle")
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (!isOpen) {
    return (
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
          Не знаете какой тариф выбрать?
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={() => setIsOpen(true)}
          className="text-sm sm:text-base w-full sm:w-auto gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Пройди тест
        </Button>
      </div>
    )
  }

  const block = quizBlocks[currentBlock]
  const score = calcScore(answers)
  const plan = getPlan(score)
  const progress = showResult ? 100 : ((currentBlock) / totalBlocks) * 100

  const slideClass =
    slideState === "out"
      ? "opacity-0 -translate-x-6 scale-[0.98]"
      : slideState === "in"
      ? "opacity-0 translate-x-6 scale-[0.98]"
      : "opacity-100 translate-x-0 scale-100"

  return (
    <div ref={quizRef} className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 scroll-mt-24">
      {/* Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            {showResult ? "Готово!" : `Шаг ${currentBlock + 1} из ${totalBlocks}`}
          </span>
          <button
            onClick={closeQuiz}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
            aria-label="Закрыть тест"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Active block or result */}
      <div className={`transition-all duration-300 ease-out ${slideClass}`}>
        {!showResult ? (
          <Card ref={blockRef} className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-4 sm:p-8 space-y-5 sm:space-y-6">
              {/* Block title */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{block.icon}</span>
                <h3 className="text-lg sm:text-xl font-bold">{block.title}</h3>
              </div>

              {/* Questions */}
              {block.questions.map((q) => (
                <div key={q.id} className="space-y-2.5">
                  <p className="text-sm sm:text-base font-medium">{q.text}</p>

                  {q.type === "radio" ? (
                    <div className="grid gap-2">
                      {q.options.map((opt, idx) => {
                        const selected = answers[q.id] === idx
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleRadioSelect(q.id, idx)}
                            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base transition-all duration-200 ${
                              selected
                                ? "border-primary bg-primary/10 text-foreground shadow-sm"
                                : "border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                  selected ? "border-primary" : "border-muted-foreground/40"
                                }`}
                              >
                                {selected && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              {opt.label}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {q.options.map((opt, idx) => {
                        const checked = (answers[q.id] as Set<number>)?.has(idx) ?? false
                        return (
                          <label
                            key={idx}
                            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base cursor-pointer transition-all duration-200 ${
                              checked
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => handleCheckboxToggle(q.id, idx, !!c)}
                            />
                            <span className={checked ? "text-foreground" : "text-muted-foreground"}>
                              {opt.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Next button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={goNext}
                  disabled={!isBlockComplete(currentBlock)}
                  size="lg"
                  className="gap-2"
                >
                  {currentBlock < totalBlocks - 1 ? "Далее" : "Узнать результат"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            ref={blockRef}
            className={`bg-gradient-to-br ${plan.color} ${plan.borderColor} border-2 backdrop-blur-sm`}
          >
            <CardContent className="p-5 sm:p-8 space-y-5 sm:space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Ваш рекомендуемый тариф</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  На основе ваших ответов — {score} {pluralBalls(score)}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-3xl sm:text-4xl font-bold text-primary">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
                  <span className="text-lg text-muted-foreground">₽</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-2">
                  {plan.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button size="lg" onClick={onContactClick} className="gap-2">
                  Получить консультацию
                </Button>
                <Button variant="outline" size="lg" onClick={resetQuiz} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Пройти заново
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed blocks mini-list */}
      {!showResult && currentBlock > 0 && (
        <div className="mt-4 space-y-2">
          {quizBlocks.slice(0, currentBlock).map((b, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs sm:text-sm text-muted-foreground"
            >
              <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span>{b.icon}</span>
              <span>{b.title}</span>
              <span className="ml-auto text-primary font-medium">✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
