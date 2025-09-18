import Navbar from "../UI elems/Navbar"
import Hero from "../UI elems/Hero"
import Footer from "../UI elems/Footer"
import StaffCarousel from "../UI elems/StaffCarousel"
import chisiamoBg from '../../assets/chisiamoBG.jpg'
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
          overlayOpacity="bg-black/30"
        />
        
        {/* La nostra storia */}
        <section id="chi-siamo-content" className="w-full bg-black py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-white">
            <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }} 
            className="text-4xl md:text-6xl font-bold mb-8 text-center p-title">
              La Nostra <span className="text-yellow-400 p-title">Storia</span>
            </motion.h2>
            <motion.p
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl leading-relaxed mb-6">
              La Virtus Brindisi Basket nasce nel luglio del 2016 per svolgere un ruolo nell’ambito dell’attività giovanile in un territorio, Brindisi e la sua provincia, dove è fortemente radicata la passione per il basket. <br />
              <br />
              Si è voluto partire dalle basi, dai più piccoli, seguendo una linea di pensiero rivolta a riproporre la pallacanestro nella sua essenza originaria di “gioco”, quindi di divertimento, cercando di aiutare, in uno con la famiglia, a sviluppare la crescita dell’uomo che è insito in ogni bambino, prima che dell’atleta. <br />
              Questo ci ha spinto a perseguire lo sviluppo tecnico del giovane senza sottoporlo alla pressione del risultato ad ogni costo, favorendo la creazione intorno alla società di un clima di serena partecipazione anche da parte delle famiglie. <br />
              <br />
              Dopo anni di attività giovanile rivolta al mondo maschile, lo scorso anno la Virtus ha affrontato per la prima volta un campionato senior, per consentire la continuità tecnica ed agonistica a quei ragazzi che avevano esaurito il ciclo giovanile, ma soprattutto ha scelto di aprirsi anche al settore femminile per completare la propria offerta formativa. <br />
              I risultati di queste nuove iniziative sono stati di assoluto interesse sia tecnico che partecipativo, tanto da incoraggiarci a proseguire in questi nuovi percorsi. <br />
              L’impegno costante, la scelta di uno staff tecnico di comprovata esperienza con doti caratteriali in linea con la filosofia societaria, ha favorito la crescita costante della Virtus, oggi la terza realtà cestistica locale per numero di tesserati ed attività svolta. <br />
              <br />
              Ma il successo più gratificante è rappresentato oggi dall’affermarsi, nei discorsi, commenti e nell'immaginario generale degli appassionati di basket brindisi, dell’idea di “famiglia Virtus”.
            </motion.p>
          </div>
        </section>

        {/* Il nostro team */}
        <section className="w-full bg-black py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}  
            className="text-4xl md:text-6xl font-bold mb-12 text-center p-title text-white">
              Il Nostro <span className="text-yellow-400 p-title">Team</span>
            </motion.h2>
            
            <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}>
              <StaffCarousel />
            </motion.div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  )
}
