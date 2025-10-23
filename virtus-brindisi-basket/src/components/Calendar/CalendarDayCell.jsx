import CalendarEvent from './CalendarEvent'

export default function CalendarDayCell({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  visibleEvents,
  hiddenEventsCount,
  isExpanded,
  onSelect,
  onToggleExpand,
  expandedEvent,
  handleEventClick,
  isMobile,
  isPublicView
}) {
  return (
    <div
      className={`border-r border-b last-in-row:border-r-0 p-2 cursor-pointer transition-all duration-200 overflow-visible relative ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
      } ${isToday ? 'bg-yellow-50' : ''} ${
        isSelected ? 'bg-blue-50' : ''
      } hover:bg-gray-50 ${
        isExpanded ? 'min-h-32' : 'min-h-24'
      }`}
      style={{ 
        minHeight: isExpanded ? `${Math.max(128, 80 + (visibleEvents.length * 28))}px` : '96px'
      }}
      onClick={onSelect}
    >
      {/* Numero del giorno */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${
          isToday ? 'bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs' 
          : !isCurrentMonth ? 'text-gray-400' 
          : 'text-gray-900'
        }`}>
          {day.getDate()}
        </span>
        {events.length > 0 && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {events.length > 1 && (
              <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {events.length}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Eventi del giorno */}
      <div className="space-y-1">
        {visibleEvents.map((event, idx) => (
          <CalendarEvent
            key={`${event.type}-${event.id}`}
            event={event}
            idx={idx}
            expandedEvent={expandedEvent}
            handleEventClick={handleEventClick}
            isMobile={isMobile}
            isPublicView={isPublicView}
          />
        ))}
        {hiddenEventsCount > 0 && (
          <div className="text-center">
            <button
              onClick={e => { e.stopPropagation(); onToggleExpand(); }}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              +{hiddenEventsCount} altr{hiddenEventsCount === 1 ? 'o' : 'i'}
            </button>
          </div>
        )}
        {isExpanded && events.length > 2 && (
          <div className="text-center mt-1">
            <button
              onClick={e => { e.stopPropagation(); onToggleExpand(); }}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition-colors cursor-pointer"
            >
              Comprimi ▲
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
