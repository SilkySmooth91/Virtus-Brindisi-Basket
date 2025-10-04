import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faDirections
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { motion } from 'motion/react'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'
import MainButton from '../UI elems/MainButton'

export default function ContactsPage() {
  const contactInfo = {
    address: {
      street: "Via Lanzellotti, 45",
      city: "72100 Brindisi (BR)",
      region: "Puglia, Italia"
    },
    phone: "+39 338 4270033",
    email: "virtus.brindisibasket@gmail.com",
    socialMedia: {
      instagram: "https://www.instagram.com/virtusbrindisibasket",
      facebook: "https://www.facebook.com/virtusbrindisibasket", 
      youtube: "https://www.youtube.com/@virtusbrindisibasket1087"
    }
  }

  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}`
  }

  const handlePhoneClick = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  const handleDirectionsClick = () => {
    const address = encodeURIComponent(`${contactInfo.address.street}, ${contactInfo.address.city}`)
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-yellow-400" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl uppercase font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I Nostri <span className="text-yellow-400">Contatti</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Entra in contatto con la Virtus Brindisi Basket. Siamo qui per rispondere a tutte le tue domande
            </motion.p>
          </motion.div>

          {/* Sezioni Contatti */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Informazioni Generali */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sede e Palestra</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{contactInfo.address.street}</p>
                  <p className="text-gray-600">{contactInfo.address.city}</p>
                  <p className="text-gray-600">{contactInfo.address.region}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <MainButton 
                    onClick={handleDirectionsClick}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <FontAwesomeIcon icon={faDirections} className="mr-2" />
                    Ottieni Indicazioni
                  </MainButton>
                </div>
              </div>
            </motion.div>

            {/* Contatti Diretti */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <FontAwesomeIcon icon={faPhone} className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contatti Diretti</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Telefono</p>
                  <button
                    onClick={handlePhoneClick}
                    className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    {contactInfo.phone}
                  </button>
                </div>
                
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">Email</p>
                  <button
                    onClick={handleEmailClick}
                    className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors break-all"
                  >
                    {contactInfo.email}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Orari di Apertura */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400 md:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <FontAwesomeIcon icon={faClock} className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Orari di Apertura</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lunedì</span>
                  <span className="font-semibold text-gray-900">17:30 - 19:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mercoledì</span>
                  <span className="font-semibold text-gray-900">17:30 - 19:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Venerdì</span>
                  <span className="font-semibold text-gray-900">17:30 - 19:30</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Orari di apertura Centro Minibasket. <br />
                  Per informazioni su iscrizioni, corsi e attività inerenti ad altre formazioni, contattaci direttamente.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Informazioni Aggiuntive */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Social Media */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Seguici sui Social</h3>
              
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Resta aggiornato su tutte le novità, risultati e contenuti esclusivi della squadra.
                </p>
                
                <div className="flex justify-center space-x-6">
                  <a 
                    href={contactInfo.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FontAwesomeIcon icon={faInstagram} className="text-white text-xl" />
                    </div>
                    <span className="text-sm text-gray-600 mt-2 group-hover:text-gray-900">Instagram</span>
                  </a>
                  
                  <a 
                    href={contactInfo.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FontAwesomeIcon icon={faFacebook} className="text-white text-xl" />
                    </div>
                    <span className="text-sm text-gray-600 mt-2 group-hover:text-gray-900">Facebook</span>
                  </a>
                  
                  <a 
                    href={contactInfo.socialMedia.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FontAwesomeIcon icon={faYoutube} className="text-white text-xl" />
                    </div>
                    <span className="text-sm text-gray-600 mt-2 group-hover:text-gray-900">YouTube</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Hai domande o vuoi unirti a noi?
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Non esitare a contattarci! Il nostro staff è sempre disponibile per fornirti tutte le informazioni 
                di cui hai bisogno su corsi, iscrizioni, eventi e molto altro.
              </p>
              <div className="flex flex-col gap-4">
                <MainButton 
                  onClick={handlePhoneClick}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Chiamaci Ora
                </MainButton>
                <MainButton 
                  onClick={handleEmailClick}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Invia una Email
                </MainButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
