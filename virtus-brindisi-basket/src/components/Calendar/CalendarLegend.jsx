export default function CalendarLegend({ matches, trainingSessions }) {
  const hasMatches = matches && matches.length > 0
  const hasTrainings = trainingSessions && trainingSessions.length > 0
  
  if (!hasMatches && !hasTrainings) return null

  return (
    <div className="bg-gray-50 p-4 border-t">
      <div className="flex items-center justify-center space-x-6 text-xs">
        {hasMatches && (
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
        {hasTrainings && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span>Allenamento</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
          <span>Annullato</span>
        </div>
      </div>
    </div>
  )
}
