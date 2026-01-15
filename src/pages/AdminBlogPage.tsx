import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { fetchBlogPosts, type BlogPost } from '@/services/blog'
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/services/admin-blog'
import { generateSlug } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminThemeToggle } from '@/components/admin-theme-toggle'

export default function AdminBlogPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    imageUrl: '',
    tags: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await fetchBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error('Ошибка загрузки статей:', err)
      setError('Не удалось загрузить статьи')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setFormData({
      id: '',
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: '',
      publishedAt: new Date().toISOString().slice(0, 16),
      imageUrl: '',
      tags: '',
    })
    setError('')
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author: post.author || '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      imageUrl: post.imageUrl || '',
      tags: post.tags?.join(', ') || '',
    })
    setError('')
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Удалить эту статью?')) return

    try {
      await deleteBlogPost(id)
      await loadPosts()
      if (editingPost?.id === id) {
        handleNewPost()
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления статьи')
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        author: formData.author || undefined,
        publishedAt: new Date(formData.publishedAt).toISOString(),
        imageUrl: formData.imageUrl || undefined,
        tags: tagsArray,
      }

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData)
      } else {
        await createBlogPost(postData)
      }

      await loadPosts()
      handleNewPost()
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения статьи')
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
      // Всё равно редиректим на логин
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
              <h1 className="text-3xl font-bold">Админ панель блога</h1>
              <p className="text-muted-foreground mt-1">Управление статьями</p>
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
              onClick={() => navigate('/blog')}
              type="button"
              className="touch-manipulation"
            >
              Просмотр блога
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
                  {editingPost ? 'Редактирование статьи' : 'Новая статья'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Заголовок *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      placeholder="Заголовок статьи"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Slug (URL) *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      required
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Краткое описание
                    </label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                      }
                      placeholder="Краткое описание статьи"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Содержание *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      required
                      placeholder="HTML содержимое статьи"
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Автор
                      </label>
                      <Input
                        value={formData.author}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, author: e.target.value }))
                        }
                        placeholder="Имя автора"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      URL изображения
                    </label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Теги (через запятую)
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tags: e.target.value }))
                      }
                      placeholder="Тег1, Тег2, Тег3"
                    />
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Сохранение...' : editingPost ? 'Обновить' : 'Создать'}
                    </Button>
                    {editingPost && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleNewPost}
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
                <CardTitle>Все статьи ({posts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleNewPost}
                  >
                    + Создать новую
                  </Button>
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleEditPost(post)}
                    >
                      <div className="font-medium text-sm line-clamp-2">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditPost(post)
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePost(post.id)
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Нет статей
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
