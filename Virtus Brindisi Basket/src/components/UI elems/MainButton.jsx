import React from 'react'

export default function MainButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button 
      {...props}
      type={type}
      className={`cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-200 rounded-md pt-2 pb-3 px-4 shadow ${className}`}
    >
      {children}
    </button>
  )
}
