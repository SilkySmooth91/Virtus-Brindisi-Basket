import { motion } from "motion/react"
import ResultsCard from "./ResultsCard"

export default function Results() {
  return (
    <div className="w-full bg-black py-8 px-4 md:px-8 mt-40 overflow-hidden">
      <motion.h2
        className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
        Ultimi <span className="text-yellow-400">Risultati</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ResultsCard 
            date="15 Marzo 2024"
            location="PalaMelfi, Brindisi"
            homeTeam="Virtus Brindisi"
            awayTeam="Taranto Basket"
            homeScore={92}
            awayScore={88}
            category="Serie B"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ResultsCard 
            date="22 Marzo 2024"
            location="PalaQuaresima, Taranto"
            homeTeam="Monopoli Basket"
            awayTeam="Virtus Brindisi"
            homeScore={78}
            awayScore={85}
            category="Under 21"
          />
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ResultsCard 
            date="8 Marzo 2024"
            location="PalaMelfi, Brindisi"
            homeTeam="Virtus Brindisi"
            awayTeam="Bari Basket"
            homeScore={95}
            awayScore={72}
            category="Serie A2"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ResultsCard 
            date="1 Marzo 2024"
            location="PalaSport, Lecce"
            homeTeam="Lecce Basket"
            awayTeam="Virtus Brindisi"
            homeScore={81}
            awayScore={89}
            category="Under 18"
          />
        </motion.div>
      </div>
    </div>
  )
}
