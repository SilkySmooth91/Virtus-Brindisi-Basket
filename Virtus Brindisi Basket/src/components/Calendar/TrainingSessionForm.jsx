import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faDumbbell, 
  faSpinner,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faUsers,
  faStickyNote,
  faRedo
} from '@fortawesome/free-solid-svg-icons'
import { 
  createTrainingSession, 
  updateTrainingSession 
} from '../../api/trainingSessions'
import MainButton from '../UI elems/MainButton'

export default function TrainingSessionForm({ training, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    team_category: '',
    notes: '',
    is_cancelled: false,
    // Campi per la ripetizione
    is_recurring: false,
    recurrence_type: 'weekly', // 'weekly', 'biweekly', 'monthly'
    recurrence_end: '',
    recurrence_count: 4
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (training) {
      setFormData({
        date: training.date || '',
        time: training.time || '',
        location: training.location || '',
        team_category: training.team_category || '',
        notes: training.notes || '',
        is_cancelled: training.is_cancelled ?? false,
        // I campi di ripetizione sono solo per nuovi allenamenti
        is_recurring: false,
        recurrence_type: 'weekly',
        recurrence_end: '',
        recurrence_count: 4
      })
    }
  }, [training])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateRecurringTrainings = (baseTraining) => {
    const trainings = []
    const startDate = new Date(baseTraining.date)
    let currentDate = new Date(startDate)
    
    const intervalMap = {
      'weekly': 7,
      'biweekly': 14,
      'monthly': 30
    }
    
    const interval = intervalMap[formData.recurrence_type] || 7
    const endDate = formData.recurrence_end ? new Date(formData.recurrence_end) : null
    const maxCount = formData.recurrence_count || 4
    
    for (let i = 0; i < maxCount; i++) {
      // Se è specificata una data di fine, controlla che non sia superata
      if (endDate && currentDate > endDate) {
        break
      }
      
      trainings.push({
        ...baseTraining,
        date: currentDate.toISOString().split('T')[0]
      })
      
      // Sposta alla prossima data
      currentDate = new Date(currentDate)
      currentDate.setDate(currentDate.getDate() + interval)
    }
    
    return trainings
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

      if (formData.is_recurring && !training) {
        // Validazioni per allenamenti ricorrenti
        if (formData.recurrence_count < 1 || formData.recurrence_count > 52) {
          setError('Il numero di ripetizioni deve essere tra 1 e 52')
          return
        }
        
        if (formData.recurrence_end && new Date(formData.recurrence_end) <= new Date(formData.date)) {
          setError('La data di fine deve essere successiva alla data di inizio')
          return
        }
      }

      // Prepara i dati base per il salvataggio
      const baseData = {
        date: formData.date || null,
        time: formData.time || null,
        location: formData.location.trim() || null,
        team_category: formData.team_category.trim() || null,
        notes: formData.notes.trim() || null,
        is_cancelled: formData.is_cancelled
      }

      if (training) {
        // Update existing training (niente ricorrenza in modifica)
        await updateTrainingSession(training.id, baseData)
      } else {
        // Create new training(s)
        if (formData.is_recurring) {
          // Crea allenamenti ricorrenti
          const recurringTrainings = generateRecurringTrainings(baseData)
          
          // Crea tutti gli allenamenti in sequenza
          for (const trainingData of recurringTrainings) {
            await createTrainingSession(trainingData)
          }
        } else {
          // Crea singolo allenamento
          await createTrainingSession(baseData)
        }
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
    'Prima Squadra',
    'Serie A',
    'Serie B',
    'Serie C',
    'Giovanili U19',
    'Giovanili U17',
    'Giovanili U15',
    'Giovanili U13',
    'Minibasket',
    'Preparazione Atletica'
  ]

  // Luoghi comuni di allenamento
  const commonLocations = [
    'PalaPentassuglia',
    'Palestra Comunale',
    'Centro Sportivo Virtus',
    'Campo Esterno'
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faDumbbell} className="w-5 h-5 mr-2 text-green-500" />
            {training ? 'Modifica Allenamento' : 'Nuovo Allenamento'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                  list="locations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Es. PalaPentassuglia"
                  disabled={loading}
                />
                <datalist id="locations">
                  {commonLocations.map(location => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Es. Prima Squadra, U19..."
                  disabled={loading}
                />
                <datalist id="categories">
                  {commonCategories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faStickyNote} className="w-4 h-4 mr-1" />
                  Note
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Note sull'allenamento, focus specifici, materiali necessari..."
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Opzionale. Aggiungi dettagli specifici per l'allenamento.
                </p>
              </div>
            </div>
          </div>

          {/* Sezione Ricorrenza (solo per nuovi allenamenti) */}
          {!training && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_recurring"
                    id="is_recurring"
                    checked={formData.is_recurring}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="is_recurring" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                    <FontAwesomeIcon icon={faRedo} className="w-4 h-4 mr-1" />
                    Allenamento ricorrente
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500 ml-6">
                  Crea automaticamente più allenamenti con la stessa configurazione
                </p>
              </div>

              {formData.is_recurring && (
                <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tipo di Ricorrenza */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequenza
                    </label>
                    <select
                      name="recurrence_type"
                      value={formData.recurrence_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      disabled={loading}
                    >
                      <option value="weekly">Ogni settimana</option>
                      <option value="biweekly">Ogni 2 settimane</option>
                      <option value="monthly">Ogni mese</option>
                    </select>
                  </div>

                  {/* Numero di Ripetizioni */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numero allenamenti
                    </label>
                    <input
                      type="number"
                      name="recurrence_count"
                      value={formData.recurrence_count}
                      onChange={handleInputChange}
                      min="1"
                      max="52"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Max 52 allenamenti
                    </p>
                  </div>

                  {/* Data Fine (Opzionale) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fine ricorrenza (opzionale)
                    </label>
                    <input
                      type="date"
                      name="recurrence_end"
                      value={formData.recurrence_end}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Limita la fine della serie
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checkbox Annullato (solo in modifica) */}
          {training && (
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
                  Allenamento annullato
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
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Annulla
            </button>
            <MainButton
              type="submit"
              disabled={loading || !formData.date}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDumbbell} className="w-4 h-4 mr-2" />
                  {training 
                    ? 'Aggiorna' 
                    : formData.is_recurring 
                      ? `Crea ${formData.recurrence_count} Allenamenti`
                      : 'Salva'
                  }
                </>
              )}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
