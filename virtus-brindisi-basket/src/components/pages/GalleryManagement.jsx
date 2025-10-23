import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faArrowLeft,
  faImages,
  faArrowUp,
  faArrowDown,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { 
  getAllGalleryImages, 
  deleteGalleryImage, 
  updateGalleryImage 
} from '../../api/gallery'
import MainButton from '../UI elems/MainButton'
import GalleryForm from '../Gallery/GalleryForm'

export default function GalleryManagement() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const data = await getAllGalleryImages()
      setImages(data)
    } catch (err) {
      setError('Errore nel caricamento delle immagini')
      console.error('Load images error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa immagine?')) {
      return
    }

    try {
      await deleteGalleryImage(id)
      setImages(images.filter(image => image.id !== id))
    } catch (err) {
      alert('Errore durante l\'eliminazione')
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (image) => {
    setEditingImage(image)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingImage(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingImage(null)
    loadImages() // Ricarica i dati
  }

  const moveImage = async (imageId, direction) => {
    const currentIndex = images.findIndex(img => img.id === imageId)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (targetIndex < 0 || targetIndex >= images.length) return

    try {
      const currentImage = images[currentIndex]
      const targetImage = images[targetIndex]

      // Scambia le posizioni
      await updateGalleryImage(currentImage.id, { order_position: targetImage.order_position })
      await updateGalleryImage(targetImage.id, { order_position: currentImage.order_position })

      // Ricarica le immagini per aggiornare l'ordine
      loadImages()
    } catch (err) {
      alert('Errore durante il riordinamento')
      console.error('Reorder error:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento gallery...</p>
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
                Gestione <span className="text-yellow-400">Gallery</span>
              </h1>
            </div>
            <MainButton
              onClick={handleCreate}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuova Immagine
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

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faImages} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna immagine nella gallery</h3>
              <p className="text-gray-500 mb-6">Inizia aggiungendo la prima immagine alla gallery.</p>
              <MainButton
                onClick={handleCreate}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Aggiungi Immagine
              </MainButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border hover:border-yellow-400 transition-all duration-200"
                >
                  {/* Immagine */}
                  <div className="aspect-w-16 aspect-h-12 relative group">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Immagine gallery'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Previeni il loop infinito controllando se non è già un placeholder
                        if (!e.target.src.includes('placeholder') && !e.target.src.includes('data:image')) {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDE2Ljk3MDYgMTYuOTcwNiAyMSAxMiAyMUM3LjAyOTQ0IDIxIDMgMTYuOTcwNiAzIDEyQzMgNy4wMjk0NCA3LjAyOTQ0IDMgMTIgM0MxNi45NzA2IDMgMjEgNy4wMjk0NCAyMSAxMloiIHN0cm9rZT0iI0Q1RDVENSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik05IDEwSDE1VjE0SDlaIiBmaWxsPSIjRDVENUQ1Ii8+Cjwvc3ZnPgo='
                        }
                      }}
                    />
                    
                    {/* Overlay con preview */}
                    <div className="absolute inset-0  group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <button 
                        onClick={() => window.open(image.image_url, '_blank')}
                        className="cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Badge posizione */}
                    {image.order_position && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400 text-black">
                          #{image.order_position}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenuto */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        {image.alt_text && (
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {image.alt_text}
                          </h3>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(image.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      {/* Controlli riordinamento */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => moveImage(image.id, 'up')}
                          disabled={index === 0}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                          }`}
                        >
                          <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveImage(image.id, 'down')}
                          disabled={index === images.length - 1}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            index === images.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                          }`}
                        >
                          <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Azioni */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <GalleryForm
          image={editingImage}
          onClose={handleFormClose}
          onSave={loadImages}
        />
      )}
    </div>
  )
}
