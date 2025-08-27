import { supabase } from '../lib/supabase'

/**
 * Get all match results (for admin)
 */
export async function getAllMatchResults() {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('match_date', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get recent match results for homepage
 */
export async function getRecentMatchResults(limit = 4) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('match_date', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

/**
 * Get match results by category
 */
export async function getMatchResultsByCategory(category) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('category', category)
    .order('match_date', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get single match result by ID
 */
export async function getMatchResultById(id) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new match result
 */
export async function createMatchResult(matchData) {
  const { data, error } = await supabase
    .from('scores')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing match result
 */
export async function updateMatchResult(id, updates) {
  const { data, error } = await supabase
    .from('scores')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete match result
 */
export async function deleteMatchResult(id) {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
