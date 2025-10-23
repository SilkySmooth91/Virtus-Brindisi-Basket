import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Mostra loading durante la verifica dell'auth
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p>Verifica autenticazione...</p>
        </div>
      </div>
    )
  }

  // Redirect a login se non autenticato
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Mostra il contenuto se autenticato
  return children
}
