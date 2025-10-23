import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'

/**
 * Get all scheduled matches (for admin)
 */
export async function getAllScheduledMatches() {
  const { data, error } = await supabase
    .from('scheduled_matches')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get upcoming scheduled matches
 */
export async function getUpcomingMatches() {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('scheduled_matches')
    .select('*')
    .gte('date', today)
    .eq('is_cancelled', false)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get next upcoming matches (limited)
 */
export async function getNextMatches(limit = 3) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('scheduled_matches')
    .select('*')
    .gte('date', today)
    .eq('is_cancelled', false)
    .order('date', { ascending: true })
    .limit(limit)
  
  if (error) throw error
  return data
}

/**
 * Get scheduled matches by team category
 */
export async function getScheduledMatchesByCategory(category) {
  const { data, error } = await supabase
    .from('scheduled_matches')
    .select('*')
    .eq('team_category', category)
    .eq('is_cancelled', false)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get single scheduled match by ID
 */
export async function getScheduledMatchById(id) {
  const { data, error } = await supabase
    .from('scheduled_matches')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new scheduled match
 */
export async function createScheduledMatch(matchData) {
  const { data, error } = await supabaseAdmin
    .from('scheduled_matches')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing scheduled match
 */
export async function updateScheduledMatch(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('scheduled_matches')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete scheduled match
 */
export async function deleteScheduledMatch(id) {
  const { error } = await supabaseAdmin
    .from('scheduled_matches')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
