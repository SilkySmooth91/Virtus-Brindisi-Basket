import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'

/**
 * Get all palmares entries (for admin)
 */
export async function getAllPalmares() {
  const { data, error } = await supabase
    .from('palmares')
    .select('*')
    .order('year', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get palmares entries for display (ordered by year desc)
 */
export async function getPalmaresForDisplay() {
  const { data, error } = await supabase
    .from('palmares')
    .select('id, name, year, description')
    .order('year', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get palmares entries by decade
 */
export async function getPalmaresByDecade(startYear, endYear) {
  const { data, error } = await supabase
    .from('palmares')
    .select('id, name, year, description')
    .gte('year', startYear)
    .lte('year', endYear)
    .order('year', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get single palmares entry by ID
 */
export async function getPalmaresById(id) {
  const { data, error } = await supabase
    .from('palmares')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new palmares entry
 */
export async function createPalmares(palmaresData) {
  const { data, error } = await supabaseAdmin
    .from('palmares')
    .insert([palmaresData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing palmares entry
 */
export async function updatePalmares(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('palmares')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete palmares entry
 */
export async function deletePalmares(id) {
  const { error } = await supabaseAdmin
    .from('palmares')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
