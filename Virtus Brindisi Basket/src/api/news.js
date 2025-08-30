import { supabaseAdmin } from '../lib/supabaseAdmin'

/**
 * Get all news articles (for admin)
 */
export async function getAllNews() {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get only published news (for public site)
 */
export async function getPublishedNews() {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get recent news with limit (for homepage)
 */
export async function getRecentNews(limit = 3) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

/**
 * Get latest news with limit (alias for getRecentNews)
 */
export async function getLatestNews(limit = 3) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

/**
 * Get single news article by ID
 */
export async function getNewsById(id) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new news article
 */
export async function createNews(newsData) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .insert([newsData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing news article
 */
export async function updateNews(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete news article
 */
export async function deleteNews(id) {
  const { error } = await supabaseAdmin
    .from('news')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
