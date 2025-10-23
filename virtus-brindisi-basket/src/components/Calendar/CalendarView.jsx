import CalendarDayCell from './CalendarDayCell'
import CalendarHeader from './CalendarHeader'
import CalendarLegend from './CalendarLegend'
import { useCalendarLogic } from './useCalendarLogic'
import { getDaysInMonth, getEventsForDate, isToday, isCurrentMonth, isSelected } from './calendarUtils'

export default function CalendarView({ 
  matches, 
  trainingSessions, 
  onEditMatch, 
  onEditTraining, 
  onCreateMatch, 
  onCreateTraining,
  isPublicView = false
}) {
  const {
    currentDate,
    selectedDate,
    expandedEvent,
    isMobile,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    handleEventClick,
    toggleDayExpansion,
    isDayExpanded,
    handleDaySelect
  } = useCalendarLogic(isPublicView, onEditMatch, onEditTraining)

  const days = getDaysInMonth(currentDate)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-visible mt-10">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        onCreateMatch={onCreateMatch}
        onCreateTraining={onCreateTraining}
        isPublicView={isPublicView}
      />
      
      {/* Tip per mobile */}
      {isMobile && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center text-blue-700">
            <div className="flex-shrink-0 mr-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">
              Tocca l'evento che ti interessa per espanderlo e visualizzare i dettagli
            </p>
          </div>
        </div>
      )}
      
      {/* Giorni della settimana */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">{day}</div>
        ))}
      </div>
      
      {/* Griglia del calendario */}
      <div className="grid grid-cols-7 overflow-visible relative" style={{ minHeight: '600px' }}>
        {days.map((day, index) => {
          const eventsObj = getEventsForDate(day, matches, trainingSessions)
          const events = eventsObj.allEvents
          const isExpanded = isDayExpanded(day)
          const visibleEvents = isExpanded ? events : events.slice(0, 2)
          const hiddenEventsCount = isExpanded ? 0 : Math.max(0, events.length - 2)
          
          return (
            <CalendarDayCell
              key={index}
              day={day}
              isCurrentMonth={isCurrentMonth(day, currentDate)}
              isToday={isToday(day)}
              isSelected={isSelected(day, selectedDate)}
              events={events}
              visibleEvents={visibleEvents}
              hiddenEventsCount={hiddenEventsCount}
              isExpanded={isExpanded}
              onSelect={() => handleDaySelect(day)}
              onToggleExpand={() => toggleDayExpansion(day)}
              expandedEvent={expandedEvent}
              handleEventClick={handleEventClick}
              isMobile={isMobile}
              isPublicView={isPublicView}
            />
          )
        })}
      </div>
      
      <CalendarLegend matches={matches} trainingSessions={trainingSessions} />
    </div>
  )
}
