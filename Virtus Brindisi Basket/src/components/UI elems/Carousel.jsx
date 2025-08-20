import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../CSS Modules/Carousel.module.css'
import { motion, useScroll, useTransform } from 'motion/react'

export default function Carousel() {
  // Array di immagini placeholder (sostituirai con le tue immagini)
  const images = [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80',
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=80'
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => {
    // Inizializza correttamente basandosi sulla window size attuale
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false // Fallback per SSR
  })
  
  // Ref per il target dell'animazione Motion
  const carouselRef = useRef(null)

  // Hook per detectare se siamo su mobile (< 768px)
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // useScroll con ref specifico per il carousel
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start end", "end start"]
  })

  // Animazioni Motion solo su desktop (>= 768px)
  // Valori aggiustati per completare l'animazione quando il carousel è al centro del viewport
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5],
    isMobile ? [0, 0, 0, 0] : [-200, -100, -25, 0]
  )

  const reverseX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5],
    isMobile ? [0, 0, 0, 0] : [200, 100, 25, 0]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5],
    isMobile ? [1, 1, 1, 1] : [0, 0.4, 0.8, 1]
  )

  // Auto-scroll ogni 5 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  // Funzioni di navigazione
  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section ref={carouselRef} id='carousel-section' className="w-full h-screen bg-black relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-2 h-full max-w-full mx-auto px-4">
        
        {/* H2 - Sopra su mobile, a sinistra su desktop */}
        <div className="flex-1 flex justify-center items-center w-full lg:w-auto overflow-hidden">
          <motion.h2 
            style={isMobile ? {} : { x, opacity }}
            initial={isMobile ? {} : { x: -200, opacity: 0 }}
            animate={isMobile ? {} : { x: 0, opacity: 1 }}
            transition={isMobile ? {} : { 
              type: "spring",
              stiffness: 120,
              damping: 25,
              duration: 1
            }}
            className="flex flex-row items-center text-yellow-400 font-bold text-center lg:text-left">
              <div className={`${styles.giantHashtag} italic text-center mb-2 lg:mb-0 lg:mr-4 text-2xl md:text-4xl lg:text-6xl xl:text-8xl 2xl:text-9xl`}>
                #
              </div>
              <div className={`${styles.weAre} text-9xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl uppercase text-white`}>
                WeAre <br /><span className='text-yellow-400'>Virtus</span> <br />Brindisi <br />Basket
              </div>
          </motion.h2>
        </div>

        {/* Carosello - Sotto su mobile, a destra su desktop */}
        <motion.div 
        className="flex-1 relative h-1/2 lg:h-full w-full overflow-hidden shadow-xl bg-gray-200"
        style={isMobile ? {} : { x: reverseX, opacity }}
        initial={isMobile ? {} : { x: 200, opacity: 0 }}
        animate={isMobile ? {} : { x: 0, opacity: 1 }}
        transition={isMobile ? {} : { 
          type: "spring",
          stiffness: 120,
          damping: 25,
          duration: 1
        }}>
        {/* Immagini */}
        <div 
          className={`${styles.imageContainer}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>

        {/* Pulsante Precedente */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-yellow-400 p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
          aria-label="Immagine precedente">
          <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
        </button>

        {/* Pulsante Successivo */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
          aria-label="Immagine successiva">
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </button>

        {/* Dissolvenza bordo superiore */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '80px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 15
          }}>
        </div>

        {/* Dissolvenza bordo inferiore */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '80px',
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 15
          }}>
        </div>

        {/* Overlay gradiente per migliorare visibilità dei controlli */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-10"></div>
        </motion.div>
      </div>

      {/* Indicatori (pallini) - Posizionati dentro la sezione nera */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-yellow-400 scale-125'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Vai alla slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  )
}
