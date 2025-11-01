import { useState, useEffect } from 'react'

type TimeRemaining = {
  hours: number
  minutes: number
  seconds: number
  total: number | null
}

const defaultTimeRemaining: TimeRemaining = { hours: 0, minutes: 0, seconds: 0, total: null }

export const useCountdown = (targetDate: Date | null): TimeRemaining => {
  const calculateTimeRemaining = (now: number): TimeRemaining => {
    if (targetDate === null) {
      return defaultTimeRemaining
    }
    const total = new Date(targetDate).getTime() - now

    if (total <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor(total / 1000 / 60 / 60)

    return { hours, minutes, seconds, total }
  }

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(defaultTimeRemaining)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(Date.now()))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeRemaining
}
