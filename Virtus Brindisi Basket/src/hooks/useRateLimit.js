import { useState, useEffect } from 'react'

// Configurazione rate limiting
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000 // 24 ore in millisecondi
const STORAGE_KEY = 'loginAttempts'

/**
 * Hook per gestire il rate limiting dei tentativi di login
 */
export const useRateLimit = () => {
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutExpiry, setLockoutExpiry] = useState(null)
  const [remainingTime, setRemainingTime] = useState(0)

  // Carica lo stato salvato dal localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const { attempts: savedAttempts, lockoutExpiry: savedExpiry } = JSON.parse(savedData)
        const now = Date.now()
        
        if (savedExpiry && now < savedExpiry) {
          // Ancora in lockout
          setAttempts(savedAttempts)
          setLockoutExpiry(savedExpiry)
          setIsLocked(true)
          setRemainingTime(Math.ceil((savedExpiry - now) / 1000))
        } else {
          // Lockout scaduto, reset
          setAttempts(0)
          setIsLocked(false)
          setLockoutExpiry(null)
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error('Error parsing login attempts data:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Timer per aggiornare il tempo rimanente
  useEffect(() => {
    if (!isLocked || !lockoutExpiry) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.ceil((lockoutExpiry - now) / 1000)
      
      if (remaining <= 0) {
        // Lockout scaduto
        setIsLocked(false)
        setAttempts(0)
        setLockoutExpiry(null)
        setRemainingTime(0)
        localStorage.removeItem(STORAGE_KEY)
      } else {
        setRemainingTime(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isLocked, lockoutExpiry])

  // Incrementa il contatore dei tentativi falliti
  const recordFailedAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts >= MAX_ATTEMPTS) {
      const expiry = Date.now() + LOCKOUT_DURATION
      setIsLocked(true)
      setLockoutExpiry(expiry)
      setRemainingTime(Math.ceil(LOCKOUT_DURATION / 1000))
      
      // Salva nel localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        attempts: newAttempts,
        lockoutExpiry: expiry
      }))
    } else {
      // Salva solo i tentativi
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        attempts: newAttempts,
        lockoutExpiry: null
      }))
    }
  }

  // Reset dopo login riuscito
  const resetAttempts = () => {
    setAttempts(0)
    setIsLocked(false)
    setLockoutExpiry(null)
    setRemainingTime(0)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Formatta il tempo rimanente
  const formatRemainingTime = () => {
    if (remainingTime <= 0) return '0:00:00'
    
    const hours = Math.floor(remainingTime / 3600)
    const minutes = Math.floor((remainingTime % 3600) / 60)
    const seconds = remainingTime % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  return {
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    isLocked,
    remainingTime,
    formatRemainingTime,
    recordFailedAttempt,
    resetAttempts,
    canAttemptLogin: !isLocked
  }
}
