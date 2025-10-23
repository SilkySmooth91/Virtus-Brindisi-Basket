import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarCheck, 
  faUsers,
  faSpinner,
  faExclamationTriangle,
  faHome,
  faPlane,
  faFilter
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'
import CalendarView from '../Calendar/CalendarView'
import { getAllScheduledMatches } from '../../api/scheduledMatches'

export default function MatchSchedule() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState('all')

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const data = await getAllScheduledMatches()
      // Filtra solo le partite non annullate
      const activeMatches = data.filter(match => !match.is_cancelled)
      setMatches(activeMatches)
    } catch (err) {
      setError('Errore nel caricamento delle partite')
      console.error('Load matches error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ottieni le categorie di squadra uniche
  const getTeamCategories = () => {
    const categories = [...new Set(matches.map(match => match.team_category).filter(Boolean))]
    return categories.sort()
  }

  // Filtra le partite per squadra selezionata
  const getFilteredMatches = () => {
    if (selectedTeam === 'all') {
      return matches
    }
    return matches.filter(match => match.team_category === selectedTeam)
  }

  const teamCategories = getTeamCategories()
  const filteredMatches = getFilteredMatches()

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" 
            />
            <p className="text-gray-300">Caricamento calendario partite...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="w-16 h-16 text-red-400 mx-auto mb-4" 
            />
            <h2 className="text-xl font-bold text-white mb-2">
              Errore di caricamento
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={loadMatches}
              className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors font-medium"
            >
              Riprova
            </button>
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
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="text-3xl text-yellow-400" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl uppercase font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Calendario <span className="text-yellow-400">Partite</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Consulta il calendario delle partite di tutte le squadre della Virtus Brindisi Basket
            </motion.p>
          </motion.div>

          {/* Filtro Squadre */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-yellow-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFilter} className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Filtra per squadra:
                </label>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                >
                  <option value="all">Tutte le squadre</option>
                  {teamCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                
                <div className="text-sm text-gray-500">
                  ({filteredMatches.length} partit{filteredMatches.length === 1 ? 'a' : 'e'})
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistiche rapide */}
          {filteredMatches.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-yellow-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Partite in Casa</p>
                    <p className="text-xl font-bold text-gray-900">
                      {filteredMatches.filter(match => match.is_home_match).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-yellow-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 rounded mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Partite in Trasferta</p>
                    <p className="text-xl font-bold text-gray-900">
                      {filteredMatches.filter(match => !match.is_home_match).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-yellow-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 rounded mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Totale Partite</p>
                    <p className="text-xl font-bold text-gray-900">
                      {filteredMatches.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Calendario */}
          {filteredMatches.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-12 text-center border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FontAwesomeIcon 
                icon={faCalendarCheck} 
                className="w-16 h-16 text-gray-300 mx-auto mb-4" 
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedTeam === 'all' 
                  ? 'Nessuna partita programmata' 
                  : `Nessuna partita programmata per ${selectedTeam}`
                }
              </h3>
              <p className="text-gray-500">
                Le partite verranno pubblicate non appena disponibili.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <CalendarView 
                matches={filteredMatches}
                trainingSessions={[]} // Non mostriamo gli allenamenti in questa vista
                onEditMatch={() => {}} // Disabilitiamo la modifica per gli utenti pubblici
                onEditTraining={() => {}}
                onCreateMatch={() => {}}
                onCreateTraining={() => {}}
                isPublicView={true} // Indica che è una vista pubblica
              />
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
