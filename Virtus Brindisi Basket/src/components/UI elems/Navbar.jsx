import NavLink from "./NavLink";
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Funzione per chiudere il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCalendarDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Funzione per chiudere il menu mobile quando si clicca su un link
  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setIsCalendarDropdownOpen(false)
  }

  // Funzione per gestire il dropdown calendari
  const toggleCalendarDropdown = () => {
    setIsCalendarDropdownOpen(!isCalendarDropdownOpen)
  }

  return (
    <nav className="sticky top-0 left-0 w-full z-[9999] bg-black h-15 flex items-center justify-center px-4 shadow-lg shadow-black/50">
      {/* Logo e titolo */}
      <Link to="/" className="flex items-center text-2xl mr-4 hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
        <p className="text-yellow-400 font-bold mr-1">Virtus </p>
        <p className="p-title text-white font-bold">Brindisi</p>
      </Link>
      {/* Menu desktop */}
      <ul className="hidden md:flex justify-center space-x-3 pt-1">
        <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
        <li><NavLink to="/chi-siamo" onClick={handleLinkClick}>Chi Siamo</NavLink></li>
        <li><NavLink to="/news" onClick={handleLinkClick}>News</NavLink></li>
        <li><NavLink to="/risultati" onClick={handleLinkClick}>Risultati</NavLink></li>
        
        {/* Dropdown Calendari */}
        <li className="relative" ref={dropdownRef}>
          <button
            onClick={toggleCalendarDropdown}
            className="flex items-center space-x-1 px-4 py-2 text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
          >
            <span>Calendari</span>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`w-3 h-3 transition-transform duration-200 ${
                isCalendarDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {/* Dropdown Menu */}
          <div className={`absolute top-12 left-0 mt-1 w-55 bg-black rounded-md shadow-lg border-1 border-gray-400 overflow-hidden transition-all duration-200 z-50 ${
            isCalendarDropdownOpen 
              ? 'opacity-100 visible transform translate-y-0' 
              : 'opacity-0 invisible transform -translate-y-2'
          }`}>
            <Link
              to="/calendario-partite"
              onClick={handleLinkClick}
              className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-gray-900 transition-colors duration-200 font-medium"
            >
              Calendario Partite
            </Link>
            <Link
              to="/calendario-allenamenti"
              onClick={handleLinkClick}
              className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-gray-900 transition-colors duration-200 border-t border-gray-700 font-medium"
            >
              Calendario Allenamenti
            </Link>
          </div>
        </li>
        
        <li><NavLink href="#palmares">Palmares</NavLink></li>
        <li><NavLink to="/contatti" onClick={handleLinkClick}>Contatti</NavLink></li>
      </ul>

      {/* Burger menu */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu">

        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Menu mobile dropdown */}
      <div className={`absolute top-full left-0 w-full bg-black md:hidden transition-all duration-500 ease-in-out transform shadow-lg ${
        isMenuOpen 
          ? 'opacity-100 translate-y-0 max-h-96' 
          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden'
      }`}>
        <ul className="flex flex-col space-y-2 p-4">
          <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
          <li><NavLink to="/chi-siamo" onClick={handleLinkClick}>Chi Siamo</NavLink></li>
          <li><NavLink to="/news" onClick={handleLinkClick}>News</NavLink></li>
          <li><NavLink to="/risultati" onClick={handleLinkClick}>Risultati</NavLink></li>
          
          {/* Calendari nel menu mobile */}
          <li>
            <div className="border-l-2 border-yellow-400 pl-3 ml-2">
              <p className="text-yellow-400 text-sm font-medium mb-2">Calendari</p>
              <div className="space-y-1">
                <Link
                  to="/calendario-partite"
                  onClick={handleLinkClick}
                  className="block text-white hover:text-yellow-400 transition-colors duration-300 text-sm py-1 font-medium"
                >
                  Calendario Partite
                </Link>
                <Link
                  to="/calendario-allenamenti"
                  onClick={handleLinkClick}
                  className="block text-white hover:text-yellow-400 transition-colors duration-300 text-sm py-1 font-medium"
                >
                  Calendario Allenamenti
                </Link>
              </div>
            </div>
          </li>
          
          <li><NavLink href="#palmares" onClick={handleLinkClick}>Palmares</NavLink></li>
          <li><NavLink to="/contatti" onClick={handleLinkClick}>Contatti</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
