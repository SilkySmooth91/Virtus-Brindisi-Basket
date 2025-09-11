import { useState, useEffect } from 'react'
import { createDateKey } from './calendarUtils'

export function useCalendarLogic(isPublicView, onEditMatch, onEditTraining) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [expandedDays, setExpandedDays] = useState(new Set())
  const [expandedEvent, setExpandedEvent] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Click outside handler per chiudere l'evento espanso
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedEvent && !event.target.closest('.expanded-event') && !event.target.closest('.calendar-event')) {
        setExpandedEvent(null)
      }
    }

    if (expandedEvent && isMobile) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [expandedEvent, isMobile])

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setExpandedDays(new Set())
    setExpandedEvent(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setExpandedDays(new Set())
    setExpandedEvent(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
    setExpandedDays(new Set())
    setExpandedEvent(null)
  }

  const handleEventClick = (event, e) => {
    if (e) e.stopPropagation()
    if (isMobile && isPublicView) {
      const eventKey = `${event.type}-${event.id}`
      setExpandedEvent(expandedEvent === eventKey ? null : eventKey)
    } else if (!isPublicView) {
      if (event.type === 'match') onEditMatch(event)
      else onEditTraining(event)
    }
  }

  const toggleDayExpansion = (date) => {
    const dateKey = createDateKey(date)
    const newExpandedDays = new Set(expandedDays)
    
    if (newExpandedDays.has(dateKey)) {
      newExpandedDays.delete(dateKey)
    } else {
      newExpandedDays.add(dateKey)
    }
    
    setExpandedDays(newExpandedDays)
  }

  const isDayExpanded = (date) => {
    const dateKey = createDateKey(date)
    return expandedDays.has(dateKey)
  }

  const handleDaySelect = (day) => {
    setSelectedDate(selectedDate?.toDateString() === day.toDateString() ? null : day)
    if (expandedEvent) setExpandedEvent(null)
  }

  return {
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
  }
}
