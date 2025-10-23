import { 
  getAllNews, 
  getPublishedNews,
  createNews 
} from '../api/news'

import { 
  getAllGalleryImages,
  getFeaturedImages 
} from '../api/gallery'

import { 
  getAllMatchResults,
  getRecentMatchResults 
} from '../api/matchResults'

import { 
  getAllStaff,
  getActiveStaff 
} from '../api/staff'

import { 
  getAllTrainingSessions,
  getUpcomingTrainingSessions 
} from '../api/trainingSessions'

import { 
  getAllScheduledMatches,
  getUpcomingMatches 
} from '../api/scheduledMatches'

// Test per verificare che tutte le API funzionino
export async function testAllAPIs() {
  console.log('🚀 Starting API tests...')
  
  const results = {
    news: { success: false, error: null },
    gallery: { success: false, error: null },
    matchResults: { success: false, error: null },
    staff: { success: false, error: null },
    trainingSessions: { success: false, error: null },
    scheduledMatches: { success: false, error: null }
  }

  // Test News API
  try {
    console.log('📰 Testing News API...')
    const allNews = await getAllNews()
    const publishedNews = await getPublishedNews()
    console.log(`✅ News API: ${allNews.length} total, ${publishedNews.length} published`)
    results.news.success = true
  } catch (error) {
    console.error('❌ News API failed:', error.message)
    results.news.error = error.message
  }

  // Test Gallery API
  try {
    console.log('🖼️ Testing Gallery API...')
    const allImages = await getAllGalleryImages()
    const featuredImages = await getFeaturedImages()
    console.log(`✅ Gallery API: ${allImages.length} total, ${featuredImages.length} featured`)
    results.gallery.success = true
  } catch (error) {
    console.error('❌ Gallery API failed:', error.message)
    results.gallery.error = error.message
  }

  // Test Match Results API
  try {
    console.log('🏀 Testing Match Results API...')
    const allResults = await getAllMatchResults()
    const recentResults = await getRecentMatchResults()
    console.log(`✅ Match Results API: ${allResults.length} total, ${recentResults.length} recent`)
    results.matchResults.success = true
  } catch (error) {
    console.error('❌ Match Results API failed:', error.message)
    results.matchResults.error = error.message
  }

  // Test Staff API
  try {
    console.log('👥 Testing Staff API...')
    const allStaff = await getAllStaff()
    const activeStaff = await getActiveStaff()
    console.log(`✅ Staff API: ${allStaff.length} total, ${activeStaff.length} active`)
    results.staff.success = true
  } catch (error) {
    console.error('❌ Staff API failed:', error.message)
    results.staff.error = error.message
  }

  // Test Training Sessions API
  try {
    console.log('💪 Testing Training Sessions API...')
    const allSessions = await getAllTrainingSessions()
    const upcomingSessions = await getUpcomingTrainingSessions()
    console.log(`✅ Training Sessions API: ${allSessions.length} total, ${upcomingSessions.length} upcoming`)
    results.trainingSessions.success = true
  } catch (error) {
    console.error('❌ Training Sessions API failed:', error.message)
    results.trainingSessions.error = error.message
  }

  // Test Scheduled Matches API
  try {
    console.log('📅 Testing Scheduled Matches API...')
    const allMatches = await getAllScheduledMatches()
    const upcomingMatches = await getUpcomingMatches()
    console.log(`✅ Scheduled Matches API: ${allMatches.length} total, ${upcomingMatches.length} upcoming`)
    results.scheduledMatches.success = true
  } catch (error) {
    console.error('❌ Scheduled Matches API failed:', error.message)
    results.scheduledMatches.error = error.message
  }

  // Riepilogo finale
  const successCount = Object.values(results).filter(r => r.success).length
  const totalTests = Object.keys(results).length
  
  console.log(`\n📊 TEST RESULTS: ${successCount}/${totalTests} APIs working`)
  
  if (successCount === totalTests) {
    console.log('🎉 All APIs are working correctly!')
  } else {
    console.log('⚠️ Some APIs need attention:')
    Object.entries(results).forEach(([api, result]) => {
      if (!result.success) {
        console.log(`  - ${api}: ${result.error}`)
      }
    })
  }

  return results
}

// Test per creare dati di esempio (solo se le tabelle sono vuote)
export async function createSampleData() {
  console.log('📝 Creating sample data...')
  
  try {
    // Controlla se già ci sono dati
    const existingNews = await getAllNews()
    if (existingNews.length > 0) {
      console.log('ℹ️ Sample data already exists, skipping creation')
      return
    }

    // Crea news di esempio
    const sampleNews = {
      title: 'Test: Vittoria importante!',
      content: 'Questo è un articolo di test per verificare che le API funzionino correttamente. La squadra ha ottenuto una vittoria importante contro gli avversari.',
      excerpt: 'Un test per verificare il funzionamento delle API',
      published: true,
      author: 'Admin Test'
    }

    await createNews(sampleNews)
    console.log('✅ Sample news created')

  } catch (error) {
    console.error('❌ Failed to create sample data:', error.message)
  }
}
