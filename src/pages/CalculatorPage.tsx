import { useEffect, useState } from 'react'
import { StickyHeader } from '@/components/sticky-header'
import { SpaceDust } from '@/components/space-dust'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConsultationModal } from '@/components/consultation-modal'
import { ChevronDown, Phone } from 'lucide-react'
import { getCalculatorPrices, subscribeToCalculatorPrices, type CalculatorCategory } from '@/services/calculator-prices'
import { useMeta } from '@/hooks/useMeta'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CalculatorPage() {
  useMeta({
    title: 'Расчитать стоимость внедрения самостоятельно | Neuronic Labs',
    description: 'Калькулятор расчета стоимости внедрения ИИ-продавца. Выберите параметры и узнайте стоимость внедрения.',
  })

  const [categories, setCategories] = useState<CalculatorCategory[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Map<string, Set<string>>>(new Map())
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  
  // Категории, где можно выбрать только один вариант
  const singleSelectCategories = new Set(['Количество каналов продаж', 'Где вести учет?'])

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true)
      try {
        const prices = await getCalculatorPrices()
        setCategories(prices)
      } catch (error) {
        console.error('Ошибка загрузки цен:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrices()

    // Подписка на изменения цен в реальном времени
    const unsubscribe = subscribeToCalculatorPrices((prices) => {
      setCategories(prices)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const toggleCategory = (category: string) => {
    const newOpenCategories = new Set(openCategories)
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category)
    } else {
      newOpenCategories.add(category)
    }
    setOpenCategories(newOpenCategories)
  }

  const toggleOption = (category: string, optionId: string) => {
    const newSelectedOptions = new Map(selectedOptions)
    const currentSelection = newSelectedOptions.get(category) || new Set<string>()
    const isSingleSelect = singleSelectCategories.has(category)
    const wasCategoryEmpty = currentSelection.size === 0
    
    if (currentSelection.has(optionId)) {
      // Если опция уже выбрана, снимаем выбор
      const newSet = new Set(currentSelection)
      newSet.delete(optionId)
      if (newSet.size > 0) {
        newSelectedOptions.set(category, newSet)
      } else {
        newSelectedOptions.delete(category)
      }
    } else {
      // Выбираем новую опцию
      if (isSingleSelect) {
        // Для категорий с одним выбором заменяем весь Set
        newSelectedOptions.set(category, new Set([optionId]))
      } else {
        // Для категорий с множественным выбором добавляем к существующим
        const newSet = new Set(currentSelection)
        newSet.add(optionId)
        newSelectedOptions.set(category, newSet)
      }
    }
    
    setSelectedOptions(newSelectedOptions)
    
    // Автоматический переход к следующей категории или калькулятору
    if (!currentSelection.has(optionId)) {
      // Только если мы выбираем новую опцию (не снимаем выбор)
      // Для категорий с множественным выбором переходим только при первом выборе
      const shouldTransition = isSingleSelect || wasCategoryEmpty
      
      if (shouldTransition) {
        const currentIndex = categories.findIndex(c => c.category === category)
        const isLastCategory = currentIndex === categories.length - 1
        
        // Закрываем текущую категорию
        const newOpenCategories = new Set(openCategories)
        newOpenCategories.delete(category)
        
        if (isLastCategory) {
          // Если это последняя категория, просто закрываем и прокручиваем к калькулятору
          setOpenCategories(newOpenCategories)
          setTimeout(() => {
            const calculatorElement = document.getElementById('calculator-total')
            if (calculatorElement) {
              calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 300)
        } else {
          // Открываем следующую категорию
          const nextCategory = categories[currentIndex + 1]
          if (nextCategory) {
            newOpenCategories.add(nextCategory.category)
            setOpenCategories(newOpenCategories)
            // Прокручиваем к следующей категории
            setTimeout(() => {
              const nextCategoryElement = document.getElementById(`category-${nextCategory.category}`)
              if (nextCategoryElement) {
                nextCategoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }, 300)
          } else {
            setOpenCategories(newOpenCategories)
          }
        }
      }
    }
  }

  const calculateTotal = (): number => {
    let total = 0
    selectedOptions.forEach((optionIds, category) => {
      const categoryData = categories.find(c => c.category === category)
      if (categoryData) {
        optionIds.forEach(optionId => {
          const option = categoryData.options.find(o => o.id === optionId)
          if (option) {
            total += option.price
          }
        })
      }
    })
    return total
  }

  const getSelectedOptionNames = (category: string): string[] => {
    const optionIds = selectedOptions.get(category)
    if (!optionIds || optionIds.size === 0) return []
    
    const categoryData = categories.find(c => c.category === category)
    if (!categoryData) return []
    
    return Array.from(optionIds)
      .map(optionId => {
        const option = categoryData.options.find(o => o.id === optionId)
        return option ? option.option_name : null
      })
      .filter((name): name is string => name !== null)
  }

  const formatCalculatorDataForComment = (): string => {
    if (selectedOptions.size === 0) {
      return ""
    }

    const lines: string[] = []
    lines.push("Выбранные параметры внедрения:\n")

    selectedOptions.forEach((optionIds, category) => {
      const categoryData = categories.find(c => c.category === category)
      if (!categoryData) return

      const selectedNames: string[] = []
      optionIds.forEach(optionId => {
        const option = categoryData.options.find(o => o.id === optionId)
        if (option) {
          selectedNames.push(option.option_name)
          if (option.price > 0) {
            selectedNames[selectedNames.length - 1] += ` (${formatPrice(option.price)})`
          }
        }
      })

      if (selectedNames.length > 0) {
        lines.push(`${category}:`)
        selectedNames.forEach(name => {
          lines.push(`  - ${name}`)
        })
        lines.push("")
      }
    })

    const total = calculateTotal()
    if (total > 0) {
      lines.push(`Итоговая стоимость: ${formatPrice(total)}`)
    }

    return lines.join("\n")
  }

  const total = calculateTotal()

  return (
    <main className="min-h-screen">
      <SpaceDust />
      <StickyHeader />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[40vh] flex items-center pt-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                <span className="text-primary">Рассчитать стоимость<br className="sm:hidden" /> внедрения самостоятельно</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                Выберите параметры внедрения и узнайте стоимость
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">

          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Загрузка калькулятора...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Левая колонка - Категории */}
              <div className="lg:col-span-2 space-y-4">
                {categories.map((category) => {
                  const isOpen = openCategories.has(category.category)
                  const selectedOptionIds = selectedOptions.get(category.category)
                  const selectedNames = getSelectedOptionNames(category.category)
                  
                  return (
                    <Card
                      key={category.category}
                      id={`category-${category.category}`}
                      className={`overflow-hidden transition-all hover:border-primary/50 ${
                        !isOpen ? 'cursor-pointer' : ''
                      }`}
                      onClick={!isOpen ? () => toggleCategory(category.category) : undefined}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.category)}
                        className={`w-full ${!isOpen ? 'pointer-events-none' : ''}`}
                      >
                        <CardContent className={isOpen ? "p-4 sm:p-6" : "px-4 sm:px-6 py-0.5 sm:py-1"}>
                          <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg sm:text-xl font-bold text-left">
                              {category.category}
                            </h2>
                            <ChevronDown
                              className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          
                          {selectedNames.length > 0 && (
                            <div className="mt-2 text-sm text-primary font-medium text-left">
                              Выбрано: {selectedNames.join(', ')}
                            </div>
                          )}
                        </CardContent>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2">
                          {category.options.map((option) => {
                            const isSelected = selectedOptionIds?.has(option.id) || false
                            
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleOption(category.category, option.id)}
                                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50 bg-card'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-sm sm:text-base font-medium flex-1">
                                    {option.option_name}
                                  </span>
                                  {option.price > 0 && (
                                    <span className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">
                                      +{formatPrice(option.price)}
                                    </span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </Card>
                  )
                })}

                {/* Блок с контактами */}
                <Card className="mt-6 bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-base sm:text-lg text-foreground mb-4 text-center">
                      Не нашли нужное решение? Свяжитесь с нами, оставьте свои контактные данные или позвоните по номеру
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => setIsConsultationModalOpen(true)}
                        size="lg"
                        className="flex-1 sm:flex-initial"
                      >
                        Оставить контакты
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-initial"
                      >
                        <a href="tel:+79930799177" className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4" />
                          +7 993 079 91 77
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Правая колонка - Калькулятор */}
              <div className="lg:col-span-1">
                <Card id="calculator-total" className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Итого</h3>
                    
                    <div className="space-y-3 mb-6">
                      {Array.from(selectedOptions.entries()).map(([category, optionIds]) => {
                        const categoryData = categories.find(c => c.category === category)
                        if (!categoryData) return null
                        
                        return Array.from(optionIds)
                          .map(optionId => {
                            const option = categoryData.options.find(o => o.id === optionId)
                            if (!option || option.price === 0) return null
                            
                            return (
                              <div key={`${category}-${optionId}`} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground truncate pr-2">
                                  {option.option_name}
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                  {formatPrice(option.price)}
                                </span>
                              </div>
                            )
                          })
                          .filter(Boolean)
                      })}
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Сумма:</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    {total === 0 && (
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        Выберите параметры для расчета
                      </p>
                    )}

                    <Button
                      onClick={() => setIsConsultationModalOpen(true)}
                      size="lg"
                      className="w-full mt-4"
                    >
                      Заказать внедрение
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          </div>
        </section>
      </div>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialComment={formatCalculatorDataForComment()}
      />

      <Footer />
    </main>
  )
}

