import { motion } from "motion/react"
import InfoCard from "./InfoCard"

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
          <InfoCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <InfoCard />
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <InfoCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <InfoCard />
        </motion.div>
      </div>
    </div>
  )
}
