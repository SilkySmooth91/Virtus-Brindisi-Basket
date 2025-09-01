import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faChartLine, 
  faSpinner,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faHome,
  faPlane
} from '@fortawesome/free-solid-svg-icons'
import { 
  createMatchResult, 
  updateMatchResult 
} from '../../api/matchResults'
import MainButton from '../UI elems/MainButton'

export default function MatchResultsForm({ result, onClose, onSave }) {
  const [formData, setFormData] = useState({
    match_date: '',
    location: '',
    category: '',
    home_team: '',
    away_team: '',
    home_score: '',
    away_score: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (result) {
      setFormData({
        match_date: result.match_date || '',
        location: result.location || '',
        category: result.category || '',
        home_team: result.home_team || '',
        away_team: result.away_team || '',
        home_score: result.home_score !== null && result.home_score !== undefined ? result.home_score.toString() : '',
        away_score: result.away_score !== null && result.away_score !== undefined ? result.away_score.toString() : ''
      })
    }
  }, [result])

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
      // Validazione di base
      if (!formData.home_team.trim() && !formData.away_team.trim()) {
        setError('Specificare almeno una delle due squadre')
        return
      }

      // Prepara i dati per il salvataggio
      const saveData = {
        match_date: formData.match_date || null,
        location: formData.location.trim() || null,
        category: formData.category.trim() || null,
        home_team: formData.home_team.trim() || null,
        away_team: formData.away_team.trim() || null,
        home_score: formData.home_score !== '' ? parseInt(formData.home_score) : null,
        away_score: formData.away_score !== '' ? parseInt(formData.away_score) : null
      }

      // Validazione punteggi
      if (saveData.home_score !== null && (saveData.home_score < 0 || saveData.home_score > 200)) {
        setError('Il punteggio casa deve essere tra 0 e 200')
        return
      }
      if (saveData.away_score !== null && (saveData.away_score < 0 || saveData.away_score > 200)) {
        setError('Il punteggio trasferta deve essere tra 0 e 200')
        return
      }

      // Validazione data
      if (saveData.match_date && new Date(saveData.match_date) > new Date()) {
        setError('La data della partita non può essere nel futuro')
        return
      }

      if (result) {
        // Update existing result
        await updateMatchResult(result.id, saveData)
      } else {
        // Create new result
        await createMatchResult(saveData)
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
    'Giovanili'
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mr-2 text-yellow-500" />
            {result ? 'Modifica Risultato' : 'Nuovo Risultato'}
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
              {/* Data Partita */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                  Data Partita
                </label>
                <input
                  type="date"
                  name="match_date"
                  value={formData.match_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Es. PalaPentassuglia, Brindisi"
                  disabled={loading}
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                  Categoria
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  list="categories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Es. Serie A, Coppa Italia..."
                  disabled={loading}
                />
                <datalist id="categories">
                  {commonCategories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Seconda colonna */}
            <div className="space-y-4">
              {/* Squadra Casa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-1" />
                  Squadra Casa
                </label>
                <input
                  type="text"
                  name="home_team"
                  value={formData.home_team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Es. Virtus Brindisi"
                  disabled={loading}
                />
              </div>

              {/* Squadra Trasferta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faPlane} className="w-4 h-4 mr-1" />
                  Squadra Trasferta
                </label>
                <input
                  type="text"
                  name="away_team"
                  value={formData.away_team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Es. Squadra Avversaria"
                  disabled={loading}
                />
              </div>

              {/* Punteggi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punteggio
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="home_score"
                      value={formData.home_score}
                      onChange={handleInputChange}
                      min="0"
                      max="200"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-center text-lg font-semibold"
                      placeholder="0"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">Casa</p>
                  </div>
                  <div className="text-gray-500 text-lg font-bold">-</div>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="away_score"
                      value={formData.away_score}
                      onChange={handleInputChange}
                      min="0"
                      max="200"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-center text-lg font-semibold"
                      placeholder="0"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">Trasferta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 mr-2" />
                  {result ? 'Aggiorna' : 'Salva'}
                </>
              )}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
