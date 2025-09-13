import { supabase } from './supabase'
import { supabaseAdmin } from './supabaseAdmin'

// Utility per gestire Supabase Storage
export class SupabaseStorageManager {
  static async createBucketIfNotExists(bucketName) {
    try {
      // Controlla se il bucket esiste già
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        return false
      }

      const bucketExists = buckets.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        // Crea il bucket se non esiste
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 10 * 1024 * 1024 // 10MB
        })

        if (createError) {
          console.error(`Error creating bucket ${bucketName}:`, createError)
          return false
        }

        console.log(`✅ Bucket ${bucketName} created successfully`)
      } else {
        console.log(`ℹ️ Bucket ${bucketName} already exists`)
      }

      return true
    } catch (error) {
      console.error(`Error managing bucket ${bucketName}:`, error)
      return false
    }
  }

  static async uploadImage(bucketName, file, options = {}) {
    try {
      // Genera un nome file unico
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName

      // Usa il client admin per l'upload (per bucket con RLS)
      const client = bucketName === 'gallery' ? supabase : supabaseAdmin

      // Upload del file
      const { error: uploadError } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          ...options
        })

      if (uploadError) {
        throw uploadError
      }

      // Ottieni l'URL pubblico (sempre dal client normale per URL pubblici)
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: data.publicUrl,
        path: filePath
      }

    } catch (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async deleteImage(bucketName, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath])

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Helper per inizializzare i bucket necessari
export async function initializeStorageBuckets() {
  const buckets = ['gallery', 'news-image']
  
  console.log('🔄 Initializing Supabase Storage buckets...')
  
  for (const bucket of buckets) {
    await SupabaseStorageManager.createBucketIfNotExists(bucket)
  }
  
  console.log('✅ Storage buckets initialization complete')
}
