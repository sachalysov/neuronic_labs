import { supabase } from '@/lib/supabase'
import type { BlogPost } from './blog'

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || null,
      author: post.author || null,
      published_at: post.publishedAt,
      image_url: post.imageUrl || null,
      tags: post.tags || [],
    })
    .select()
    .single()

  if (error) {
    console.error('Ошибка при создании статьи:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt || undefined,
    author: data.author || undefined,
    publishedAt: data.published_at,
    imageUrl: data.image_url || undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
  }
}

export async function updateBlogPost(
  id: string,
  post: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const updateData: any = {}
  if (post.title !== undefined) updateData.title = post.title
  if (post.slug !== undefined) updateData.slug = post.slug
  if (post.content !== undefined) updateData.content = post.content
  if (post.excerpt !== undefined) updateData.excerpt = post.excerpt || null
  if (post.author !== undefined) updateData.author = post.author || null
  if (post.publishedAt !== undefined) updateData.published_at = post.publishedAt
  if (post.imageUrl !== undefined) updateData.image_url = post.imageUrl || null
  if (post.tags !== undefined) updateData.tags = post.tags || []

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Ошибка при обновлении статьи:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt || undefined,
    author: data.author || undefined,
    publishedAt: data.published_at,
    imageUrl: data.image_url || undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Ошибка при удалении статьи:', error)
    throw error
  }
}
