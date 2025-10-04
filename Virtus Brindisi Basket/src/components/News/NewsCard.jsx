import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faUser,
  faEye,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import MarkdownPreview from '@uiw/react-markdown-preview'

export default function NewsCard({ article, showFullDate = false, showAuthor = true, compact = false }) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString) => {
    if (showFullDate) {
      return new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Funzione per rimuovere markdown e ottenere testo pulito
  const markdownToText = (markdown) => {
    if (!markdown) return ''
    
    return markdown
      .replace(/#{1,6}\s+/g, '') // Rimuovi headers (# ## ###)
      .replace(/\*\*(.+?)\*\*/g, '$1') // Rimuovi **bold**
      .replace(/\*(.+?)\*/g, '$1') // Rimuovi *italic*
      .replace(/~~(.+?)~~/g, '$1') // Rimuovi ~~strikethrough~~
      .replace(/`(.+?)`/g, '$1') // Rimuovi `code`
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Rimuovi [link](url) e mantieni solo il testo
      .replace(/!\[.*?\]\(.+?\)/g, '') // Rimuovi le immagini
      .replace(/^[\s]*[-\*\+]\s+/gm, '') // Rimuovi bullet points (- * +)
      .replace(/^\d+\.\s+/gm, '') // Rimuovi liste numerate (1. 2. 3.)
      .replace(/^---+$/gm, '') // Rimuovi separatori orizzontali
      .replace(/\n+/g, ' ') // Sostituisci newlines con spazi
      .replace(/\s+/g, ' ') // Rimuovi spazi multipli
      .trim()
  }

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ''
    
    // Converti markdown in testo semplice per l'anteprima
    const cleanText = markdownToText(content)
    
    if (cleanText.length <= maxLength) {
      return cleanText
    }
    
    return cleanText.substring(0, maxLength) + '...'
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <article className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-300 hover:border-yellow-400 ${
      compact ? 'flex h-32' : 'h-[500px] flex flex-col'
    }`}>
      {/* Immagine */}
      {article.image_url && !imageError && (
        <div className={`relative ${
          compact ? 'w-32 aspect-[16/10] flex-shrink-0' : 'aspect-[16/10] flex-shrink-0'
        }`}>
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Contenuto */}
      <div className={`p-6 ${compact ? 'flex-1' : 'flex-1 flex flex-col'}`}>
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
              <time dateTime={article.created_at}>
                {formatDate(article.created_at)}
              </time>
            </div>
            
            {showAuthor && article.author && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-1" />
                <span>{article.author}</span>
              </div>
            )}
          </div>

          {article.views !== undefined && (
            <div className="flex items-center text-gray-400">
              <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-1" />
              <span>{article.views}</span>
            </div>
          )}
        </div>

        {/* Titolo */}
        <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
          compact ? 'text-lg' : 'text-xl'
        }`}>
          {article.title}
        </h2>

        {/* Contenuto */}
        <div className={`text-gray-600 leading-relaxed flex-1 ${compact ? 'text-sm' : ''}`}>
          <p className="line-clamp-2">
            {truncateContent(article.content, compact ? 100 : 150)}
          </p>
          
          <div className="mt-auto pt-4">
            <Link 
              to={`/news/${article.id}`}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium inline-flex items-center cursor-pointer transition-colors"
            >
              Leggi tutto
              <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Footer con categoria se presente */}
        {article.category && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
              {article.category}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
