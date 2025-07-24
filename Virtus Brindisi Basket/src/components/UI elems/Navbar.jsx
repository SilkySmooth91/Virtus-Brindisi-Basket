import NavLink from "./NavLink";
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 left-0 z-50 bg-black h-15 flex items-center justify-center px-4 shadow-lg shadow-black/50">
      {/* Logo e titolo */}
      <div className="flex items-center text-2xl mr-4">
        <p className="text-yellow-400 font-bold mr-1">Virtus </p>
        <p className="p-title text-white font-bold">Brindisi</p>
      </div>
      {/* Menu desktop */}
      <ul className="hidden md:flex justify-center space-x-3 pt-1">
        <li><NavLink href="#home">Home</NavLink></li>
        <li><NavLink href="#chisiamo">Chi Siamo</NavLink></li>
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
          <li><NavLink href="#home">Home</NavLink></li>
          <li><NavLink href="#chisiamo">Chi Siamo</NavLink></li>
          <li><NavLink href="#news">News</NavLink></li>
          <li><NavLink href="#risultati">Risultati</NavLink></li>
          <li><NavLink href="#calendari">Calendari</NavLink></li>
          <li><NavLink href="#palmares">Palmares</NavLink></li>
          <li><NavLink href="#contatti">Contatti</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
