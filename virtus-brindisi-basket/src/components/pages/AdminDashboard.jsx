import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSignOutAlt, 
  faUsers, 
  faNewspaper, 
  faImages, 
  faTrophy, 
  faCalendarAlt,
  faChartLine,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import MainButton from '../UI elems/MainButton'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      // Il redirect sarà gestito automaticamente dall'AuthContext
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuItems = [
    { name: 'Staff', icon: faUsers, count: '4', description: 'Gestisci membri dello staff', url: '/admin/staff' },
    { name: 'News', icon: faNewspaper, count: '2', description: 'Articoli e notizie', url: '/admin/news' },
    { name: 'Gallery', icon: faImages, count: '4', description: 'Immagini e foto', url: '/admin/gallery' },
    { name: 'Palmares', icon: faTrophy, count: '4', description: 'Trofei e riconoscimenti', url: '/admin/palmares' },
    { name: 'Risultati', icon: faChartLine, count: '4', description: 'Risultati partite', url: '/admin/results' },
    { name: 'Calendario', icon: faCalendarAlt, count: '0', description: 'Programma partite e allenamenti', url: '/admin/calendar' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                <span className="text-yellow-400">Virtus</span> Admin
              </h1>
            </div>

            {/* Logout Button */}
            <MainButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="disabled:opacity-50"
            >
              <FontAwesomeIcon 
                icon={faSignOutAlt} 
                className={`mr-2 ${isLoggingOut ? 'animate-spin' : ''}`} 
              />
              {isLoggingOut ? 'Disconnessione...' : 'Logout'}
            </MainButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Bottone Torna al Sito */}
        <div className="px-4 my-4 sm:px-0">
          <Link
            to="/"
            className="inline-flex items-center text-yellow-500 hover:text-yellow-600 transition-colors font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-4 h-4" />
            Torna al Sito
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-400">
            <div className="px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Benvenuto nella Dashboard Amministratore
              </h2>
              <p className="text-gray-600">
                Gestisci i contenuti del sito Virtus Brindisi Basket. Seleziona una sezione per iniziare.
              </p>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="bg-white overflow-hidden shadow rounded-lg border hover:border-yellow-400 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className="h-8 w-8 text-yellow-400" 
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {item.count}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm">
                    <Link 
                      to={item.url}
                      className="text-yellow-600 hover:text-yellow-900 font-medium transition-colors"
                    >
                      Gestisci →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Statistiche Rapide
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">14</div>
                  <div className="text-sm text-gray-500">Contenuti totali</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <div className="text-sm text-gray-500">Stato sito</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-500">News pubblicate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-500">Staff attivo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
