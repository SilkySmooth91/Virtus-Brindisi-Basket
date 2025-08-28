import { motion } from "motion/react"
import { useState, useEffect } from "react"
import InfoCard from "./InfoCard"
import { getPalmaresForDisplay } from "../../api/palmares"

export default function Palmares() {
  const [palmares, setPalmares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        setLoading(true)
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

  if (loading) {
    return (
      <section className="py-8 px-4 md:px-8">
        <motion.div 
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <h2 className="p-title text-3xl font-bold text-white mb-6">
              I nostri trofei parlano del nostro 
              <span className="text-yellow-400"> impegno</span>
            </h2>
        </motion.div>
        <div className="text-white text-center py-8">Caricamento palmares...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 px-4 md:px-8">
        <motion.div 
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <h2 className="p-title text-3xl font-bold text-white mb-6">
              I nostri trofei parlano del nostro 
              <span className="text-yellow-400"> impegno</span>
            </h2>
        </motion.div>
        <div className="text-red-400 text-center py-8">{error}</div>
      </section>
    )
  }

  return (
    <section className="py-8 px-4 md:px-8">
        <motion.div 
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <h2 className="p-title text-3xl font-bold text-white mb-6">
              I nostri trofei parlano del nostro 
              <span className="text-yellow-400"> impegno</span>
            </h2>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            {palmares.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {palmares.slice(0, 2).map((achievement) => (
                    <InfoCard key={achievement.id} className="p-6 flex-col justify-start min-h-[200px]">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                        {achievement.name}
                      </h3>
                      <div className="text-2xl font-bold text-yellow-600 mb-3 text-center">
                        {achievement.year}
                      </div>
                      <p className="text-gray-600 text-sm text-center flex-grow">
                        {achievement.description}
                      </p>
                    </InfoCard>
                  ))}
                </div>
                {palmares.length > 2 && (
                  <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                    {palmares.slice(2, 4).map((achievement) => (
                      <InfoCard key={achievement.id} className="p-6 flex-col justify-start min-h-[200px]">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                          {achievement.name}
                        </h3>
                        <div className="text-2xl font-bold text-yellow-600 mb-3 text-center">
                          {achievement.year}
                        </div>
                        <p className="text-gray-600 text-sm text-center flex-grow">
                          {achievement.description}
                        </p>
                      </InfoCard>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <InfoCard className="p-6 flex-col justify-center min-h-[200px]">
                  <div className="text-gray-500 text-center">
                    <h3 className="text-xl font-bold mb-3">Nessun riconoscimento disponibile</h3>
                    <p>I trofei e riconoscimenti verranno mostrati qui appena disponibili.</p>
                  </div>
                </InfoCard>
                <InfoCard className="p-6 flex-col justify-center min-h-[200px]">
                  <div className="text-gray-500 text-center">
                    <h3 className="text-xl font-bold mb-3">Aggiungi contenuti</h3>
                    <p>Utilizza la dashboard amministratore per aggiungere trofei e riconoscimenti.</p>
                  </div>
                </InfoCard>
              </div>
            )}
        </motion.div>
    </section>
  )
}
