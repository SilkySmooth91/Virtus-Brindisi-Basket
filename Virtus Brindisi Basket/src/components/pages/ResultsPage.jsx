import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faFilter, faSpinner, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons'
import { getAllMatchResults } from '../../api/matchResults'
import ResultsCard from '../UI elems/ResultsCard'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const months = [
    { value: '', label: 'Tutti i mesi' },
    { value: '01', label: 'Gennaio' }, { value: '02', label: 'Febbraio' }, { value: '03', label: 'Marzo' },
    { value: '04', label: 'Aprile' }, { value: '05', label: 'Maggio' }, { value: '06', label: 'Giugno' },
    { value: '07', label: 'Luglio' }, { value: '08', label: 'Agosto' }, { value: '09', label: 'Settembre' },
    { value: '10', label: 'Ottobre' }, { value: '11', label: 'Novembre' }, { value: '12', label: 'Dicembre' }
  ]

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getAllMatchResults()
        const sorted = data.sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
        setResults(sorted)
      } catch (err) {
        setError('Errore nel caricamento dei risultati')
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [])

  useEffect(() => {
    const filtered = results.filter(result => {
      const categoryMatch = !selectedCategory || result.category === selectedCategory
      if (!selectedMonth && !selectedYear) return categoryMatch
      
      const date = new Date(result.match_date)
      const monthMatch = !selectedMonth || String(date.getMonth() + 1).padStart(2, '0') === selectedMonth
      const yearMatch = !selectedYear || String(date.getFullYear()) === selectedYear
      
      return categoryMatch && monthMatch && yearMatch
    })
    setFilteredResults(filtered)
  }, [results, selectedCategory, selectedMonth, selectedYear])

  const getCategories = () => {
    const categories = [...new Set(results.map(r => r.category).filter(Boolean))].sort()
    return [{ value: '', label: 'Tutte le categorie' }, ...categories.map(c => ({ value: c, label: c }))]
  }

  const getYears = () => {
    const years = [...new Set(results.map(r => new Date(r.match_date).getFullYear()))].sort((a, b) => b - a)
    return [{ value: '', label: 'Tutti gli anni' }, ...years.map(y => ({ value: String(y), label: String(y) }))]
  }

  const isVirtusWin = (result) => {
    const { home_score, away_score, home_team, away_team } = result
    if (home_score == null || away_score == null) return false
    
    const virtusHome = home_team?.toLowerCase().includes('virtus')
    const virtusAway = away_team?.toLowerCase().includes('virtus')
    
    return virtusHome ? home_score > away_score : virtusAway ? away_score > home_score : false
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const hasFilters = selectedCategory || selectedMonth || selectedYear
  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedMonth('')
    setSelectedYear('')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-yellow-400 animate-spin mb-4" />
            <p className="text-white">Caricamento risultati...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4 border-2 border-yellow-400">
              <FontAwesomeIcon icon={faChartLine} className="text-3xl text-yellow-400" />
            </div>
            <h1 className="text-7xl uppercase font-bold text-white mb-4">
              Tutti i <span className="text-yellow-400">Risultati</span>
            </h1>
            <p className="text-xl text-gray-300">
              Consulta tutti i risultati delle partite della Virtus Brindisi Basket
            </p>
          </div>

          {/* Filtri */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFilter} className="text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filtri</h3>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-yellow-500 hover:text-yellow-600 font-medium">
                  Cancella filtri
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FontAwesomeIcon icon={faUsers} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {getCategories().map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              >
                {getYears().map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>

              <div className="flex items-center text-sm text-gray-600">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                {filteredResults.length} risultat{filteredResults.length === 1 ? 'o' : 'i'}
              </div>
            </div>
          </div>

          {/* Contenuto */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faChartLine} className="text-6xl text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {hasFilters ? 'Nessun risultato trovato' : 'Non ci sono ancora risultati'}
              </h3>
              <p className="text-gray-400 mb-4">
                {hasFilters ? 'Prova a modificare i filtri.' : 'I risultati appariranno qui quando disponibili.'}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors font-medium"
                >
                  Mostra tutti i risultati
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => {
                const virtusWon = isVirtusWin(result)
                
                return (
                  <div key={result.id} className="relative">
                    {virtusWon && (
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
                          <FontAwesomeIcon icon={faTrophy} className="text-black text-lg" />
                        </div>
                      </div>
                    )}
                    
                    <ResultsCard
                      date={formatDate(result.match_date)}
                      location={result.location || "Sede da definire"}
                      homeTeam={result.home_team || "Casa"}
                      awayTeam={result.away_team || "Trasferta"}
                      homeScore={result.home_score ?? 0}
                      awayScore={result.away_score ?? 0}
                      category={result.category || "Categoria"}
                      isFullWidth={true}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
