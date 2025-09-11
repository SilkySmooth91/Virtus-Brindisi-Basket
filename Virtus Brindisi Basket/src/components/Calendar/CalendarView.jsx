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
