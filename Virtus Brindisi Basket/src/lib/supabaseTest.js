import { supabase } from './supabase'

// Test di connessione al database
export async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    // Test semplice: prova a leggere le tabelle
    const { data, error } = await supabase
      .from('news')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log(`📊 Found ${data || 0} records in news table`)
    return true
  } catch (err) {
    console.error('❌ Supabase test error:', err)
    return false
  }
}

// Test per verificare tutte le tabelle
export async function testAllTables() {
  const tables = ['news', 'gallery', 'match_results', 'staff', 'training_sessions', 'scheduled_matches']
  
  console.log('🔄 Testing all database tables...')
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message)
      } else {
        console.log(`✅ Table '${table}' accessible`)
      }
    } catch (err) {
      console.error(`❌ Table '${table}' error:`, err.message)
    }
  }
}
