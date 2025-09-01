import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faTrophy,
  faCalendarAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { 
  getAllPalmares, 
  deletePalmares 
} from '../../api/palmares'
import MainButton from '../UI elems/MainButton'
import PalmaresForm from '../Palmares/PalmaresForm'

export default function PalmaresManagement() {
  const [palmares, setPalmares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPalmares, setEditingPalmares] = useState(null)

  useEffect(() => {
    loadPalmares()
  }, [])

  const loadPalmares = async () => {
    try {
      setLoading(true)
      const data = await getAllPalmares()
      setPalmares(data)
    } catch (err) {
      setError('Errore nel caricamento del palmares')
      console.error('Load palmares error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo trofeo?')) {
      return
    }

    try {
      await deletePalmares(id)
      setPalmares(palmares.filter(item => item.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (item) => {
    setEditingPalmares(item)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingPalmares(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingPalmares(null)
    loadPalmares() // Ricarica i dati
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const groupByDecade = (items) => {
    const grouped = {}
    items.forEach(item => {
      if (item.year) {
        const decade = Math.floor(item.year / 10) * 10
        const decadeLabel = `${decade}s`
        if (!grouped[decadeLabel]) {
          grouped[decadeLabel] = []
        }
        grouped[decadeLabel].push(item)
      } else {
        // Items senza anno vanno in una categoria speciale
        if (!grouped['Senza Anno']) {
          grouped['Senza Anno'] = []
        }
        grouped['Senza Anno'].push(item)
      }
    })
    return grouped
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento palmares...</p>
        </div>
      </div>
    )
  }

  const groupedPalmares = groupByDecade(palmares)

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
                Gestione <span className="text-yellow-400">Palmares</span>
              </h1>
            </div>
            <MainButton
              onClick={handleCreate}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuovo Trofeo
            </MainButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Palmares Content */}
          {palmares.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faTrophy} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun trofeo nel palmares</h3>
              <p className="text-gray-500 mb-6">Inizia aggiungendo il primo trofeo al palmares della squadra.</p>
              <MainButton
                onClick={handleCreate}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Aggiungi Trofeo
              </MainButton>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedPalmares)
                .sort((a, b) => {
                  if (a === 'Senza Anno') return 1
                  if (b === 'Senza Anno') return -1
                  return b.localeCompare(a) // Ordine decrescente per decadi
                })
                .map(decade => (
                  <div key={decade} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header della decade */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 mr-2 text-yellow-500" />
                        {decade}
                      </h2>
                    </div>

                    {/* Trofei della decade */}
                    <div className="divide-y divide-gray-200">
                      {groupedPalmares[decade].map((item) => (
                        <div
                          key={item.id}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              {/* Icona Trofeo */}
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                  <FontAwesomeIcon icon={faTrophy} className="w-6 h-6 text-yellow-600" />
                                </div>
                              </div>

                              {/* Contenuto */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                  </h3>
                                  {item.year && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      {item.year}
                                    </span>
                                  )}
                                </div>

                                {item.description && (
                                  <p className="text-gray-600 text-sm mb-2">
                                    {item.description}
                                  </p>
                                )}

                                <p className="text-xs text-gray-500">
                                  Aggiunto il {formatDate(item.created_at)}
                                </p>
                              </div>
                            </div>

                            {/* Azioni */}
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer p-2 hover:bg-blue-50 rounded"
                                title="Modifica"
                              >
                                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded"
                                title="Elimina"
                              >
                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Organizzazione del Palmares
                    </h4>
                    <p className="text-sm text-blue-700">
                      I trofei sono automaticamente raggruppati per decade. Quelli senza anno specificato 
                      appariranno in una sezione separata.
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
        <PalmaresForm
          palmares={editingPalmares}
          onClose={handleFormClose}
          onSave={loadPalmares}
        />
      )}
    </div>
  )
}
