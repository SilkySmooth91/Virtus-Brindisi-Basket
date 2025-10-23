import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faFilter,
  faUserFriends,
  faBasketballBall
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'

// Importa i file JSON delle formazioni
// import under19Data from '../../data/formazioni/under19.json' // Commentato temporaneamente

export default function Roster() {
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teamData, setTeamData] = useState(null)

  // Mappa delle formazioni disponibili (dati placeholder)
  const availableTeams = {
    'under19': { 
      label: 'Under 19', 
      data: {
        nome: 'Under 19',
        giocatori: [] // Dati nascosti temporaneamente
      }
    },
    'under17': { 
      label: 'Under 17', 
      data: {
        nome: 'Under 17',
        giocatori: []
      }
    },
    'prima_squadra': { 
      label: 'Prima Squadra', 
      data: {
        nome: 'Prima Squadra',
        giocatori: []
      }
    }
  }

  // Opzioni per il dropdown
  const getTeamOptions = () => {
    return [
      { value: '', label: 'Seleziona una formazione' },
      ...Object.entries(availableTeams).map(([key, team]) => ({
        value: key,
        label: team.label
      }))
    ]
  }

  // Carica i dati della formazione selezionata
  useEffect(() => {
    if (selectedTeam && availableTeams[selectedTeam]) {
      setTeamData(availableTeams[selectedTeam].data)
    } else {
      setTeamData(null)
    }
  }, [selectedTeam])

  const clearFilter = () => {
    setSelectedTeam('')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FontAwesomeIcon icon={faUserFriends} className="text-3xl text-yellow-400" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl uppercase font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Le Nostre <span className="text-yellow-400">Formazioni</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Scopri i giocatori che compongono le squadre della Virtus Brindisi Basket
            </motion.p>
          </motion.div>

          {/* Filtro */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-yellow-400"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFilter} className="text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Seleziona Formazione</h3>
              </div>
              {selectedTeam && (
                <button 
                  onClick={clearFilter} 
                  className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                >
                  Cancella selezione
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative md:col-span-2">
                <FontAwesomeIcon 
                  icon={faUsers} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {getTeamOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {teamData && (
                <div className="flex items-center text-sm text-yellow-600">
                  <FontAwesomeIcon icon={faBasketballBall} className="mr-2" />
                  <span className="font-medium">Formazione in aggiornamento</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contenuto Formazione */}
          {teamData ? (
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {teamData.nome}
                </h2>
                <p className="text-gray-600 mb-6">
                  Stagione 2025/2026
                </p>
              </div>

              {/* Placeholder - Formazioni in aggiornamento */}
              <div className="text-center py-12">
                <FontAwesomeIcon 
                  icon={faBasketballBall} 
                  className="text-6xl text-yellow-400 mb-6" 
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Formazione in aggiornamento
                </h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  I roster delle nostre squadre sono attualmente in fase di definizione per la nuova stagione. 
                  Le formazioni ufficiali saranno pubblicate a breve.
                </p>
                <div className="mt-8 inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FontAwesomeIcon icon={faUsers} className="text-yellow-500 mr-2" />
                  <span className="text-yellow-600 font-medium">Grazie per la pazienza!</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-12 text-center border-2 border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FontAwesomeIcon 
                icon={faUsers} 
                className="text-6xl text-gray-400 mb-4" 
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nessuna formazione selezionata
              </h3>
              <p className="text-gray-500">
                Seleziona una formazione dal menu a tendina per visualizzare i giocatori
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}