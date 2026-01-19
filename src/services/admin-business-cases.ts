import { supabase } from '@/lib/supabase'
import type { BusinessCase } from './business-cases'

export async function createBusinessCase(caseData: Omit<BusinessCase, 'id' | 'image'> & { id?: string; image?: string }): Promise<BusinessCase> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  // Генерируем ID из названия, если не указан
  const id = caseData.id || caseData.title
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')

  const { data, error } = await supabase
    .from('business_cases')
    .insert({
      id,
      title: caseData.title,
      industry: caseData.industry,
      description: caseData.description,
      challenge: caseData.challenge,
      solution: caseData.solution,
      image_url: caseData.image || null,
      results: caseData.results || [],
      content: caseData.content || null,
      published_at: caseData.publishedAt || new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Ошибка при создании кейса:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    industry: data.industry,
    description: data.description,
    challenge: data.challenge,
    solution: data.solution,
    image: data.image_url || '',
    results: Array.isArray(data.results) ? data.results : [],
    content: data.content || undefined,
    publishedAt: data.published_at || undefined,
  }
}

export async function updateBusinessCase(
  id: string,
  caseData: Partial<Omit<BusinessCase, 'id'>>
): Promise<BusinessCase> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const updateData: any = {}
  if (caseData.title !== undefined) updateData.title = caseData.title
  if (caseData.industry !== undefined) updateData.industry = caseData.industry
  if (caseData.description !== undefined) updateData.description = caseData.description
  if (caseData.challenge !== undefined) updateData.challenge = caseData.challenge
  if (caseData.solution !== undefined) updateData.solution = caseData.solution
  if (caseData.image !== undefined) updateData.image_url = caseData.image || null
  if (caseData.results !== undefined) updateData.results = caseData.results || []
  if (caseData.content !== undefined) updateData.content = caseData.content || null
  if (caseData.publishedAt !== undefined) updateData.published_at = caseData.publishedAt || null

  const { data, error } = await supabase
    .from('business_cases')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Ошибка при обновлении кейса:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    industry: data.industry,
    description: data.description,
    challenge: data.challenge,
    solution: data.solution,
    image: data.image_url || '',
    results: Array.isArray(data.results) ? data.results : [],
    content: data.content || undefined,
    publishedAt: data.published_at || undefined,
  }
}

export async function deleteBusinessCase(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase не настроен')
  }

  const { error } = await supabase.from('business_cases').delete().eq('id', id)

  if (error) {
    console.error('Ошибка при удалении кейса:', error)
    throw error
  }
}

