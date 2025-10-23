import React from 'react'
import defaultLogo from '../../assets/logo-b-crop.png'
import defaultHeroImage from '../../assets/hero.jpg'
import styles from '../CSS Modules/Hero.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { animateScroll as scroll } from 'react-scroll'

export default function Hero({ 
  backgroundImage = defaultHeroImage,
  logo = defaultLogo,
  logoAlt = "Logo",
  title,
  titleHighlight,
  subtitle,
  showScrollButton = true,
  scrollTarget = 'carousel-section',
  overlayOpacity = 'bg-black/40',
  customContent
}) {
  const scrollToNextSection = () => {
    if (scrollTarget) {
      const targetSection = document.getElementById(scrollTarget)
      if (targetSection) {
        scroll.scrollTo(targetSection.offsetTop, {
          duration: 1300,
          smooth: 'easeInOutQuint'
        })
      }
    }
  }

  return (
    <section 
      className={`relative h-screen flex justify-center w-full mx-auto ${styles.heroSection} ${styles.animateFadeIn}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}>

      {/* Overlay scuro */}
      <div className={`absolute inset-0 ${overlayOpacity} ${styles.animateFadeIn}`}></div>
      
      {/* Contenuto principale */}
      <div className="relative z-10 text-center text-white px-4">
        {customContent ? (
          customContent
        ) : (
          <>
            {/* Logo - mostra solo se fornito */}
            {logo && (
              <img 
                src={logo} 
                alt={logoAlt} 
                className={`w-4/12 h-auto mx-auto mb-6 mt-14 ${styles.animateSlideUpDelay1}`}
              />
            )}
            
            {/* Titolo principale */}
            {(title || titleHighlight) && (
              <h1 className={`text-4xl md:text-7xl font-bold mb-6 ${styles.heroTitle} ${styles.animateSlideUpDelay2}`}>
                {title && <span className="text-white mr-2">{title}</span>}
                {titleHighlight && <span className="p-title text-yellow-400">{titleHighlight}</span>}
              </h1>
            )}
            
            {/* Sottotitolo */}
            {subtitle && (
              <p className={`p-title text-xl md:text-3xl mt-6 mb-8 max-w-3xl mx-auto ${styles.heroSubtitle} ${styles.animateSlideUpDelay3}`}>
                {subtitle}
              </p>
            )}

            {/* Scroll down */}
            {showScrollButton && scrollTarget && (
              <button 
                className='mt-8 text-yellow-400 text-5xl animate-bounce'
                onClick={scrollToNextSection}
                aria-label="Scroll down to next section">
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            )}
          </>
        )}
      </div>

    </section>
  )
}
