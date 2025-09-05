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

export default function CalendarView({ 
  matches, 
  trainingSessions, 
  onEditMatch, 
  onEditTraining, 
  onCreateMatch, 
  onCreateTraining,
  isPublicView = false // Nuovo prop per indicare se è una vista pubblica
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [expandedDays, setExpandedDays] = useState(new Set()) // Track quali giorni sono espansi
  const [expandedEvent, setExpandedEvent] = useState(null) // Track evento espanso su mobile
  const [isMobile, setIsMobile] = useState(false) // Check se siamo su mobile
  
  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024) // tablet e smartphone
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Click outside handler per chiudere l'evento espanso
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo se c'è un evento espanso e non si è cliccato sull'evento stesso
      if (expandedEvent && !event.target.closest('.expanded-event') && !event.target.closest('.calendar-event')) {
        setExpandedEvent(null)
      }
    }

    if (expandedEvent && isMobile) {
      // Delay per evitare che si chiuda immediatamente dopo l'apertura
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [expandedEvent, isMobile])
  
  // Navigazione mesi
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setExpandedDays(new Set()) // Reset expanded days when changing month
    setExpandedEvent(null) // Reset expanded event
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setExpandedDays(new Set()) // Reset expanded days when changing month
    setExpandedEvent(null) // Reset expanded event
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
    setExpandedDays(new Set()) // Reset expanded days when navigating
    setExpandedEvent(null) // Reset expanded event
  }

  // Funzione per gestire il click su un evento (mobile only)
  const handleEventClick = (event, e) => {
    if (e) e.stopPropagation()
    
    if (isMobile && isPublicView) {
      // Su mobile nella vista pubblica, espandi l'evento invece di modificarlo
      const eventKey = `${event.type}-${event.id}`
      setExpandedEvent(expandedEvent === eventKey ? null : eventKey)
    } else if (!isPublicView) {
      // Comportamento normale per admin
      if (event.type === 'match') {
        onEditMatch(event)
      } else {
        onEditTraining(event)
      }
    }
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
    <div className="bg-white rounded-lg shadow-lg overflow-visible mt-10">
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
            
            {!isPublicView && (
              <>
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
              </>
            )}
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
      <div className="grid grid-cols-7 overflow-visible relative" style={{ minHeight: '600px' }}>
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
              className={`border-r border-b last-in-row:border-r-0 p-2 cursor-pointer transition-all duration-200 overflow-visible relative ${
                !isCurrentMonth(day) ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isToday(day) ? 'bg-yellow-50' : ''} ${
                isSelected(day) ? 'bg-blue-50' : ''
              } hover:bg-gray-50 ${
                isExpanded ? 'min-h-32' : 'min-h-24'
              }`}
              style={{ 
                minHeight: isExpanded ? `${Math.max(128, 80 + (visibleEvents.length * 28))}px` : '96px'
              }}
              onClick={() => {
                setSelectedDate(selectedDate?.toDateString() === day.toDateString() ? null : day)
                // Reset expanded event quando si clicca su una nuova cella
                if (expandedEvent) setExpandedEvent(null)
              }}
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
                {visibleEvents.map((event, idx) => {
                  const eventKey = `${event.type}-${event.id}`
                  const isEventExpanded = expandedEvent === eventKey && isMobile
                  
                  return (
                    <div
                      key={eventKey}
                      onClick={(e) => handleEventClick(event, e)}
                      className={`calendar-event text-xs p-1 rounded transition-all duration-200 relative ${
                        isPublicView ? (isMobile ? 'cursor-pointer' : 'cursor-default') : 'cursor-pointer'
                      } ${
                        event.is_cancelled 
                          ? 'bg-red-100 text-red-600 opacity-60' 
                          : event.type === 'match' 
                            ? event.is_home_match 
                              ? `bg-green-100 text-green-700 ${!isPublicView || isMobile ? 'hover:bg-green-200' : ''}` 
                              : `bg-yellow-100 text-yellow-700 ${!isPublicView || isMobile ? 'hover:bg-yellow-200' : ''}`
                            : `bg-blue-100 text-blue-700 ${!isPublicView || isMobile ? 'hover:bg-blue-200' : ''}`
                      } ${isEventExpanded ? 'expanded-event z-10 shadow-lg border border-gray-300' : ''}`}
                      style={isEventExpanded ? {
                        position: 'absolute',
                        top: `${idx * 32}px`,
                        left: '-4px',
                        right: '-4px',
                        zIndex: 10,
                        minHeight: 'auto',
                        maxWidth: '200px',
                        width: '200px'
                      } : {}}
                      title={!isMobile ? (event.type === 'match' 
                        ? `${event.opponent_team || 'TBD'} ${event.time ? `- ${formatTime(event.time)}` : ''}` 
                        : `Allenamento ${event.team_category || ''} ${event.time ? `- ${formatTime(event.time)}` : ''}`) 
                        : undefined
                      }
                    >
                      {!isEventExpanded ? (
                        // Vista normale
                        <>
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
                        </>
                      ) : (
                        // Vista espansa (mobile only) - STESSO COLORE, PIÙ INFO
                        <div className="p-2 space-y-1">
                          <div className="flex items-center">
                            <FontAwesomeIcon 
                              icon={event.is_cancelled 
                                ? faBan 
                                : event.type === 'match' 
                                  ? (event.is_home_match ? faHome : faPlane) 
                                  : faDumbbell
                              } 
                              className="w-3 h-3 mr-2 flex-shrink-0" 
                            />
                            <span className="font-bold text-sm">
                              {event.type === 'match' 
                                ? (event.opponent_team || 'TBD')
                                : (event.team_category || 'Allenamento')
                              }
                              {event.is_cancelled && ' (ANNULLATO)'}
                            </span>
                          </div>
                          
                          {event.time && (
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-2" />
                              <span className="text-sm font-medium">Ore {formatTime(event.time)}</span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 mr-2" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                          
                          {event.type === 'match' && (
                            <div className="text-xs mt-1 opacity-80">
                              {event.is_home_match ? '🏠 Casa' : '✈️ Trasferta'}
                            </div>
                          )}
                          
                          <div className="text-xs opacity-60 mt-2 text-center">
                            Tap fuori per chiudere
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

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
          {matches && matches.length > 0 && (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                <span>Partita Casa</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
                <span>Partita Trasferta</span>
              </div>
            </>
          )}
          {trainingSessions && trainingSessions.length > 0 && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
              <span>Allenamento</span>
            </div>
          )}
          {(matches && matches.length > 0) || (trainingSessions && trainingSessions.length > 0) ? (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
              <span>Annullato</span>
            </div>
          ) : null}
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
