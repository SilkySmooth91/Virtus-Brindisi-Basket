import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../Auth/LoginForm'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect se già autenticato
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

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

  // Non mostrare la pagina se già autenticato (evita flash)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-30">
          {/* Subtle pattern overlay */}
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-yellow-400">Virtus</span> Brindisi Basket
          </h1>
          <p className="text-gray-400">Pannello Amministrazione</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Back to Site Link */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors duration-200"
          >
            ← Torna al sito
          </a>
        </div>
      </div>
    </div>
  )
}
