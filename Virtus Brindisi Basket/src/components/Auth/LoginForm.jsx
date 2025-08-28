import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { 
    login, 
    error, 
    clearError, 
    attempts, 
    maxAttempts, 
    isLocked, 
    formatRemainingTime,
    canAttemptLogin 
  } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password || !canAttemptLogin) {
      return
    }

    setIsSubmitting(true)
    clearError()

    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Redirect alla dashboard admin
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      console.error('Login submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-yellow-400">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faLock} className="text-2xl text-black" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Accesso Amministratore
          </h2>
          <p className="text-gray-600 text-sm">
            Accedi per gestire i contenuti del sito
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 border-l-4 rounded ${
            isLocked ? 'bg-red-50 border-red-400' : 'bg-red-50 border-red-400'
          }`}>
            <p className={`text-sm ${isLocked ? 'text-red-700 font-semibold' : 'text-red-700'}`}>
              {error}
            </p>
          </div>
        )}

        {/* Rate Limiting Status */}
        {!isLocked && attempts > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-yellow-700 text-sm">
              <strong>Attenzione:</strong> {attempts} tentativ{attempts === 1 ? 'o' : 'i'} fallito/i di {maxAttempts}. 
              {maxAttempts - attempts === 1 ? ' Un tentativo rimasto prima del blocco.' : ` ${maxAttempts - attempts} tentativi rimasti.`}
            </p>
          </div>
        )}

        {/* Lockout Status */}
        {isLocked && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="text-red-500 mr-3" />
              <div>
                <p className="text-red-700 font-semibold text-sm">Account temporaneamente bloccato</p>
                <p className="text-red-600 text-xs mt-1">
                  Riprova tra: <span className="font-mono font-bold">{formatRemainingTime()}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="admin@virtusbrindisi.com"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Inserisci la password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email || !password || !canAttemptLogin}
            className={`cursor-pointer w-full font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center ${
              !canAttemptLogin 
                ? 'bg-red-300 text-red-700 cursor-not-allowed' 
                : isSubmitting || !email || !password
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer'
            }`}
          >
            {!canAttemptLogin ? (
              <>
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Account Bloccato
              </>
            ) : isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Accesso in corso...
              </>
            ) : (
              'Accedi'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Solo per amministratori autorizzati
          </p>
        </div>
      </div>
    </div>
  )
}
