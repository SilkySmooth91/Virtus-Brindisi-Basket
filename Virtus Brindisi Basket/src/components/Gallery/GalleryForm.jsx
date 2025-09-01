import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faUpload, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons'
import { 
  createGalleryImage, 
  updateGalleryImage, 
  getAllGalleryImages 
} from '../../api/gallery'
import { supabase } from '../../lib/supabase'
import MainButton from '../UI elems/MainButton'

export default function GalleryForm({ image, onClose, onSave }) {
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    order_position: null
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (image) {
      setFormData({
        image_url: image.image_url || '',
        alt_text: image.alt_text || '',
        order_position: image.order_position || null
      })
      setPreviewUrl(image.image_url)
    } else {
      // Per nuove immagini, ottieni la prossima posizione disponibile
      loadNextPosition()
    }
  }, [image])

  const loadNextPosition = async () => {
    try {
      const images = await getAllGalleryImages()
      const maxPosition = Math.max(...images.map(img => img.order_position || 0), 0)
      setFormData(prev => ({ ...prev, order_position: maxPosition + 1 }))
    } catch (err) {
      console.error('Error loading next position:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validazione del file
      if (!file.type.startsWith('image/')) {
        setError('Seleziona un file immagine valido')
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Il file è troppo grande. Massimo 5MB.')
        return
      }

      setImageFile(file)
      setError(null)

      // Crea preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Ottieni l'URL pubblico
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let imageUrl = formData.image_url

      // Se è stato selezionato un nuovo file, caricalo
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImage(imageFile)
      }

      // Prepara i dati per il salvataggio
      const saveData = {
        image_url: imageUrl,
        alt_text: formData.alt_text.trim() || null,
        order_position: parseInt(formData.order_position) || null
      }

      // Rimuovi campi vuoti
      Object.keys(saveData).forEach(key => {
        if (saveData[key] === '' || saveData[key] === null) {
          if (key !== 'alt_text' && key !== 'order_position') {
            // image_url è obbligatorio
            return
          }
          if (key === 'order_position' && saveData[key] === null) {
            delete saveData[key]
          }
        }
      })

      if (image) {
        // Update existing image
        await updateGalleryImage(image.id, saveData)
      } else {
        // Create new image
        await createGalleryImage(saveData)
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {image ? 'Modifica Immagine' : 'Nuova Immagine'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Upload Immagine */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immagine {!image && <span className="text-red-500">*</span>}
            </label>
            
            {/* Preview */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  loading 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                }`}
              >
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={uploading ? faSpinner : faUpload} 
                    className={`w-8 h-8 text-gray-400 mb-2 ${uploading ? 'animate-spin' : ''}`} 
                  />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Caricamento...' : 'Clicca per selezionare un\'immagine'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF fino a 5MB
                  </p>
                </div>
              </label>
            </div>

            {/* URL Manuale (solo per modifica) */}
            {image && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Immagine
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://esempio.com/immagine.jpg"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Alt Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testo Alternativo
            </label>
            <input
              type="text"
              name="alt_text"
              value={formData.alt_text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Descrizione dell'immagine per l'accessibilità"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Opzionale. Utilizzato per l'accessibilità e SEO.
            </p>
          </div>

          {/* Posizione */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posizione nell'ordine
            </label>
            <input
              type="number"
              name="order_position"
              value={formData.order_position || ''}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Es. 1, 2, 3..."
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Opzionale. Determina l'ordine di visualizzazione (numero più basso = primo).
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              Annulla
            </button>
            <MainButton
              type="submit"
              disabled={loading || uploading || (!imageFile && !image && !formData.image_url)}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? 'Caricamento...' : 'Salvataggio...'}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faImage} className="w-4 h-4 mr-2" />
                  {image ? 'Aggiorna' : 'Salva'}
                </>
              )}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  )
}
