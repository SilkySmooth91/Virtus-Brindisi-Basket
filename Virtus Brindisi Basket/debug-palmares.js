// Test API palmares - esegui questo nella console del browser per debug

import { supabase } from './src/lib/supabase.js'

// Test connessione diretta
const testPalmares = async () => {
  console.log('Testing palmares API...')
  
  // Test 1: Query diretta
  const { data: directData, error: directError } = await supabase
    .from('palmares')
    .select('*')
  
  console.log('Direct query result:', { directData, directError })
  
  // Test 2: Tramite API function
  try {
    const { getPalmaresForDisplay } = await import('./src/api/palmares.js')
    const apiData = await getPalmaresForDisplay()
    console.log('API function result:', apiData)
  } catch (apiError) {
    console.error('API function error:', apiError)
  }
}

testPalmares()
