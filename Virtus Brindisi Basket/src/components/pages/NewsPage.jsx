import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faNewspaper, 
  faCalendarAlt, 
  faUser,
  faEye,
  faFilter,
  faSpinner,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'
import { getPublishedNews } from '../../api/news'
import NewsCard from '../News/NewsCard'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtri
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Opzioni per i filtri
  const months = [
    { value: '', label: 'Tutti i mesi' },
    { value: '01', label: 'Gennaio' },
    { value: '02', label: 'Febbraio' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Aprile' },
    { value: '05', label: 'Maggio' },
    { value: '06', label: 'Giugno' },
    { value: '07', label: 'Luglio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Settembre' },
    { value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Dicembre' }
  ]

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [news, selectedMonth, selectedYear, searchTerm])

  const loadNews = async () => {
    try {
      setLoading(true)
      const newsData = await getPublishedNews() // Solo news pubblicate
      
      // Ordina per data di creazione (più recenti prima)
      const sortedNews = newsData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
      
      setNews(sortedNews)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle notizie')
      console.error('Error loading news:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...news]

    // Filtro per mese e anno
    if (selectedMonth || selectedYear) {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.created_at)
        const articleMonth = String(articleDate.getMonth() + 1).padStart(2, '0')
        const articleYear = String(articleDate.getFullYear())
        
        const monthMatch = !selectedMonth || articleMonth === selectedMonth
        const yearMatch = !selectedYear || articleYear === selectedYear
        
        return monthMatch && yearMatch
      })
    }

    // Filtro per ricerca testuale
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        (article.author && article.author.toLowerCase().includes(searchLower))
      )
    }

    setFilteredNews(filtered)
  }

  // Ottieni anni unici dalle news
  const getAvailableYears = () => {
    const years = news.map(article => new Date(article.created_at).getFullYear())
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a)
    return [
      { value: '', label: 'Tutti gli anni' },
      ...uniqueYears.map(year => ({ value: String(year), label: String(year) }))
    ]
  }

  const clearFilters = () => {
    setSelectedMonth('')
    setSelectedYear('')
    setSearchTerm('')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-yellow-400 animate-spin mb-4" />
            <p className="text-white">Caricamento notizie...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-3xl text-yellow-400" />
          </motion.div>
          <motion.h1 
            className="text-7xl uppercase font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tutte le <span className="text-yellow-400">Notizie</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Resta aggiornato su tutte le novità, i risultati e gli eventi della Virtus Brindisi Basket
          </motion.p>
        </motion.div>

        {/* Filtri */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faFilter} className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filtri</h3>
            {(selectedMonth || selectedYear || searchTerm) && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer transition-colors font-medium"
              >
                Cancella filtri
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ricerca testuale */}
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Cerca nelle notizie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filtro Mese */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
            >
              {months.map(month => (
                <option key={month.value} value={month.value} className="bg-white">
                  {month.label}
                </option>
              ))}
            </select>

            {/* Filtro Anno */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
            >
              {getAvailableYears().map(year => (
                <option key={year.value} value={year.value} className="bg-white">
                  {year.label}
                </option>
              ))}
            </select>

            {/* Risultati */}
            <div className="flex items-center text-sm text-gray-600">
              <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
              {filteredNews.length} notizie trovate
            </div>
          </div>
        </motion.div>

        {/* Risultati */}
        {error && (
          <motion.div 
            className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {filteredNews.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <FontAwesomeIcon icon={faNewspaper} className="text-6xl text-gray-600 mb-4" />
            </motion.div>
            <motion.h3 
              className="text-xl font-medium text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              {searchTerm || selectedMonth || selectedYear 
                ? 'Nessuna notizia trovata' 
                : 'Non ci sono ancora notizie'
              }
            </motion.h3>
            <motion.p 
              className="text-gray-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              {searchTerm || selectedMonth || selectedYear 
                ? 'Prova a modificare i filtri di ricerca.' 
                : 'Le notizie appariranno qui quando saranno pubblicate.'
              }
            </motion.p>
            {(selectedMonth || selectedYear || searchTerm) && (
              <motion.button
                onClick={clearFilters}
                className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors cursor-pointer font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Mostra tutte le notizie
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              >
                <NewsCard 
                  article={article}
                  showFullDate={true}
                  showAuthor={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
      <Footer />
    </>
  )
}
