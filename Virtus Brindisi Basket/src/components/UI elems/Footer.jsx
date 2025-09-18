import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faPhone, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook, faYoutube, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import MainButton from './MainButton'

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-500 pt-12 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Sezioni principali */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* Contatti */}
          <div>
            <h3 className="p-title text-yellow-400 text-2xl mb-6 text-center">Contatti</h3>
            <ul className="space-y-4 list-none">
              <li className="flex items-start gap-3 justify-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-white text-center">
                  <p className="text-center">Via dello Sport, 12</p>
                  <p className="text-center">72100 Brindisi (BR)</p>
                </div>
              </li>
              
              <li className="flex items-center gap-3 justify-center">
                <FontAwesomeIcon icon={faPhone} className="text-yellow-400 flex-shrink-0" />
                <p className="text-white text-center">+39 0831 123456</p>
              </li>
              
              <li className="flex items-center gap-3 justify-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-yellow-400 flex-shrink-0" />
                <p className="text-white text-center">info@virtusbrindisibasket.it</p>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="p-title text-yellow-400 text-2xl mb-6 text-center">Newsletter</h3>
            <p className="text-white mb-4 text-center">
              Resta aggiornato su tutte le novità della squadra, partite e eventi speciali.
            </p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Inserisci la tua email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder:text-gray-500"
              />
              <MainButton className="w-full">
                Iscriviti
              </MainButton>
            </div>
          </div>
          
          {/* Social */}
          <div>
            <h3 className="p-title text-yellow-400 text-2xl mb-6 text-center">Seguici sui Social</h3>
            <p className="text-white mb-6 text-center">
              Seguici per foto esclusive, highlights e contenuti dietro le quinte.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.instagram.com/virtusbrindisibasket" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              
              <a 
                href="https://www.facebook.com/virtusbrindisibasket" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              
              <a 
                href="https://www.youtube.com/@virtusbrindisibasket1087" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright e Crediti */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative">
            <p className="text-gray-400 text-center">
              © 2025 Virtus Brindisi Basket. Tutti i diritti riservati.
            </p>
            
            <div className="flex items-center gap-2 text-gray-400 md:border-l md:border-gray-400 md:pl-4">
              <span className="text-center">Sito realizzato da Lorenzo Olivieri</span>
              <a 
                href="https://www.linkedin.com/in/lorenzo-olivieri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 ml-2"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a 
                href="https://github.com/lorenzo-olivieri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>

            {/* Admin Login Link - Responsive positioning */}
            <Link 
              to="/admin/login"
              className="md:absolute md:bottom-0 md:right-0 mt-4 md:mt-0 text-gray-500 hover:text-yellow-400 transition-colors duration-300 py-2 px-3 rounded-full hover:bg-gray-800 order-last"
              title="Accesso Amministratore"
            >
              <FontAwesomeIcon icon={faLock} className="text-sm" />
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  )
}
