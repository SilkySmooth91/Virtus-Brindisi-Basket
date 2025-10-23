import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'

/**
 * Get all training sessions (for admin)
 */
export async function getAllTrainingSessions() {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

/**
 * Get upcoming training sessions
 */
export async function getUpcomingTrainingSessions() {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .gte('date', today)
    .eq('is_cancelled', false)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get training sessions by team category
 */
export async function getTrainingSessionsByCategory(category) {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('team_category', category)
    .eq('is_cancelled', false)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get single training session by ID
 */
export async function getTrainingSessionById(id) {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new training session
 */
export async function createTrainingSession(sessionData) {
  const { data, error } = await supabaseAdmin
    .from('training_sessions')
    .insert([sessionData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing training session
 */
export async function updateTrainingSession(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('training_sessions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete training session
 */
export async function deleteTrainingSession(id) {
  const { error } = await supabaseAdmin
    .from('training_sessions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
