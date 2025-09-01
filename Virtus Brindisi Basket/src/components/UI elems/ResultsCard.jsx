import InfoCard from "./InfoCard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faLocationDot, faTrophy, faUserGroup } from '@fortawesome/free-solid-svg-icons'

export default function ResultsCard({ 
  date = "12 Marzo 2023",
  location = "PalaMelfi, Brindisi",
  homeTeam = "Virtus Brindisi",
  awayTeam = "Squadra Avversaria",
  homeScore = 85,
  awayScore = 78,
  category = "Serie A"
}) {
  // Determina quale squadra ha vinto
  const homeWins = homeScore > awayScore
  const awayWins = awayScore > homeScore

  // Determina se la Virtus ha vinto (sia in casa che in trasferta)
  const virtusWins = (homeTeam.toLowerCase().includes('virtus brindisi') && homeWins) || 
                     (awayTeam.toLowerCase().includes('virtus brindisi') && awayWins)

  // Classi per il punteggio vincente (giallo) e perdente (nero)
  const winnerScoreClass = "text-yellow-500 font-bold"
  const loserScoreClass = "text-black font-bold"

  return (
    <InfoCard className="lg:min-w-lg px-6 py-8">
      <div className="space-y-3 w-full">
        <div className="flex gap-4 justify-center">
            {/* Data */}
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400 text-xs" />
              <p className="text-gray-500 text-sm">{date}</p>
            </div>
            
            {/* Luogo */}
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-xs" />
              <p className="text-gray-500 text-sm">{location}</p>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faUserGroup} className="text-gray-400 text-xs" />
              <p className="text-gray-500 text-sm">{category}</p>
            </div>
        </div>
        
        {/* Risultato della partita */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-800">{homeTeam}</p>
          </div>
          
          <div className="flex-shrink-0 text-center px-2">
            <div className="flex items-center space-x-2">
              <span 
                className={`text-xl ${homeWins ? winnerScoreClass : loserScoreClass}`}
              >
                {homeScore}
              </span>
              <span className="text-gray-400 text-sm">-</span>
              <span 
                className={`text-xl ${awayWins ? winnerScoreClass : loserScoreClass}`}
              >
                {awayScore}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 text-right">
            <p className="text-base font-semibold text-gray-800">{awayTeam}</p>
          </div>
        </div>
        
        {/* Indicatore risultato */}
        <div className="text-center mt-2">
          {virtusWins && (
            <div className="flex items-center justify-center gap-1">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
              <span className="text-yellow-500 font-semibold">Vittoria Virtus!</span>
            </div>
          )}
        </div>
      </div>
    </InfoCard>
  )
}
