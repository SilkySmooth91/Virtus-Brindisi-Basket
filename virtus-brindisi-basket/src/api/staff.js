import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'

/**
 * Get all staff members (for admin)
 */
export async function getAllStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get only active staff members for public site
 */
export async function getActiveStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get staff members by role
 */
export async function getStaffByRole(role) {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('role', role)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data
}

/**
 * Get single staff member by ID
 */
export async function getStaffById(id) {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

/**
 * Create new staff member
 */
export async function createStaffMember(staffData) {
  const { data, error } = await supabaseAdmin
    .from('staff')
    .insert([staffData])
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Update existing staff member
 */
export async function updateStaffMember(id, updates) {
  const { data, error } = await supabaseAdmin
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

/**
 * Delete staff member
 */
export async function deleteStaffMember(id) {
  const { error } = await supabaseAdmin
    .from('staff')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Export staffApi object for easier imports
export const staffApi = {
  getAll: getAllStaff,
  getActive: getActiveStaff,
  getByRole: getStaffByRole,
  getById: getStaffById,
  create: createStaffMember,
  update: updateStaffMember,
  delete: deleteStaffMember
}
