import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { staffApi } from '../../api/staff'
import MainButton from '../UI elems/MainButton'
import ImageUploader from '../UI elems/ImageUploader'

export default function StaffForm({ staff, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    photo: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        description: staff.description || '',
        photo: staff.photo || '',
        is_active: staff.is_active !== false
      })
    }
  }, [staff])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Rimuovi errore quando l'utente inizia a correggere
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      photo: imageUrl
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio'
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Il ruolo è obbligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      let result
      if (staff) {
        // Modifica esistente
        result = await staffApi.update(staff.id, formData)
      } else {
        // Nuovo staff
        result = await staffApi.create(formData)
      }
      
      onSave?.(result)
      onClose()
    } catch (err) {
      console.error('Save error:', err)
      alert('Errore durante il salvataggio. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {staff ? 'Modifica Staff' : 'Nuovo Staff'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="es. Marco Rossi"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Ruolo */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Ruolo *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                errors.role ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="es. Allenatore, Assistente, Preparatore atletico..."
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Foto */}
          <ImageUploader
            currentImageUrl={formData.photo}
            onImageChange={handleImageChange}
            bucketName="staff-photos"
            label="Foto del Staff"
            maxSize={10}
            className="col-span-2"
          />

          {/* Descrizione */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Descrizione del membro dello staff, esperienza, background..."
            />
          </div>

          {/* Stato Attivo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Staff attivo (visibile sul sito)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <MainButton
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Annulla
            </MainButton>
            <MainButton
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50"
            >
              <FontAwesomeIcon 
                icon={faSave} 
                className={`mr-2 ${loading ? 'animate-spin' : ''}`} 
              />
              {loading ? 'Salvataggio...' : 'Salva'}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
