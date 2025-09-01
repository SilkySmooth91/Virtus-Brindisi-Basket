import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faCalendarCheck, 
  faSpinner,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faUsers,
  faHome,
  faPlane
} from '@fortawesome/free-solid-svg-icons'
import { 
  createScheduledMatch, 
  updateScheduledMatch 
} from '../../api/scheduledMatches'
import MainButton from '../UI elems/MainButton'

export default function ScheduledMatchForm({ match, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    team_category: '',
    opponent_team: '',
    is_home_match: true,
    is_cancelled: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (match) {
      setFormData({
        date: match.date || '',
        time: match.time || '',
        location: match.location || '',
        team_category: match.team_category || '',
        opponent_team: match.opponent_team || '',
        is_home_match: match.is_home_match ?? true,
        is_cancelled: match.is_cancelled ?? false
      })
    }
  }, [match])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validazione
      if (!formData.date) {
        setError('La data è obbligatoria')
        return
      }

      if (!formData.opponent_team.trim()) {
        setError('La squadra avversaria è obbligatoria')
        return
      }

      // Validazione data futura per nuove partite
      if (!match && new Date(formData.date) < new Date().setHours(0,0,0,0)) {
        setError('Non è possibile programmare partite nel passato')
        return
      }

      // Prepara i dati per il salvataggio
      const saveData = {
        date: formData.date || null,
        time: formData.time || null,
        location: formData.location.trim() || null,
        team_category: formData.team_category.trim() || null,
        opponent_team: formData.opponent_team.trim(),
        is_home_match: formData.is_home_match,
        is_cancelled: formData.is_cancelled
      }

      if (match) {
        // Update existing match
        await updateScheduledMatch(match.id, saveData)
      } else {
        // Create new match
        await createScheduledMatch(saveData)
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

  // Categorie predefinite comuni
  const commonCategories = [
    'Serie A',
    'Serie B',
    'Serie C',
    'Coppa Italia',
    'Playoff',
    'Playout',
    'Amichevole',
    'Torneo',
    'Giovanili U19',
    'Giovanili U17',
    'Giovanili U15'
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5 mr-2 text-blue-500" />
            {match ? 'Modifica Partita' : 'Nuova Partita'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prima colonna */}
            <div className="space-y-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  required
                />
              </div>

              {/* Orario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                  Orario
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Luogo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-1" />
                  Luogo
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Es. PalaPentassuglia, Brindisi"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Seconda colonna */}
            <div className="space-y-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                  Categoria
                </label>
                <input
                  type="text"
                  name="team_category"
                  value={formData.team_category}
                  onChange={handleInputChange}
                  list="categories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Es. Serie A, Coppa Italia..."
                  disabled={loading}
                />
                <datalist id="categories">
                  {commonCategories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              {/* Squadra Avversaria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Squadra Avversaria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="opponent_team"
                  value={formData.opponent_team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Es. Olimpia Milano"
                  disabled={loading}
                  required
                />
              </div>

              {/* Casa/Trasferta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Partita
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_home_match: true }))}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      formData.is_home_match
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Casa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_home_match: false }))}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                      !formData.is_home_match
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faPlane} className="mr-2" />
                    Trasferta
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox Annullata (solo in modifica) */}
          {match && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_cancelled"
                  id="is_cancelled"
                  checked={formData.is_cancelled}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="is_cancelled" className="ml-2 block text-sm text-gray-700">
                  Partita annullata
                </label>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Annulla
            </button>
            <MainButton
              type="submit"
              disabled={loading || !formData.date || !formData.opponent_team.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCalendarCheck} className="w-4 h-4 mr-2" />
                  {match ? 'Aggiorna' : 'Salva'}
                </>
              )}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
