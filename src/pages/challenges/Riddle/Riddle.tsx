import React, { useState } from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { hashText } from '../../../utils/crypto'
import { SLButton } from '../../../components'
import styles from './Riddle.module.scss'

type RiddleProps = {
  parameters: string
  onComplete: () => void
}

export const Riddle: React.FC<RiddleProps> = ({ parameters, onComplete }) => {
  const t = useTranslation()
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSolved, setIsSolved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const protection = JSON.parse(parameters || '{}')

      if (!protection.riddle || !protection.answer) {
        throw new Error('Invalid riddle data')
      }

      const hashedAnswer = await hashText(answer.toLowerCase().trim())

      if (hashedAnswer === protection.answer) {
        setIsSolved(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      } else {
        setError(t.incorrectAnswer)
        setAnswer('')
      }
    } catch (err) {
      console.error('Error parsing riddle data:', err)
      setError('An error occurred. Please try again.')
    }
  }

  let riddleText = ''
  try {
    const protection = JSON.parse(parameters || '{}')
    riddleText = protection.riddle || ''
  } catch (err) {
    console.error('Error parsing riddle text:', err)
  }

  return (
    <div className={styles.riddleChallenge}>
      <div className={styles.iconContainer}>
        <span className={`${styles.icon} ${styles.thinking} ${isSolved ? styles.hide : ''}`}>
          🤔
        </span>
        <span className={`${styles.icon} ${styles.solved} ${isSolved ? styles.show : ''}`}>
          🤓
        </span>
      </div>
      <h2 className={styles.title}>{t.solveRiddle}</h2>
      <p className={styles.description}>{t.riddleDescription}</p>

      {riddleText && (
        <div className={styles.riddle}>
          {riddleText}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder={t.riddleAnswerPlaceholder}
            className={styles.input}
            disabled={isSolved}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <SLButton type="submit" disabled={!answer.trim() || isSolved} loading={isSolved} center>
          {t.checkAnswer}
        </SLButton>
      </form>
    </div>
  )
}
