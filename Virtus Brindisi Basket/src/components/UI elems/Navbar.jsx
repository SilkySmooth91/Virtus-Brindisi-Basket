import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 z-50 bg-black h-15 flex items-center justify-center px-4 shadow-lg shadow-black/50">
      <div className="flex items-center text-2xl mr-4">
        <p className="text-yellow-400 font-bold mr-1">Virtus </p>
        <p className="p-title text-white font-bold">Brindisi</p>
      </div>
      <ul className="flex justify-center space-x-3 pt-1">
        <li><NavLink href="#home">Home</NavLink></li>
        <li><NavLink href="#chisiamo">Chi Siamo</NavLink></li>
        <li><NavLink href="#news">News</NavLink></li>
        <li><NavLink href="#risultati">Risultati</NavLink></li>
        <li><NavLink href="#calendari">Calendari</NavLink></li>
        <li><NavLink href="#palmares">Palmares</NavLink></li>
        <li><NavLink href="#contatti">Contatti</NavLink></li>
      </ul>
    </nav>
  )
}
