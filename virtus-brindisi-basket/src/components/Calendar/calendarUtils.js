// Utility functions per il calendario

export const getDaysInMonth = (currentDate) => {
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

export const getEventsForDate = (date, matches, trainingSessions) => {
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

export const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isCurrentMonth = (date, currentDate) => {
  return date.getMonth() === currentDate.getMonth()
}

export const isSelected = (date, selectedDate) => {
  return selectedDate && date.toDateString() === selectedDate.toDateString()
}

export const createDateKey = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
