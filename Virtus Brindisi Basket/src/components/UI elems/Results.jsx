import { motion } from "motion/react"
import { useState, useEffect } from "react"
import ResultsCard from "./ResultsCard"
import { getRecentMatchResults } from "../../api/matchResults"

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        const data = await getRecentMatchResults(4) // Prendiamo gli ultimi 4 risultati
        setResults(data)
      } catch (err) {
        setError('Errore nel caricamento dei risultati')
        console.error('Error fetching results:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <div className="w-full bg-black py-8 px-4 md:px-8 mt-40 overflow-hidden">
        <motion.h2
          className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          Ultimi <span className="text-yellow-400">Risultati</span>
        </motion.h2>
        <div className="text-white text-center py-8">Caricamento risultati...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-black py-8 px-4 md:px-8 mt-40 overflow-hidden">
        <motion.h2
          className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          Ultimi <span className="text-yellow-400">Risultati</span>
        </motion.h2>
        <div className="text-red-400 text-center py-8">{error}</div>
      </div>
    )
  }

  // Dividiamo i risultati in due righe
  const firstRow = results.slice(0, 2)
  const secondRow = results.slice(2, 4)

  return (
    <div className="w-full bg-black py-8 px-4 md:px-8 sm:mt-10 md:mt-20 overflow-hidden">
      <motion.h2
        className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
        Ultimi <span className="text-yellow-400">Risultati</span>
      </motion.h2>

      {firstRow.length > 0 && (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-20">
          {firstRow.map((result, index) => (
            <motion.div
              className="max-w-lg flex-shrink-0"
              key={result.id}
              initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ResultsCard 
                date={new Date(result.match_date).toLocaleDateString('it-IT', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                location={result.location}
                homeTeam={result.home_team}
                awayTeam={result.away_team}
                homeScore={result.home_score}
                awayScore={result.away_score}
                category={result.category}
              />
            </motion.div>
          ))}
        </div>
      )}

      {secondRow.length > 0 && (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          {secondRow.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ResultsCard 
                date={new Date(result.match_date).toLocaleDateString('it-IT', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                location={result.location}
                homeTeam={result.home_team}
                awayTeam={result.away_team}
                homeScore={result.home_score}
                awayScore={result.away_score}
                category={result.category}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
