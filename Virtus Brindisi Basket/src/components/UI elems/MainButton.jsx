import React from 'react'

export default function MainButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button 
      {...props}
      type={type}
      className={`cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-200 rounded-md py-2 px-4 shadow ${className}`}
    >
      {children}
    </button>
  )
}
