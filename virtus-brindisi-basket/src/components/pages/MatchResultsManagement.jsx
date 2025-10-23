import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faChartLine,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faTrophy,
  faInfoCircle,
  faHome,
  faPlane
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { 
  getAllMatchResults, 
  deleteMatchResult 
} from '../../api/matchResults'
import MainButton from '../UI elems/MainButton'
import MatchResultsForm from '../MatchResults/MatchResultsForm'

export default function MatchResultsManagement() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingResult, setEditingResult] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const data = await getAllMatchResults()
      setResults(data)
    } catch (err) {
      setError('Errore nel caricamento dei risultati')
      console.error('Load results error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo risultato?')) {
      return
    }

    try {
      await deleteMatchResult(id)
      setResults(results.filter(result => result.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (result) => {
    setEditingResult(result)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingResult(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingResult(null)
    loadResults()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data non specificata'
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCreatedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMatchResult = (result) => {
    if (!result.home_score && result.home_score !== 0) return null
    if (!result.away_score && result.away_score !== 0) return null
    
    // Identifica se la Virtus gioca in casa o in trasferta
    const virtusAtHome = result.home_team && result.home_team.toLowerCase().includes('virtus')
    const virtusAway = result.away_team && result.away_team.toLowerCase().includes('virtus')
    
    if (!virtusAtHome && !virtusAway) return null // Se la Virtus non è identificata
    
    let virtusScore, opponentScore
    
    if (virtusAtHome) {
      virtusScore = result.home_score
      opponentScore = result.away_score
    } else {
      virtusScore = result.away_score
      opponentScore = result.home_score
    }
    
    if (virtusScore > opponentScore) return 'win'
    if (virtusScore < opponentScore) return 'loss'
    return null // Nel basket non ci sono pareggi
  }

  const getResultBadge = (result) => {
    const matchResult = getMatchResult(result)
    if (!matchResult) return null

    const badges = {
      win: { color: 'bg-green-100 text-green-800', text: 'Vittoria' },
      loss: { color: 'bg-red-100 text-red-800', text: 'Sconfitta' }
    }

    return badges[matchResult]
  }

  // Filtra risultati per categoria
  const filteredResults = results.filter(result => {
    if (filterCategory === 'all') return true
    return result.category === filterCategory
  })

  // Ottieni categorie uniche
  const categories = [...new Set(results.map(result => result.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento risultati...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-white">
                Gestione <span className="text-yellow-400">Risultati</span>
              </h1>
            </div>
            <MainButton
              onClick={handleCreate}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuovo Risultato
            </MainButton>
          </div>
        </div>
      </header>

      {/* Filtri */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filtra per categoria:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="all">Tutte le categorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              ({filteredResults.length} risultat{filteredResults.length === 1 ? 'o' : 'i'})
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Results Content */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faChartLine} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {results.length === 0 ? 'Nessun risultato inserito' : 'Nessun risultato per questa categoria'}
              </h3>
              <p className="text-gray-500 mb-6">
                {results.length === 0 
                  ? 'Inizia aggiungendo il primo risultato delle partite.'
                  : 'Cambia filtro o aggiungi nuovi risultati.'
                }
              </p>
              <MainButton
                onClick={handleCreate}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Aggiungi Risultato
              </MainButton>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => {
                const resultBadge = getResultBadge(result)
                return (
                  <div
                    key={result.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Match Info */}
                        <div className="flex-1">
                          {/* Data e Categoria */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                              {formatDate(result.match_date)}
                            </div>
                            {result.category && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                                {result.category}
                              </span>
                            )}
                            {resultBadge && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resultBadge.color}`}>
                                <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 mr-1" />
                                {resultBadge.text}
                              </span>
                            )}
                          </div>

                          {/* Match Score */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900">
                                {result.home_team || 'Casa'}
                              </span>
                              <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                            </div>
                            
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded">
                              <span className="text-xl font-bold text-gray-900">
                                {result.home_score ?? '-'}
                              </span>
                              <span className="text-gray-500">-</span>
                              <span className="text-xl font-bold text-gray-900">
                                {result.away_score ?? '-'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faPlane} className="w-4 h-4 text-gray-500" />
                              <span className="text-lg font-semibold text-gray-900">
                                {result.away_team || 'Trasferta'}
                              </span>
                            </div>
                          </div>

                          {/* Location */}
                          {result.location && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-1" />
                              {result.location}
                            </div>
                          )}

                          {/* Created Date */}
                          <p className="text-xs text-gray-500">
                            Aggiunto il {formatCreatedDate(result.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(result)}
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer p-2 hover:bg-blue-50 rounded"
                            title="Modifica"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(result.id)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded"
                            title="Elimina"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Gestione Risultati
                    </h4>
                    <p className="text-sm text-blue-700">
                      I risultati sono automaticamente ordinati per data decrescente. 
                      Usa i filtri per categoria per organizzare meglio la visualizzazione.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <MatchResultsForm
          result={editingResult}
          onClose={handleFormClose}
          onSave={loadResults}
        />
      )}
    </div>
  )
}
