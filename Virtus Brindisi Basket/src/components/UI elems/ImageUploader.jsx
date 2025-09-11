import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faSpinner, faImage, faTimes } from '@fortawesome/free-solid-svg-icons'
import { SupabaseStorageManager } from '../../lib/storageManager'

export default function ImageUploader({
  currentImageUrl,
  onImageChange,
  bucketName = 'news-images',
  label = 'Immagine',
  required = false,
  maxSize = 5, // MB
  className = ''
}) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validazione del file
    if (!file.type.startsWith('image/')) {
      setError('Seleziona un file immagine valido')
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`Il file è troppo grande. Massimo ${maxSize}MB.`)
      return
    }

    setError('')
    setUploading(true)

    try {
      // Crea preview locale
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)

      // Upload su Supabase
      const result = await SupabaseStorageManager.uploadImage(bucketName, file)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Aggiorna il componente parent
      onImageChange(result.url)
      setPreviewUrl(result.url)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Errore durante l\'upload')
      setPreviewUrl(currentImageUrl || '')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setPreviewUrl(url)
    onImageChange(url)
    setError('')
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    onImageChange('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={() => setPreviewUrl('')}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* File Upload */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`image-upload-${bucketName}`}
          disabled={uploading}
        />
        <label
          htmlFor={`image-upload-${bucketName}`}
          className={`flex items-center justify-center px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
          }`}
        >
          <div className="text-center">
            <FontAwesomeIcon 
              icon={uploading ? faSpinner : faUpload} 
              className={`w-6 h-6 text-gray-400 mb-2 ${uploading ? 'animate-spin' : ''}`} 
            />
            <p className="text-sm text-gray-600">
              {uploading ? 'Caricamento...' : 'Clicca per caricare un\'immagine'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF fino a {maxSize}MB
            </p>
          </div>
        </label>
      </div>

      {/* URL Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Oppure inserisci URL
        </label>
        <input
          type="url"
          value={previewUrl || ''}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="https://esempio.com/immagine.jpg"
          disabled={uploading}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
