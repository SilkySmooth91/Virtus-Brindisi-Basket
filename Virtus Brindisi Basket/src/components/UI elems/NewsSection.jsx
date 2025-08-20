import { useEffect } from "react";
import InfoCard from "./InfoCard"
import MainButton from "./MainButton"
import { motion, useAnimation } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function NewsSection() {
  const controls = useAnimation();

  useEffect(() => {
    const startAnimations = async () => {
      await controls.start({ opacity: 1, x: 0 });
    }

    startAnimations()
  }, [controls]);

  return (
    <div className="w-full bg-black py-8 px-4 md:px-8 md:min-h-screen overflow-hidden">
      <motion.h2 
      className="text-5xl md:text-7xl font-bold uppercase text-white mb-6"
      initial={{ opacity: 0, x: 100}}
      whileInView={{ opacity: 1, x: 0}}
      transition={{duration: 0.6}}
      viewport={{ once: true }}>
        Ultime <span className="text-yellow-400">News</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center gap-6  md:min-h-[96] lg:h-[calc(100vh-200px)]">
          <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
            <InfoCard />
          </motion.div>
          <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
            <InfoCard />
          </motion.div>
      </div>

      <motion.div 
      className="flex justify-center mt-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}>
        <MainButton>
          Vai alle notizie
          <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
        </MainButton>
      </motion.div>
    </div>
  )
}
