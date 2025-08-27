import Navbar from "../UI elems/Navbar"
import Hero from "../UI elems/Hero"
import Footer from "../UI elems/Footer"
import StaffCarousel from "../UI elems/StaffCarousel"
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
              La Virtus Brindisi Basket nasce dalla passione per lo sport del basket e dalla volontà di creare una comunità che formi non solo atleti, ma soprattutto persone. <br />
              <br />
              Attraverso i nostri programmi di allenamento e le nostre attività, miriamo a sviluppare le potenzialità di ogni atleta, dai più piccoli ai più esperti.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed dolor possimus consectetur? Laborum aliquid provident, odio maxime, laudantium iure odit eaque alias, repudiandae delectus reprehenderit qui enim consequuntur? Hic, ducimus.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugiat repellat optio unde reiciendis accusantium aperiam ullam quasi modi ducimus, maiores nulla, nemo deserunt voluptatum velit sint adipisci non vel. <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores sunt nulla obcaecati minima officia? Commodi, labore quasi, omnis veritatis culpa corporis sed dolore dicta minus, voluptas vero sunt! Quod, quae!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque fugiat repudiandae est nostrum fuga unde, obcaecati necessitatibus eveniet rem? Sapiente provident tempora quaerat amet facere quis inventore quam adipisci unde.
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
