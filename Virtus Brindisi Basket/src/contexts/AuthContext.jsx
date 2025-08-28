import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRateLimit } from '../hooks/useRateLimit'

// Crea il Context
const AuthContext = createContext({})

// Hook personalizzato per usare l'AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Hook per rate limiting
  const {
    attempts,
    maxAttempts,
    isLocked,
    remainingTime,
    formatRemainingTime,
    recordFailedAttempt,
    resetAttempts,
    canAttemptLogin
  } = useRateLimit()

  // Verifica lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking auth status:', error)
          setError(error.message)
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(!!session)
          setError(null)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setError('Errore durante la verifica dell\'autenticazione')
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()

    // Listener per cambiamenti dello stato di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session)
        setIsAuthenticated(!!session)
        setError(null)
        
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false)
        }
      }
    )

    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Funzione di login
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // Verifica rate limiting
      if (!canAttemptLogin) {
        const errorMessage = `Troppi tentativi di login. Riprova tra ${formatRemainingTime()}`
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Login fallito - registra il tentativo
        recordFailedAttempt()
        
        let errorMessage = 'Credenziali non valide'
        if (attempts + 1 >= maxAttempts) {
          errorMessage = `Troppi tentativi falliti. Account bloccato per 24 ore.`
        } else {
          const remainingAttempts = maxAttempts - (attempts + 1)
          errorMessage = `Credenziali non valide. Rimangono ${remainingAttempts} tentativ${remainingAttempts === 1 ? 'o' : 'i'}.`
        }
        
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      // Login riuscito - reset dei tentativi
      resetAttempts()
      console.log('Login successful:', !!data.session)
      setIsAuthenticated(true)
      return { success: true, data }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.message || 'Errore durante il login'
      setError(errorMessage)
      setIsAuthenticated(false)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Funzione di logout
  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      console.log('Logout successful')
      setIsAuthenticated(false)
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      const errorMessage = err.message || 'Errore durante il logout'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Funzione per pulire errori
  const clearError = () => {
    setError(null)
  }

  const value = {
    // State
    isAuthenticated,
    loading,
    error,
    
    // Rate limiting info
    attempts,
    maxAttempts,
    isLocked,
    remainingTime,
    formatRemainingTime,
    canAttemptLogin,
    
    // Actions
    login,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
