import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { fetchBusinessCases, type BusinessCase } from '@/services/business-cases'
import { createBusinessCase, updateBusinessCase, deleteBusinessCase } from '@/services/admin-business-cases'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'
import { Plus, X } from 'lucide-react'

export default function AdminBusinessCasesPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [cases, setCases] = useState<BusinessCase[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCase, setEditingCase] = useState<BusinessCase | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    industry: '',
    description: '',
    challenge: '',
    solution: '',
    image: '',
    results: [] as Array<{ icon: string; label: string; value: string; color: string }>,
    content: '',
    publishedAt: new Date().toISOString().slice(0, 16),
  })
  const [customId, setCustomId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newResult, setNewResult] = useState({ icon: 'Users', label: '', value: '', color: 'text-primary' })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      loadCases()
    }
  }, [user])

  const loadCases = async () => {
    try {
      setLoading(true)
      const data = await fetchBusinessCases()
      setCases(data)
    } catch (err) {
      console.error('Ошибка загрузки кейсов:', err)
      setError('Не удалось загрузить кейсы')
    } finally {
      setLoading(false)
    }
  }

  const handleNewCase = () => {
    setEditingCase(null)
    setFormData({
      id: '',
      title: '',
      industry: '',
      description: '',
      challenge: '',
      solution: '',
      image: '',
      results: [],
      content: '',
      publishedAt: new Date().toISOString().slice(0, 16),
    })
    setCustomId('')
    setError('')
    setEditingResultIndex(null)
    setNewResult({ icon: 'Users', label: '', value: '', color: 'text-primary' })
  }

  const handleEditCase = (businessCase: BusinessCase) => {
    setEditingCase(businessCase)
    setFormData({
      id: businessCase.id,
      title: businessCase.title,
      industry: businessCase.industry,
      description: businessCase.description,
      challenge: businessCase.challenge,
      solution: businessCase.solution,
      image: businessCase.image,
      results: businessCase.results || [],
      content: businessCase.content || '',
      publishedAt: businessCase.publishedAt ? new Date(businessCase.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    })
    setCustomId('')
    setError('')
    setEditingResultIndex(null)
    setNewResult({ icon: 'Users', label: '', value: '', color: 'text-primary' })
  }

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Удалить этот кейс?')) return

    try {
      await deleteBusinessCase(id)
      await loadCases()
      if (editingCase?.id === id) {
        handleNewCase()
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления кейса')
    }
  }

  const handleAddResult = () => {
    if (!newResult.label || !newResult.value) {
      setError('Заполните все поля результата')
      return
    }
    setFormData((prev) => ({
      ...prev,
      results: [...prev.results, { ...newResult }],
    }))
    setNewResult({ icon: 'Users', label: '', value: '', color: 'text-primary' })
    setError('')
  }

  const handleRemoveResult = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index),
    }))
  }

  const handleUpdateResult = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      results: prev.results.map((result, i) =>
        i === index ? { ...result, [field]: value } : result
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const caseData = {
        ...(customId && !editingCase ? { id: customId } : {}),
        title: formData.title,
        industry: formData.industry,
        description: formData.description,
        challenge: formData.challenge,
        solution: formData.solution,
        image: formData.image || undefined,
        results: formData.results,
        content: formData.content || undefined,
        publishedAt: new Date(formData.publishedAt).toISOString(),
      }

      if (editingCase) {
        await updateBusinessCase(editingCase.id, caseData)
      } else {
        await createBusinessCase(caseData)
      }

      await loadCases()
      handleNewCase()
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения кейса')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Ошибка выхода:', error)
      navigate('/admin/login')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Админ панель кейсов</h1>
              <p className="text-muted-foreground mt-1">Управление бизнес-кейсами</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminThemeToggle />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              type="button"
              className="touch-manipulation"
            >
              Назад
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/business-cases')}
              type="button"
              className="touch-manipulation"
            >
              Просмотр кейсов
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              type="button"
              className="touch-manipulation min-w-[80px]"
            >
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCase ? 'Редактирование кейса' : 'Новый кейс'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!editingCase && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ID (опционально, будет сгенерирован из названия)
                      </label>
                      <Input
                        value={customId}
                        onChange={(e) => setCustomId(e.target.value)}
                        placeholder="beauty-salon"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Название *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                      placeholder="Название кейса"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Отрасль *
                    </label>
                    <Input
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, industry: e.target.value }))
                      }
                      required
                      placeholder="Например: Beauty & Wellness"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Описание *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      required
                      placeholder="Краткое описание кейса"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Вызов *
                    </label>
                    <Textarea
                      value={formData.challenge}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, challenge: e.target.value }))
                      }
                      required
                      placeholder="Какая проблема была у клиента?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Решение *
                    </label>
                    <Textarea
                      value={formData.solution}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, solution: e.target.value }))
                      }
                      required
                      placeholder="Какое решение было предложено?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      URL изображения
                    </label>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, image: e.target.value }))
                      }
                      placeholder="/path/to/image.jpg или https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Результаты
                    </label>
                    <div className="space-y-2">
                      {formData.results.map((result, index) => (
                        <div key={index} className="flex gap-2 items-start p-2 border rounded">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              value={result.icon}
                              onChange={(e) => handleUpdateResult(index, 'icon', e.target.value)}
                              placeholder="Иконка (Users, TrendingUp, Clock)"
                              className="text-sm"
                            />
                            <Input
                              value={result.label}
                              onChange={(e) => handleUpdateResult(index, 'label', e.target.value)}
                              placeholder="Метка"
                              className="text-sm"
                            />
                            <Input
                              value={result.value}
                              onChange={(e) => handleUpdateResult(index, 'value', e.target.value)}
                              placeholder="Значение (+180%)"
                              className="text-sm"
                            />
                            <Input
                              value={result.color}
                              onChange={(e) => handleUpdateResult(index, 'color', e.target.value)}
                              placeholder="Цвет (text-primary)"
                              className="text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveResult(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2 p-2 border rounded border-dashed">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            value={newResult.icon}
                            onChange={(e) => setNewResult((prev) => ({ ...prev, icon: e.target.value }))}
                            placeholder="Иконка"
                            className="text-sm"
                          />
                          <Input
                            value={newResult.label}
                            onChange={(e) => setNewResult((prev) => ({ ...prev, label: e.target.value }))}
                            placeholder="Метка"
                            className="text-sm"
                          />
                          <Input
                            value={newResult.value}
                            onChange={(e) => setNewResult((prev) => ({ ...prev, value: e.target.value }))}
                            placeholder="Значение"
                            className="text-sm"
                          />
                          <Input
                            value={newResult.color}
                            onChange={(e) => setNewResult((prev) => ({ ...prev, color: e.target.value }))}
                            placeholder="Цвет"
                            className="text-sm"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddResult}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Полный контент (HTML)
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      placeholder="HTML содержимое для страницы кейса"
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Дата публикации *
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          publishedAt: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Сохранение...' : editingCase ? 'Обновить' : 'Создать'}
                    </Button>
                    {editingCase && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleNewCase}
                        disabled={saving}
                      >
                        Отмена
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Все кейсы ({cases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleNewCase}
                  >
                    + Создать новый
                  </Button>
                  {cases.map((businessCase) => (
                    <div
                      key={businessCase.id}
                      className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleEditCase(businessCase)}
                    >
                      <div className="font-medium text-sm line-clamp-2">
                        {businessCase.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {businessCase.industry}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {businessCase.publishedAt ? new Date(businessCase.publishedAt).toLocaleDateString('ru-RU') : 'Не опубликован'}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCase(businessCase)
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCase(businessCase.id)
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                  {cases.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Нет кейсов
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

