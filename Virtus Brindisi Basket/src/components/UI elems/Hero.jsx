import React from 'react'
import logo from '../../assets/logo-b-crop.png'
import heroImage from '../../assets/hero.jpg'
import styles from '../CSS Modules/Hero.module.css'

export default function Hero() {
  return (
    <section 
      className={`relative h-screen flex justify-center max-w-screen-2xl mx-auto ${styles.heroSection} ${styles.animateFadeIn}`}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay scuro per migliorare la leggibilità */}
      <div className={`absolute inset-0 bg-black/40 ${styles.animateFadeIn}`}></div>
      
      {/* Contenuto principale */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Logo" 
          className={`w-4/12 h-auto mx-auto mb-6 mt-14 ${styles.animateSlideUpDelay1}`}
        />
        
        {/* Titolo principale */}
        <h1 className={`text-4xl md:text-7xl font-bold mb-6 ${styles.heroTitle} ${styles.animateSlideUpDelay2}`}>
          <span className="text-yellow-400 mr-2">Virtus</span> 
          <span className="p-title text-white">Brindisi Basket</span>
        </h1>
        
        {/* Sottotitolo */}
        <p className={`p-title text-xl md:text-3xl mt-6 mb-8 max-w-3xl mx-auto ${styles.heroSubtitle} ${styles.animateSlideUpDelay3}`}>
          Aiutiamo, attraverso lo sport del basket, a formare l'uomo che è dentro ogni bambino, ogni ragazzo, ogni atleta.
        </p>
      </div>
    </section>
  )
}
