import React from 'react'
import styles from '../CSS Modules/NavLink.module.css'

export default function NavLink({ href, children, className = '', ...props }) {
  return (
    <a 
      {...props}
      href={href}
      className={`bg-transparent text-white hover:text-yellow-400 py-2 px-4 ${styles.hvrUnderlineFromLeft} ${className}`}
    >
      {children}
    </a>
  )
}
