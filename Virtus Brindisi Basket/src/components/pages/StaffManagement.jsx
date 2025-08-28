import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faToggleOn,
  faToggleOff,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { staffApi } from '../../api/staff'
import MainButton from '../UI elems/MainButton'
import StaffForm from '../Staff/StaffForm'

export default function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    try {
      setLoading(true)
      const data = await staffApi.getAll()
      setStaff(data)
    } catch (err) {
      setError('Errore nel caricamento dello staff')
      console.error('Load staff error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo membro dello staff?')) {
      return
    }

    try {
      await staffApi.delete(id)
      setStaff(staff.filter(member => member.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete error:', err)
    }
  }

  const handleToggleActive = async (member) => {
    try {
      // Invia solo il campo che vogliamo aggiornare
      const updated = await staffApi.update(member.id, { 
        is_active: !member.is_active 
      })
      setStaff(staff.map(s => s.id === member.id ? updated : s))
    } catch (err) {
      alert(`Errore durante l'aggiornamento: ${err.message}`)
      console.error('Toggle active error:', err)
    }
  }

  const handleEdit = (member) => {
    setEditingStaff(member)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingStaff(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingStaff(null)
    loadStaff() // Ricarica i dati
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento staff...</p>
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
                Gestione <span className="text-yellow-400">Staff</span>
              </h1>
            </div>
            <MainButton
              onClick={handleCreate}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuovo Staff
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

          {/* Staff Grid */}
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faUser} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun membro dello staff</h3>
              <p className="text-gray-500 mb-6">Inizia aggiungendo il primo membro del team.</p>
              <MainButton
                onClick={handleCreate}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Aggiungi Staff
              </MainButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    member.is_active ? 'border-green-400' : 'border-gray-400'
                  }`}
                >
                  {/* Foto */}
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={member.photo || '/placeholder-user.jpg'}
                      alt={member.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* Contenuto */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.name} {member.surname}
                      </h3>
                      <button
                        onClick={() => handleToggleActive(member)}
                        className={`text-xl cursor-pointer ${
                          member.is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
                        }`}
                      >
                        <FontAwesomeIcon icon={member.is_active ? faToggleOn : faToggleOff} />
                      </button>
                    </div>

                    <p className="text-yellow-600 font-medium text-sm mb-2">
                      {member.role}
                    </p>

                    {member.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {member.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.is_active ? 'Attivo' : 'Inattivo'}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <StaffForm
          staff={editingStaff}
          onClose={handleFormClose}
          onSave={loadStaff}
        />
      )}
    </div>
  )
}
