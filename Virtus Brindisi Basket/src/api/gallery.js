import { supabase } from '../lib/supabase'

/**
 * Get all gallery images (for admin)
 */
export async function getAllGalleryImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order_position', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get all images ordered by position
 */
export async function getFeaturedImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order_position', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get gallery images with optional limit (for carousel)
 */
export async function getGalleryImages(limit = null) {
  let query = supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

/**
 * Get single image by ID
 */
export async function getImageById(id) {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new gallery image
 */
export async function createGalleryImage(imageData) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([imageData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing gallery image
 */
export async function updateGalleryImage(id, updates) {
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete gallery image
 */
export async function deleteGalleryImage(id) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
