import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faSave, 
  faSpinner,
  faImage,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { createNews, updateNews, getNewsById } from '../../api/news'
import MainButton from '../UI elems/MainButton'
import './NewsEditor.css'

export default function NewsEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: true,
    author: 'Virtus Brindisi Basket'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [editorKey, setEditorKey] = useState(0) // Per forzare re-render dell'editor

  // Carica i dati per la modifica
  useEffect(() => {
    if (isEdit) {
      loadNewsData()
    }
  }, [id, isEdit])

  const loadNewsData = async () => {
    try {
      setInitialLoading(true)
      const newsData = await getNewsById(id)
      setFormData({
        title: newsData.title || '',
        content: newsData.content || '',
        excerpt: newsData.excerpt || '',
        image_url: newsData.image_url || '',
        published: newsData.published !== undefined ? newsData.published : true,
        author: newsData.author || 'Virtus Brindisi Basket'
      })
      setImagePreview(newsData.image_url || '')
      // Forza re-render dell'editor dopo il caricamento
      setTimeout(() => setEditorKey(prev => prev + 1), 100)
    } catch (err) {
      setError('Errore nel caricamento della news')
      console.error('Load news error:', err)
    } finally {
      setInitialLoading(false)
    }
  }

  // Fix per il cursore dell'editor - forza re-render dopo mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setEditorKey(prev => prev + 1)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Update image preview when image_url changes
    if (name === 'image_url') {
      setImagePreview(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Il titolo è obbligatorio')
      return
    }
    
    if (!formData.content.trim()) {
      setError('Il contenuto è obbligatorio')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await updateNews(id, formData)
      } else {
        await createNews(formData)
      }
      
      // Torna alla lista delle news
      navigate('/admin/news')
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio')
      console.error('Save news error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    setImagePreview('')
  }

  if (initialLoading) {
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
              <button 
                onClick={() => navigate('/admin/news')}
                className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-white">
                {isEdit ? 'Modifica' : 'Nuova'} <span className="text-yellow-400">News</span>
              </h1>
            </div>
            <MainButton
              onClick={handleSubmit}
              disabled={loading}
              className="disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isEdit ? 'Salva Modifiche' : 'Crea News'}
                </>
              )}
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

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Metadata */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titolo *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Inserisci il titolo della news..."
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Riassunto
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    placeholder="Breve riassunto della news (opzionale)..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Caratteri: {formData.excerpt.length}
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Autore
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Nome autore..."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL Immagine di Copertina
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="https://esempio.com/immagine.jpg"
                  />
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anteprima Immagine
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Anteprima"
                        className="max-w-full h-48 object-cover mx-auto rounded"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="py-8">
                        <FontAwesomeIcon icon={faImage} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          Inserisci un URL per vedere l'anteprima
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  <label htmlFor="published" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <FontAwesomeIcon 
                      icon={formData.published ? faEye : faEyeSlash} 
                      className={`mr-2 ${formData.published ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    Pubblica immediatamente
                  </label>
                </div>
              </div>

              {/* Right Column - Content Editor */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenuto *
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden editor-container">
                  <MDEditor
                    key={editorKey}
                    value={formData.content || ''}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      content: value || ''
                    }))}
                    preview="edit"
                    height={600}
                    data-color-mode="light"
                    textareaProps={{
                      style: {
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        letterSpacing: '0'
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Caratteri: {(formData.content || '').length} • Supporta Markdown (**grassetto**, *corsivo*, # titoli, - liste, etc.)
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
