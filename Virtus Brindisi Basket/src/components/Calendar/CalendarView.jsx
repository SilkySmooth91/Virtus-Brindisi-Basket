import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronLeft, 
  faChevronRight,
  faCalendarCheck,
  faDumbbell,
  faPlus,
  faHome,
  faPlane,
  faClock,
  faMapMarkerAlt,
  faBan
} from '@fortawesome/free-solid-svg-icons'

export default function CalendarView({ matches, trainingSessions, onEditMatch, onEditTraining, onCreateMatch, onCreateTraining }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [expandedDays, setExpandedDays] = useState(new Set()) // Track quali giorni sono espansi
  
  // Navigazione mesi
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setExpandedDays(new Set()) // Reset expanded days when changing month
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setExpandedDays(new Set()) // Reset expanded days when changing month
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
    setExpandedDays(new Set()) // Reset expanded days when navigating
  }

  // Funzione per toggle espansione di un giorno
  const toggleDayExpansion = (date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const newExpandedDays = new Set(expandedDays)
    
    if (newExpandedDays.has(dateKey)) {
      newExpandedDays.delete(dateKey)
    } else {
      newExpandedDays.add(dateKey)
    }
    
    setExpandedDays(newExpandedDays)
  }

  // Controlla se un giorno è espanso
  const isDayExpanded = (date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return expandedDays.has(dateKey)
  }

  // Utility functions
  const formatMonth = (date) => {
    return date.toLocaleDateString('it-IT', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.slice(0, 5)
  }

  // Genera i giorni del calendario
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)
    
    // Inizia dal lunedì della settimana che contiene il primo giorno
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7))
    
    // Finisce alla domenica della settimana che contiene l'ultimo giorno
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7)
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  // Ottieni eventi per una specifica data
  const getEventsForDate = (date) => {
    // Usa un formato diretto per evitare problemi di fuso orario
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    
    const dayMatches = matches.filter(match => match.date === dateString)
    const dayTrainings = trainingSessions.filter(training => training.date === dateString)
    
    // Combina e ordina tutti gli eventi per orario
    const allEvents = [
      ...dayMatches.map(match => ({ ...match, type: 'match' })),
      ...dayTrainings.map(training => ({ ...training, type: 'training' }))
    ].sort((a, b) => {
      // Ordina per orario, se presente, altrimenti per tipo (partite prima)
      if (a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      if (a.time && !b.time) return -1
      if (!a.time && b.time) return 1
      return a.type === 'match' ? -1 : 1
    })
    
    return { 
      matches: dayMatches, 
      trainings: dayTrainings,
      allEvents: allEvents
    }
  }

  // Controlla se una data è oggi
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Controlla se una data è nel mese corrente
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // Controlla se una data è selezionata
  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth()
  const today = new Date()

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-10">
      {/* Header del calendario */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            
            <h2 className="text-xl font-bold capitalize">
              {formatMonth(currentDate)}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-medium hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              Oggi
            </button>
            
            <button
              onClick={onCreateMatch}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-1" />
              Partita
            </button>
            
            <button
              onClick={onCreateTraining}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-1" />
              Allenamento
            </button>
          </div>
        </div>
      </div>

      {/* Giorni della settimana */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Griglia del calendario */}
      <div className="grid grid-cols-7" style={{ minHeight: '600px' }}>
        {days.map((day, index) => {
          const events = getEventsForDate(day)
          const hasEvents = events.allEvents.length > 0
          const totalEvents = events.allEvents.length
          const isExpanded = isDayExpanded(day)
          const visibleEvents = isExpanded ? events.allEvents : events.allEvents.slice(0, 2)
          const hiddenEventsCount = isExpanded ? 0 : Math.max(0, totalEvents - 2)
          
          return (
            <div
              key={index}
              className={`border-r border-b last-in-row:border-r-0 p-2 cursor-pointer transition-all duration-200 ${
                !isCurrentMonth(day) ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isToday(day) ? 'bg-yellow-50' : ''} ${
                isSelected(day) ? 'bg-blue-50' : ''
              } hover:bg-gray-50 ${
                isExpanded ? 'min-h-32' : 'min-h-24'
              }`}
              style={{ 
                minHeight: isExpanded ? `${Math.max(128, 80 + (visibleEvents.length * 28))}px` : '96px'
              }}
              onClick={() => setSelectedDate(selectedDate?.toDateString() === day.toDateString() ? null : day)}
            >
              {/* Numero del giorno */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday(day) ? 'bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs' 
                  : !isCurrentMonth(day) ? 'text-gray-400' 
                  : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </span>
                
                {hasEvents && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {totalEvents > 1 && (
                      <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {totalEvents}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Eventi del giorno */}
              <div className="space-y-1">
                {/* Eventi visibili */}
                {visibleEvents.map((event, idx) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (event.type === 'match') {
                        onEditMatch(event)
                      } else {
                        onEditTraining(event)
                      }
                    }}
                    className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                      event.is_cancelled 
                        ? 'bg-red-100 text-red-600 opacity-60' 
                        : event.type === 'match' 
                          ? event.is_home_match 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    title={event.type === 'match' 
                      ? `${event.opponent_team || 'TBD'} ${event.time ? `- ${formatTime(event.time)}` : ''}` 
                      : `Allenamento ${event.team_category || ''} ${event.time ? `- ${formatTime(event.time)}` : ''}`
                    }
                  >
                    <div className="flex items-center truncate">
                      <FontAwesomeIcon 
                        icon={event.is_cancelled 
                          ? faBan 
                          : event.type === 'match' 
                            ? (event.is_home_match ? faHome : faPlane) 
                            : faDumbbell
                        } 
                        className="w-2 h-2 mr-1 flex-shrink-0" 
                      />
                      <span className="truncate">
                        {event.type === 'match' 
                          ? (event.opponent_team || 'TBD')
                          : (event.team_category || 'Allenamento')
                        }
                      </span>
                    </div>
                    {event.time && (
                      <div className="flex items-center mt-0.5">
                        <FontAwesomeIcon icon={faClock} className="w-2 h-2 mr-1" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Badge per eventi aggiuntivi - Cliccabile */}
                {hiddenEventsCount > 0 && (
                  <div className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDayExpansion(day)
                      }}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      +{hiddenEventsCount} altr{hiddenEventsCount === 1 ? 'o' : 'i'}
                    </button>
                  </div>
                )}

                {/* Pulsante per comprimere quando espanso */}
                {isExpanded && totalEvents > 2 && (
                  <div className="text-center mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDayExpansion(day)
                      }}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      Comprimi ▲
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
            <span>Partita Casa</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
            <span>Partita Trasferta</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span>Allenamento</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
            <span>Annullato</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// CSS personalizzato per nascondere il bordo destro dell'ultima colonna
const styles = `
  .last-in-row:nth-child(7n) {
    border-right: none !important;
  }
`
