import { motion } from "motion/react"
import InfoCard from "./InfoCard"
import MainButton from "./MainButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"

export default function CallToAction() {
  return (
    <section className="flex justify-center items-center py-8 px-4 md:px-8">
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
            <InfoCard className="flex-col justify-center items-center text-center">
                <h2 className="p-title text-2xl font-bold mb-4">
                    Entra a far parte della famiglia Virtus
                </h2>
                <p className="mb-6">
                    Ogni trofeo racconta una storia di impegno, dedizione e spirito di squadra. Ma il nostro più grande successo resta la crescita umana e sportiva dei nostri atleti.
                </p>
                <MainButton>
                    Unisciti a noi
                    <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
                </MainButton>
            </InfoCard>
        </motion.div>
    </section>
  )
}
