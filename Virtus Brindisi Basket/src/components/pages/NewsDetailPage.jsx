import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faUser,
  faEye,
  faArrowLeft,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import Navbar from '../UI elems/Navbar'
import Footer from '../UI elems/Footer'
import SocialShare from '../UI elems/SocialShare'
import { getNewsById } from '../../api/news'

export default function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const data = await getNewsById(id)
        setArticle(data)
        setError(null)
      } catch (err) {
        setError('Errore nel caricamento della notizia')
        console.error('Error fetching article:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  // Cleanup effect per evitare memory leaks
  useEffect(() => {
    return () => {
      setArticle(null)
      setError(null)
      setImageError(false)
    }
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const goBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-yellow-400 animate-spin mb-4" />
            <p className="text-white">Caricamento notizia...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-red-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                {error || 'Notizia non trovata'}
              </h2>
              <p className="text-gray-400 mb-6">
                La notizia che stai cercando non esiste o è stata rimossa.
              </p>
              <button
                onClick={goBack}
                className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Torna indietro
              </button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Pulsante torna indietro */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={goBack}
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Torna alle notizie
            </button>
          </motion.div>

          {/* Immagine principale */}
          {article.image_url && !imageError && (
            <motion.div 
              className="relative aspect-[3/2] w-full mb-8 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </motion.div>
          )}

          {/* Contenuto principale */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            
            {/* Header con metadati */}
            <div className="p-6 border-b border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Categoria */}
                {article.category && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-400 text-black">
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Titolo */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Metadati */}
                <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-6">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
                    <time dateTime={article.created_at}>
                      {formatDate(article.created_at)}
                    </time>
                  </div>
                  
                  {article.author && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                      <span>{article.author}</span>
                    </div>
                  )}

                  {article.views !== undefined && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-2" />
                      <span>{article.views} visualizzazioni</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Corpo della notizia */}
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="prose prose-lg max-w-none">
                <MarkdownPreview 
                  source={article.content}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: 'inherit',
                    fontSize: '16px',
                    lineHeight: '1.7'
                  }}
                />
              </div>
            </motion.div>

            {/* Condivisione Social */}
            <motion.div 
              className="px-6 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialShare
                url={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174'}/news/${article.id}`}
                title={article.title}
                description={article.content.substring(0, 150) + '...'}
              />
            </motion.div>

          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  )
}
