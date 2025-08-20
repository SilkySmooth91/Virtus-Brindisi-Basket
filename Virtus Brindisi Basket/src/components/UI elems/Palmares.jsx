import { motion } from "motion/react"
import InfoCard from "./InfoCard"

export default function Palmares() {
  return (
    <section className="py-8 px-4 md:px-8">
        <motion.div 
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <h2 className="p-title text-3xl font-bold text-white mb-6">
              I nostri trofei parlano del nostro 
              <span className="text-yellow-400"> impegno</span>
            </h2>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <InfoCard />
              <InfoCard />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
              <InfoCard />
              <InfoCard />
            </div>
        </motion.div>
    </section>
  )
}
