import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrophy, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { 
  createPalmares, 
  updatePalmares 
} from '../../api/palmares'
import MainButton from '../UI elems/MainButton'

export default function PalmaresForm({ palmares, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (palmares) {
      setFormData({
        name: palmares.name || '',
        year: palmares.year || '',
        description: palmares.description || ''
      })
    }
  }, [palmares])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validazione
      if (!formData.name.trim()) {
        setError('Il nome del trofeo è obbligatorio')
        return
      }

      // Prepara i dati per il salvataggio
      const saveData = {
        name: formData.name.trim(),
        year: formData.year ? parseInt(formData.year) : null,
        description: formData.description.trim() || null
      }

      // Validazione anno
      if (saveData.year && (saveData.year < 1900 || saveData.year > new Date().getFullYear() + 1)) {
        setError('L\'anno deve essere compreso tra 1900 e il prossimo anno')
        return
      }

      if (palmares) {
        // Update existing palmares
        await updatePalmares(palmares.id, saveData)
      } else {
        // Create new palmares
        await createPalmares(saveData)
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 mr-2 text-yellow-500" />
            {palmares ? 'Modifica Trofeo' : 'Nuovo Trofeo'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Nome Trofeo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Trofeo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Es. Campionato Serie A, Coppa Italia..."
              disabled={loading}
              required
            />
          </div>

          {/* Anno */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anno
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max={currentYear + 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder={`Es. ${currentYear}`}
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Opzionale. Anno in cui è stato vinto il trofeo.
            </p>
          </div>

          {/* Descrizione */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Descrizione del trofeo, dettagli sulla vittoria, importanza del riconoscimento..."
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Opzionale. Aggiungi dettagli sul trofeo o sulla vittoria.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              Annulla
            </button>
            <MainButton
              type="submit"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrophy} className="w-4 h-4 mr-2" />
                  {palmares ? 'Aggiorna' : 'Salva'}
                </>
              )}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
