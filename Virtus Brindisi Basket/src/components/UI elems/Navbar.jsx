import NavLink from "./NavLink";
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Funzione per chiudere il menu mobile quando si clicca su un link
  const handleLinkClick = () => {
    setIsMenuOpen(false)
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
        <li><NavLink href="#news">News</NavLink></li>
        <li><NavLink href="#risultati">Risultati</NavLink></li>
        <li><NavLink href="#calendari">Calendari</NavLink></li>
        <li><NavLink href="#palmares">Palmares</NavLink></li>
        <li><NavLink href="#contatti">Contatti</NavLink></li>
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
          <li><NavLink href="#news" onClick={handleLinkClick}>News</NavLink></li>
          <li><NavLink href="#risultati" onClick={handleLinkClick}>Risultati</NavLink></li>
          <li><NavLink href="#calendari" onClick={handleLinkClick}>Calendari</NavLink></li>
          <li><NavLink href="#palmares" onClick={handleLinkClick}>Palmares</NavLink></li>
          <li><NavLink href="#contatti" onClick={handleLinkClick}>Contatti</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
