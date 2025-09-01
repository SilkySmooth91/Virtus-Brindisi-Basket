import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarCheck, 
  faDumbbell, 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faCalendar,
  faList,
  faUsers,
  faClock,
  faMapMarkerAlt,
  faHome,
  faPlane,
  faBan,
  faPlay,
  faInfoCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { 
  getAllScheduledMatches, 
  deleteScheduledMatch,
  updateScheduledMatch
} from '../../api/scheduledMatches'
import { 
  getAllTrainingSessions, 
  deleteTrainingSession,
  updateTrainingSession
} from '../../api/trainingSessions'
import MainButton from '../UI elems/MainButton'
import ScheduledMatchForm from '../Calendar/ScheduledMatchForm'
import TrainingSessionForm from '../Calendar/TrainingSessionForm'
import CalendarView from '../Calendar/CalendarView'

export default function CalendarManagement() {
  const [matches, setMatches] = useState([])
  const [trainingSessions, setTrainingSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMatchForm, setShowMatchForm] = useState(false)
  const [showTrainingForm, setShowTrainingForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [editingTraining, setEditingTraining] = useState(null)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' o 'list'
  const [activeTab, setActiveTab] = useState('matches') // 'matches' or 'training' (solo per vista lista)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [matchesData, trainingsData] = await Promise.all([
        getAllScheduledMatches(),
        getAllTrainingSessions()
      ])
      setMatches(matchesData)
      setTrainingSessions(trainingsData)
    } catch (err) {
      setError('Errore nel caricamento dei dati del calendario')
      console.error('Load calendar data error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Gestione Partite
  const handleDeleteMatch = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa partita?')) {
      return
    }

    try {
      await deleteScheduledMatch(id)
      setMatches(matches.filter(match => match.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete match error:', err)
    }
  }

  const handleEditMatch = (match) => {
    setEditingMatch(match)
    setShowMatchForm(true)
  }

  const handleCreateMatch = () => {
    setEditingMatch(null)
    setShowMatchForm(true)
  }

  const handleToggleMatchCancellation = async (match) => {
    try {
      const updated = await updateScheduledMatch(match.id, { 
        is_cancelled: !match.is_cancelled 
      })
      setMatches(matches.map(m => m.id === match.id ? updated : m))
    } catch (err) {
      alert(`Errore durante l'aggiornamento: ${err.message}`)
      console.error('Toggle match cancellation error:', err)
    }
  }

  // Gestione Allenamenti
  const handleDeleteTraining = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo allenamento?')) {
      return
    }

    try {
      await deleteTrainingSession(id)
      setTrainingSessions(trainingSessions.filter(training => training.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete training error:', err)
    }
  }

  const handleEditTraining = (training) => {
    setEditingTraining(training)
    setShowTrainingForm(true)
  }

  const handleCreateTraining = () => {
    setEditingTraining(null)
    setShowTrainingForm(true)
  }

  const handleToggleTrainingCancellation = async (training) => {
    try {
      const updated = await updateTrainingSession(training.id, { 
        is_cancelled: !training.is_cancelled 
      })
      setTrainingSessions(trainingSessions.map(t => t.id === training.id ? updated : t))
    } catch (err) {
      alert(`Errore durante l'aggiornamento: ${err.message}`)
      console.error('Toggle training cancellation error:', err)
    }
  }

  // Form handlers
  const handleMatchFormClose = () => {
    setShowMatchForm(false)
    setEditingMatch(null)
    loadData()
  }

  const handleTrainingFormClose = () => {
    setShowTrainingForm(false)
    setEditingTraining(null)
    loadData()
  }

  // Calendar handlers
  const handleCalendarCreateMatch = () => {
    setEditingMatch(null)
    setShowMatchForm(true)
  }

  const handleCalendarCreateTraining = () => {
    setEditingTraining(null)
    setShowTrainingForm(true)
  }

  const handleCalendarEditMatch = (match) => {
    setEditingMatch(match)
    setShowMatchForm(true)
  }

  const handleCalendarEditTraining = (training) => {
    setEditingTraining(training)
    setShowTrainingForm(true)
  }

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Data non specificata'
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.slice(0, 5) // Mostra solo HH:MM
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

  // Filtra per categoria
  const getFilteredData = () => {
    const data = activeTab === 'matches' ? matches : trainingSessions
    if (filterCategory === 'all') return data
    return data.filter(item => item.team_category === filterCategory)
  }

  // Ottieni categorie uniche
  const getAllCategories = () => {
    const allData = [...matches, ...trainingSessions]
    return [...new Set(allData.map(item => item.team_category).filter(Boolean))]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento calendario...</p>
        </div>
      </div>
    )
  }

  const filteredData = getFilteredData()
  const categories = getAllCategories()

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
                Gestione <span className="text-yellow-400">Calendario</span>
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer"
                title={viewMode === 'calendar' ? 'Vista Lista' : 'Vista Calendario'}
              >
                <FontAwesomeIcon icon={viewMode === 'calendar' ? faList : faCalendar} className="mr-2" />
                {viewMode === 'calendar' ? 'Lista' : 'Calendario'}
              </button>
              <MainButton
                onClick={handleCreateMatch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Nuova Partita
              </MainButton>
              <MainButton
                onClick={handleCreateTraining}
                className="bg-green-600 hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Nuovo Allenamento
              </MainButton>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs e Filtri - Solo per vista lista */}
      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Tabs */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'matches'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  Partite ({matches.length})
                </button>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer ${
                    activeTab === 'training'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faDumbbell} className="mr-2" />
                  Allenamenti ({trainingSessions.length})
                </button>
              </div>

              {/* Filtri */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Categoria:
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="all">Tutte</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-500">
                  ({filteredData.length} element{filteredData.length === 1 ? 'o' : 'i'})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Vista Calendario o Lista */}
          {viewMode === 'calendar' ? (
            <CalendarView 
              matches={matches}
              trainingSessions={trainingSessions}
              onEditMatch={handleCalendarEditMatch}
              onEditTraining={handleCalendarEditTraining}
              onCreateMatch={handleCalendarCreateMatch}
              onCreateTraining={handleCalendarCreateTraining}
            />
          ) : (
            // Vista Lista (contenuto esistente)
            filteredData.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon 
                  icon={activeTab === 'matches' ? faCalendarCheck : faDumbbell} 
                  className="w-16 h-16 text-gray-300 mx-auto mb-4" 
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun{activeTab === 'matches' ? 'a partita programmata' : ' allenamento programmato'}
                </h3>
                <p className="text-gray-500 mb-6">
                  Inizia aggiungendo {activeTab === 'matches' ? 'la prima partita' : 'il primo allenamento'} al calendario.
                </p>
                <MainButton
                  onClick={activeTab === 'matches' ? handleCreateMatch : handleCreateTraining}
                  className={`${activeTab === 'matches' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                  } text-white cursor-pointer`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Aggiungi {activeTab === 'matches' ? 'Partita' : 'Allenamento'}
                </MainButton>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                      item.is_cancelled ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Content */}
                        <div className="flex-1">
                          {/* Header con data e tipo */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                              {formatDate(item.date)}
                              {item.time && (
                                <>
                                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 ml-3 mr-1" />
                                  {formatTime(item.time)}
                                </>
                              )}
                            </div>
                            
                            {item.team_category && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                                {item.team_category}
                              </span>
                            )}

                            {item.is_cancelled && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FontAwesomeIcon icon={faBan} className="w-3 h-3 mr-1" />
                                Annullato
                              </span>
                            )}
                          </div>

                          {/* Contenuto specifico */}
                          {activeTab === 'matches' ? (
                            <div className="mb-3">
                              <div className="flex items-center space-x-4 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  vs {item.opponent_team || 'Avversario TBD'}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.is_home_match 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  <FontAwesomeIcon 
                                    icon={item.is_home_match ? faHome : faPlane} 
                                    className="w-3 h-3 mr-1" 
                                  />
                                  {item.is_home_match ? 'Casa' : 'Trasferta'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                <FontAwesomeIcon icon={faDumbbell} className="w-5 h-5 mr-2 text-green-600" />
                                Allenamento
                              </h3>
                              {item.notes && (
                                <p className="text-gray-600 text-sm">{item.notes}</p>
                              )}
                            </div>
                          )}

                          {/* Location */}
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-1" />
                              {item.location}
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            Aggiunto il {formatCreatedDate(item.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => activeTab === 'matches' 
                              ? handleToggleMatchCancellation(item)
                              : handleToggleTrainingCancellation(item)
                            }
                            className={`p-2 rounded transition-colors cursor-pointer ${
                              item.is_cancelled
                                ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                : 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                            }`}
                            title={item.is_cancelled ? 'Riattiva' : 'Annulla'}
                          >
                            <FontAwesomeIcon icon={item.is_cancelled ? faPlay : faBan} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => activeTab === 'matches' 
                              ? handleEditMatch(item) 
                              : handleEditTraining(item)
                            }
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer p-2 hover:bg-blue-50 rounded"
                            title="Modifica"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => activeTab === 'matches' 
                              ? handleDeleteMatch(item.id) 
                              : handleDeleteTraining(item.id)
                            }
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded"
                            title="Elimina"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Gestione Calendario
                      </h4>
                      <p className="text-sm text-blue-700">
                        Gli eventi sono ordinati per data decrescente. Usa i tab per navigare tra partite e allenamenti.
                        Puoi annullare temporaneamente gli eventi senza eliminarli.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* Form Modals */}
      {showMatchForm && (
        <ScheduledMatchForm
          match={editingMatch}
          onClose={handleMatchFormClose}
          onSave={loadData}
        />
      )}

      {showTrainingForm && (
        <TrainingSessionForm
          training={editingTraining}
          onClose={handleTrainingFormClose}
          onSave={loadData}
        />
      )}
    </div>
  )
}
