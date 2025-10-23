import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'

export default function SocialShare({ 
  url, 
  title, 
  description = '',
  className = '',
  newsId = null
}) {
  // Use static URL for social sharing if newsId is provided
  const shareUrl = newsId 
    ? `${window.location.origin}/news/${newsId}`
    : url
  const shareTitle = title
  const shareText = `${title} ${description}`.trim()

  // Per Instagram non c'è un'API diretta di condivisione web
  // Possiamo aprire Instagram o copiare il link
  const handleInstagramShare = () => {
    // Copia il link e suggerisce di condividerlo su Instagram
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      .then(() => {
        alert('Link copiato! Ora puoi condividerlo su Instagram nelle tue Stories o post.')
        // Opzionalmente apri Instagram web
        window.open('https://www.instagram.com/', '_blank')
      })
      .catch(() => {
        alert('Apri Instagram e condividi manualmente questo link: ' + shareUrl)
      })
  }

  return (
    <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faShare} className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Condividi questa notizia</h3>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Facebook */}
        <FacebookShareButton
          url={shareUrl}
          quote={shareTitle}
          className="flex items-center"
        >
          <div className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <FacebookIcon size={24} round className="mr-2" />
            <span className="font-medium">Facebook</span>
          </div>
        </FacebookShareButton>

        {/* WhatsApp */}
        <WhatsappShareButton
          url={shareUrl}
          title={shareText}
          className="flex items-center"
        >
          <div className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            <WhatsappIcon size={24} round className="mr-2" />
            <span className="font-medium">WhatsApp</span>
          </div>
        </WhatsappShareButton>

        {/* Instagram */}
        <button
          onClick={handleInstagramShare}
          className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
            <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-sm" />
          </div>
          <span className="font-medium">Instagram</span>
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-3">
        <strong>Instagram:</strong> Il link verrà copiato e potrai condividerlo nelle tue Stories o post.
      </p>
    </div>
  )
}
