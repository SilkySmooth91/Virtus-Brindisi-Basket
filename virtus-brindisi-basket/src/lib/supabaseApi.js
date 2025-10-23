import { supabase } from './supabase'

// =========================
// NEWS FUNCTIONS
// =========================
export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPublishedNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createNews(newsData) {
  const { data, error } = await supabase
    .from('news')
    .insert([newsData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateNews(id, updates) {
  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// =========================
// GALLERY FUNCTIONS
// =========================
export async function getAllGalleryImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order_position', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getFeaturedImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_featured', true)
    .order('order_position', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createGalleryImage(imageData) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([imageData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateGalleryImage(id, updates) {
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteGalleryImage(id) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// =========================
// MATCH RESULTS FUNCTIONS
// =========================
export async function getAllMatchResults() {
  const { data, error } = await supabase
    .from('match_results')
    .select('*')
    .order('match_date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getRecentMatchResults(limit = 4) {
  const { data, error } = await supabase
    .from('match_results')
    .select('*')
    .order('match_date', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

export async function createMatchResult(matchData) {
  const { data, error } = await supabase
    .from('match_results')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateMatchResult(id, updates) {
  const { data, error } = await supabase
    .from('match_results')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteMatchResult(id) {
  const { error } = await supabase
    .from('match_results')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// =========================
// STAFF FUNCTIONS
// =========================
export async function getAllStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createStaffMember(staffData) {
  const { data, error } = await supabase
    .from('staff')
    .insert([staffData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateStaffMember(id, updates) {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteStaffMember(id) {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// =========================
// TRAINING SESSIONS FUNCTIONS
// =========================
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

export async function createTrainingSession(sessionData) {
  const { data, error } = await supabase
    .from('training_sessions')
    .insert([sessionData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateTrainingSession(id, updates) {
  const { data, error } = await supabase
    .from('training_sessions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteTrainingSession(id) {
  const { error } = await supabase
    .from('training_sessions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// =========================
// SCHEDULED MATCHES FUNCTIONS
// =========================
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

export async function createScheduledMatch(matchData) {
  const { data, error } = await supabase
    .from('scheduled_matches')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateScheduledMatch(id, updates) {
  const { data, error } = await supabase
    .from('scheduled_matches')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteScheduledMatch(id) {
  const { error } = await supabase
    .from('scheduled_matches')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
