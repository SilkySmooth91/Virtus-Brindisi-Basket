import { useState, useEffect } from 'react'
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

  const { scrollYProgress } = useScroll()

  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6],
    [-400, -200, -50, 0]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6],
    [0, 0.5, 0.8, 1]
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
    <section id='carousel-section' className="max-w-screen-2xl mx-auto py-8 bg-black">
      <div className="flex justify-center items-center text-center mb-8 h-40">
        <motion.h2 
        style={{ x, opacity }}
        initial={{ x: -400, opacity: 0 }}
        animate={{ x:0, opacity: 1 }}
        transition={{ 
        type: "spring",
        stiffness: 120,
        damping: 25,
        duration: 0.6
        }}
        className="p-title italic text-yellow-400 text-3xl md:text-4xl font-bold mb-4">
            #WeAreVirtusBrindisi
        </motion.h2>
      </div>

      {/* Carosello container */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden shadow-xl bg-gray-200">
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
      </div>

      {/* Indicatori (pallini) */}
      <div className="flex justify-center mt-6 space-x-2">
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
