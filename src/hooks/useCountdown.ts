import { useState, useEffect } from 'react'

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
  total: number | null
}

export function useCountdown(targetDate: Date | null): TimeRemaining {
  const calculateTimeRemaining = (): TimeRemaining => {
    if (targetDate === null) {
       return { hours: 0, minutes: 0, seconds: 0, total: null }
    }
    const total = new Date(targetDate).getTime() - Date.now()
    
    if (total <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor(total / 1000 / 60 / 60)

    return { hours, minutes, seconds, total }
  }

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeRemaining
}