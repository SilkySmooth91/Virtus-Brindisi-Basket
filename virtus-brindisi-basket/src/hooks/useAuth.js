import { useAuth as useAuthContext } from '../contexts/AuthContext'

// Hook personalizzato che può essere esteso in futuro
export const useAuth = () => {
  const auth = useAuthContext()
  
  // Possiamo aggiungere qui logica extra se necessaria
  // Per ora è un semplice passthrough
  
  return {
    ...auth,
    // Shorthand per controlli comuni
    isLoggedIn: auth.isAuthenticated,
    isLoading: auth.loading,
    hasError: !!auth.error
  }
}

export default useAuth
