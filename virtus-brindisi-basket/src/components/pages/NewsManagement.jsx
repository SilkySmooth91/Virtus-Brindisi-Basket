import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faNewspaper,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { getAllNews, deleteNews, updateNews } from '../../api/news'
import MainButton from '../UI elems/MainButton'

export default function NewsManagement() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadNews()
  }, [])

  // Ricarica quando si torna alla pagina
  useEffect(() => {
    const handleFocus = () => {
      loadNews()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const data = await getAllNews()
      setNews(data)
    } catch (err) {
      setError('Errore nel caricamento delle news')
      console.error('Load news error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa news?')) {
      return
    }

    try {
      await deleteNews(id)
      setNews(news.filter(article => article.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete error:', err)
    }
  }

  const handleTogglePublished = async (article) => {
    try {
      const updated = await updateNews(article.id, { 
        published: !article.published 
      })
      setNews(news.map(n => n.id === article.id ? updated : n))
    } catch (err) {
      alert(`Errore durante l'aggiornamento: ${err.message}`)
      console.error('Toggle published error:', err)
    }
  }

  const handleEdit = (article) => {
    navigate(`/admin/news/edit/${article.id}`)
  }

  const handleCreate = () => {
    navigate('/admin/news/new')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getDisplayText = (article) => {
    // Priorità: excerpt, poi content troncato
    if (article.excerpt && article.excerpt.trim()) {
      return truncateText(article.excerpt, 200)
    }
    return truncateText(article.content, 150)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-white">
                Gestione <span className="text-yellow-400">News</span>
              </h1>
            </div>
            <MainButton
              onClick={handleCreate}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuova News
            </MainButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* News Grid */}
          {news.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faNewspaper} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna news pubblicata</h3>
              <p className="text-gray-500 mb-6">Inizia creando la prima news per il sito.</p>
              <MainButton
                onClick={handleCreate}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Crea News
              </MainButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {news.map((article) => (
                <div
                  key={article.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    article.published ? 'border-green-400' : 'border-gray-400'
                  }`}
                >
                  <div className="flex">
                    {/* Immagine di copertina */}
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={article.image_url || '/placeholder-news.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Contenuto */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {formatDate(article.created_at)}
                            {article.author && article.author !== 'Virtus Brindisi Basket' && (
                              <span> • {article.author}</span>
                            )}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {getDisplayText(article)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                          {/* Toggle pubblicazione */}
                          <button
                            onClick={() => handleTogglePublished(article)}
                            className={`text-xl cursor-pointer ${
                              article.published ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
                            }`}
                            title={article.published ? 'Nascondere' : 'Pubblicare'}
                          >
                            <FontAwesomeIcon icon={article.published ? faEye : faEyeSlash} />
                          </button>

                          {/* Status badge */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {article.published ? 'Pubblicata' : 'Bozza'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {/* Spazio per eventuali informazioni aggiuntive */}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
