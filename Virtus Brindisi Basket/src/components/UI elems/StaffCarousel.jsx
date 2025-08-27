import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import InfoCard from './InfoCard'
import { motion } from 'motion/react'
import { getActiveStaff } from '../../api/staff'

export default function StaffCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const carouselRef = useRef(null)
  
  // Carica i dati dello staff dal database
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getActiveStaff()
        setStaffMembers(data || [])
      } catch (err) {
        console.error('Error fetching staff:', err)
        setError('Errore nel caricamento dello staff')
        setStaffMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  // Determina il numero di card visibili in base alla dimensione dello schermo
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth
      if (width < 640) setCardsPerView(1)      // Mobile
      else if (width < 768) setCardsPerView(2) // Small tablet
      else if (width < 1024) setCardsPerView(3) // Tablet
      else setCardsPerView(4)                   // Desktop
    }
    
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])
  
  // Calcola il numero massimo di posizioni possibili
  const maxIndex = Math.max(0, staffMembers.length - cardsPerView)
  
  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex)
  }
  
  const goToNext = () => {
    setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0)
  }
  
  // Calcola la trasformazione per mostrare le card
  const translateX = -(currentIndex * (100 / cardsPerView))
  
  // Loading state
  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Caricamento staff...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Nessun membro dello staff trovato</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Container del carosello */}
      <div 
        ref={carouselRef}
        className="overflow-hidden relative"
      >
        <motion.div 
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${(staffMembers.length / cardsPerView) * 100}%`
          }}
        >
          {staffMembers.map((member, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / staffMembers.length}%` }}
            >
              <InfoCard className="h-full mx-2">
                <div className="p-6 text-center flex flex-col items-center">
                  {/* Foto rotonda */}
                  <div className="mb-4">
                    <img
                      src={member.photo}
                      alt={`${member.name} ${member.surname}`}
                      className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name + ' ' + member.surname)}&size=80&background=f59e0b&color=000&bold=true`
                      }}
                    />
                  </div>
                  
                  {/* Nome e cognome */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {member.name} {member.surname}
                  </h3>
                  
                  {/* Ruolo */}
                  <p className="text-gray-600 text-sm">
                    {member.role}
                  </p>
                </div>
              </InfoCard>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Pulsanti di navigazione - mostrati solo se ci sono più elementi di quelli visibili */}
      {staffMembers.length > cardsPerView && (
        <>
          {/* Pulsante Precedente */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-all duration-200 hover:scale-110 z-10 shadow-lg"
            aria-label="Membro precedente"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
          </button>
          
          {/* Pulsante Successivo */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-all duration-200 hover:scale-110 z-10 shadow-lg"
            aria-label="Membro successivo"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
          </button>
        </>
      )}
      
      {/* Indicatori (pallini) */}
      {staffMembers.length > cardsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Vai alla posizione ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
