import React, { useState, useEffect, useCallback } from 'react'
import { LuClock } from 'react-icons/lu'
import { SecretService } from '../../services/api'
import { Password, Memory, Riddle } from '../challenges'
import { useTranslation } from '../../hooks/useTranslation'
import { useCountdown } from '../../hooks/useCountdown'
import { SLButton } from '../../components/SLButton'
import type { Secret } from '../../types'
import styles from './SecretReveal.module.scss'
import { setCurrentSlug } from '../../store/secretSlice'
import { useAppDispatch } from '../../hooks'

interface SecretRevealProps {
  slug: string
}

export const SecretReveal: React.FC<SecretRevealProps> = ({ slug }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState<Secret | null>(null)
  const [expirationDate, setExpirationDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const { hours, minutes, seconds, total } = useCountdown(expirationDate)

  const handleMessageExpiration = useCallback(async (messageId: string) => {
    setError(t.secretExpired)
    try {
      await SecretService.deleteMessage(messageId)
    } catch (err) {
      console.error('Error deleting expired message:', err)
    }
  }, [t])

  const onBack = () => {
    dispatch(setCurrentSlug(null))
    window.history.pushState({}, '', window.location.pathname)
  }

  const fetchMessage = async () => {
    const { data, error } = await SecretService.fetchMessageBySlug(slug)

    if (error || !data) {
      setError(t.secretNotFound)
    } else {
      const expDate = new Date(data.expiration_date)
      setExpirationDate(expDate)

      if (expDate.getTime() <= Date.now()) {
        await handleMessageExpiration(data.id)
      } else {
        setMessage(data)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchMessage()
  }, [slug, t, handleMessageExpiration])

  useEffect(() => {
    if (total === 0 && message?.id) {
      handleMessageExpiration(message.id)
    }
  }, [total, message, handleMessageExpiration])

  // Handle confetti cleanup with fade out
  useEffect(() => {
    if (showConfetti) {
      // Start fade out after 2.2 seconds
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true)
      }, 2200)

      // Remove confetti after fade out completes
      const cleanupTimer = setTimeout(() => {
        setShowConfetti(false)
        setIsFadingOut(false)
      }, 3000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(cleanupTimer)
      }
    }
  }, [showConfetti])

  const handleChallengeComplete = () => {
    setShowConfetti(true)
    setIsUnlocked(true)
  }

  const formatNumber = (n: number): string => n.toString().padStart(2, '0')

  const renderChallenge = () => {
    if (!message) return null

    switch (message.protection_type) {
      case 'password':
        return (
          <Password
            message={message}
            onComplete={handleChallengeComplete}
          />
        )
      case 'game':
        return (
          <Memory
            message={message}
            onComplete={handleChallengeComplete}
            t={t}
          />
        )
      case 'riddle':
        return (
          <Riddle
            message={message}
            onComplete={handleChallengeComplete}
          />
        )
      default:
        return null
    }
  }

  const renderConfetti = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className={`${styles.confetti} ${isFadingOut ? styles.fadeOut : ''}`}
      />
    ))
  }

  return (
    <div className={styles.container}>
      {showConfetti && renderConfetti()}
      {isUnlocked && <div className={styles.successOverlay} />}

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t.secretForYou}</h1>
        </div>

        {total !== null && total > 0 && message && (
          <div className={styles.expirationTimer}>
            <LuClock className={styles.clockIcon} />
            <span className={styles.timerText}>
              {t.expiresIn.replace(
                '{time}',
                `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`,
              )}
            </span>
          </div>
        )}

        <div className={styles.messageContainer}>
          {loading
            ? (
                <div className={styles.loading}>{t.loading}</div>
              )
            : error
              ? (
                  <div className={styles.error}>
                    <p>{error}</p>
                    <SLButton onClick={onBack} type="button" center>
                      {t.createYourSecret}
                    </SLButton>
                  </div>
                )
              : message
                ? (
                    isUnlocked
                      ? (
                          <>
                            <div className={styles.messageCard}>
                              <p className={styles.messageContent}>{message.content}</p>
                            </div>
                            <div className={styles.createButtonContainer}>
                              <SLButton onClick={onBack} type="button" center>
                                {t.createYourSecret}
                              </SLButton>
                            </div>
                          </>
                        )
                      : (
                          <div className={styles.challenge}>
                            {renderChallenge()}
                          </div>
                        )
                  )
                : null}
        </div>
      </div>
    </div>
  )
}
