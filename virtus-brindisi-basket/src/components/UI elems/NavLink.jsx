import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../CSS Modules/NavLink.module.css'

export default function NavLink({ href, to, children, className = '', ...props }) {
  const baseClass = `bg-transparent text-white hover:text-yellow-400 py-2 px-4 ${styles.hvrUnderlineFromLeft} ${className}`
  
  // Se è un link React Router (prop "to")
  if (to) {
    return (
      <Link 
        {...props}
        to={to}
        className={baseClass}
      >
        {children}
      </Link>
    )
  }
  
  // Se è un anchor link (prop "href")
  return (
    <a 
      {...props}
      href={href}
      className={baseClass}
    >
      {children}
    </a>
  )
}
