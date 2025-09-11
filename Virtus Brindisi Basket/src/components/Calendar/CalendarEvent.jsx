import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faHome, faPlane, faDumbbell, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

function formatTime(timeString) {
  if (!timeString) return ''
  return timeString.slice(0, 5)
}

export default function CalendarEvent({ event, idx, expandedEvent, handleEventClick, isMobile, isPublicView }) {
  const eventKey = `${event.type}-${event.id}`
  const isEventExpanded = expandedEvent === eventKey && isMobile
  return (
    <div
      onClick={e => handleEventClick(event, e)}
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
}
