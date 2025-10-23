import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onCreateMatch,
  onCreateTraining,
  isPublicView
}) {
  const formatMonth = (date) => {
    return date.toLocaleDateString('it-IT', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="bg-black text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPreviousMonth}
            className="p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold capitalize">{formatMonth(currentDate)}</h2>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-700 rounded transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onToday}
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
  )
}
