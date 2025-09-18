import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'
import InfoCard from '../UI elems/InfoCard'
import { getPalmaresForDisplay } from '../../api/palmares'

export default function PalmaresPage() {
  const [palmares, setPalmares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPalmaresForDisplay()
        setPalmares(data)
      } catch (err) {
        console.error('Error fetching palmares:', err)
        setError('Errore nel caricamento del palmares')
      } finally {
        setLoading(false)
      }
    }

    fetchPalmares()
  }, [])

  // Identifica i primi posti
  const isFirstPlace = (description) => {
    if (!description) return false
    const lowerDesc = description.toLowerCase()
    return lowerDesc.includes('1° posto') || 
           lowerDesc.includes('campioni') || 
           lowerDesc.includes('promozione') ||
           lowerDesc.includes('primi classificati') ||
           lowerDesc.includes('vincitori') ||
           lowerDesc.includes('primo posto')
  }

  // Separa e ordina per anno (più recenti prima)
  const sortByYear = (items) => {
    return [...items].sort((a, b) => {
      if (!a.year && !b.year) return 0
      if (!a.year) return 1
      if (!b.year) return -1
      return b.year - a.year
    })
  }

  const firstPlaces = sortByYear(palmares.filter(item => isFirstPlace(item.description)))
  const otherAchievements = sortByYear(palmares.filter(item => !isFirstPlace(item.description)))

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Caricamento palmares...</p>
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
          <div className="text-center">
            <FontAwesomeIcon icon={faTrophy} className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-4">Errore nel caricamento</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const PalmaresCard = ({ achievement, showTrophy = false }) => (
    <InfoCard className="p-6 flex-col justify-start min-h-[200px] max-w-lg flex-shrink-0">
      {showTrophy && (
        <div className="text-center mb-3">
          <FontAwesomeIcon icon={faTrophy} className="w-16 h-16 text-yellow-600" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
        {achievement.name}
      </h3>
      {achievement.year && (
        <div className="text-2xl font-bold bg-yellow-100 rounded-3xl px-2 py-1 text-yellow-600 mb-3 text-center">
          {achievement.year}
        </div>
      )}
      <p className="text-gray-600 text-sm text-center flex-grow">
        {achievement.description}
      </p>
    </InfoCard>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div
            className="text-center mb-12"
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
              <FontAwesomeIcon icon={faTrophy} className="text-3xl text-yellow-400" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl uppercase font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Il nostro <span className="text-yellow-400">Palmares</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Una collezione di traguardi che rappresentano anni di impegno, dedizione e spirito di squadra.
            </motion.p>
          </motion.div>

          {palmares.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InfoCard className="max-w-2xl mx-auto p-8">
                <FontAwesomeIcon icon={faTrophy} className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Il palmares è in costruzione</h3>
                <p className="text-gray-600">
                  I nostri trofei e riconoscimenti saranno presto disponibili.
                </p>
              </InfoCard>
            </motion.div>
          ) : (
            <div className="space-y-16">
              
              {/* Primi Posti */}
              {firstPlaces.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Header con linea divisoria */}
                  <div className="flex items-center mb-8">
                    <FontAwesomeIcon icon={faTrophy} className="w-8 h-8 text-yellow-400 mr-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Primi <span className="text-yellow-400">Posti</span>
                    </h2>
                    <div className="flex-1 h-px bg-yellow-400 ml-6"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {firstPlaces.map((achievement) => (
                      <PalmaresCard key={achievement.id} achievement={achievement} showTrophy={true} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Migliori Piazzamenti */}
              {otherAchievements.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: firstPlaces.length > 0 ? 0.2 : 0.1 }}
                >
                  {/* Header con linea divisoria */}
                  <div className="flex items-center mb-8">
                    <FontAwesomeIcon icon={faTrophy} className="w-8 h-8 text-yellow-400 mr-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Migliori <span className="text-yellow-400">Piazzamenti</span>
                    </h2>
                    <div className="flex-1 h-px bg-yellow-400 ml-6"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {otherAchievements.map((achievement) => (
                      <PalmaresCard key={achievement.id} achievement={achievement} showTrophy={false} />
                    ))}
                  </div>
                </motion.section>
              )}

            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}
