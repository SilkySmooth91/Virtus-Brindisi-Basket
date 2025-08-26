import Navbar from "../UI elems/Navbar"
import Hero from "../UI elems/Hero"
import Footer from "../UI elems/Footer"
import chisiamoBg from '../../assets/hero.jpg' // Sostituisci con la tua immagine per Chi Siamo
import { motion } from "motion/react"

export default function ChiSiamo() {
  return (
    <>
      <Navbar />
      <div className="w-full max-w-screen overflow-x-hidden">
        <Hero 
          backgroundImage={chisiamoBg}
          title="Chi"
          titleHighlight="Siamo"
          subtitle="Scopri la storia, i valori e la passione che guidano la nostra società sportiva."
          showScrollButton={true}
          scrollTarget="chi-siamo-content"
          overlayOpacity="bg-black/50"
        />
        
        {/* Contenuto della pagina Chi Siamo */}
        <section id="chi-siamo-content" className="w-full bg-black py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-white">
            <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }} 
            className="text-4xl md:text-6xl font-bold mb-8 text-center">
              La Nostra <span className="text-yellow-400">Storia</span>
            </motion.h2>
            <motion.p
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl leading-relaxed mb-6">
              Il Virtus Brindisi Basket nasce dalla passione per lo sport del basket e dalla volontà di creare una comunità che formi non solo atleti, ma soprattutto persone. <br />
              <br />
              Attraverso i nostri programmi di allenamento e le nostre attività, miriamo a sviluppare le potenzialità di ogni atleta, dai più piccoli ai più esperti.
            </motion.p>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  )
}
