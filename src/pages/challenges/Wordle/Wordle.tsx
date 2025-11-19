import React, { FormEvent, JSX, useState } from 'react'
import { useTranslation } from '../../../hooks'
import { SLButton } from '../../../components'
import { isValidWord } from '../../../utils/wordList'
import styles from './Wordle.module.scss'
import { getWordleParameters } from './utils'

type WordleProps = {
  parameters: string
  onComplete: () => void
}

type CellStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent'

type GuessRow = {
  letters: string[]
  statuses: CellStatus[]
}

export const Wordle: React.FC<WordleProps> = ({ parameters, onComplete }) => {
  const t = useTranslation()
  const {  } = getWordleParameters(parameters)

  const [guesses, setGuesses] = useState<GuessRow[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const checkGuess = (guess: string): GuessRow => {
    const letters = guess.toUpperCase().split('')
    const statuses: CellStatus[] = Array(5).fill('absent')
    const targetLetters = word.split('')
    const targetLetterCounts: Record<string, number> = {}

    targetLetters.forEach((letter) => {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1
    })

    letters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        statuses[i] = 'correct'
        targetLetterCounts[letter]--
      }
    })

    letters.forEach((letter, i) => {
      if (statuses[i] === 'correct') return
      if (targetLetters.includes(letter) && targetLetterCounts[letter] > 0) {
        statuses[i] = 'present'
        targetLetterCounts[letter]--
      }
    })

    return { letters, statuses }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (currentGuess.length !== 5) {
      setError(t.challenges.wordle.invalidWord)
      return
    }

    if (!isValidWord(currentGuess)) {
      setError(t.challenges.wordle.notInWordList)
      return
    }

    const guessRow = checkGuess(currentGuess)
    const newGuesses = [...guesses, guessRow]
    setGuesses(newGuesses)
    setCurrentGuess('')

    if (currentGuess.toUpperCase() === word) {
      setWon(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5 && /^[A-Z]*$/.test(value)) {
      setCurrentGuess(value)
      setError(null)
    }
  }

  const handleRetry = () => {
    setGuesses([])
    setCurrentGuess('')
    setError(null)
    setGameOver(false)
    setWon(false)
  }

  const renderGrid = () => {
    const rows: JSX.Element[] = []

    guesses.forEach((guess, rowIndex) => {
      rows.push(
        <div key={rowIndex} className={styles.row}>
          {guess.letters.map((letter, cellIndex) => (
            <div
              key={cellIndex}
              className={`${styles.cell} ${styles[guess.statuses[cellIndex]]}`}
            >
              {letter}
            </div>
          ))}
        </div>,
      )
    })

    if (!gameOver && !won) {
      const currentRow = (
        <div key="current" className={styles.row}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`${styles.cell} ${currentGuess[i] ? styles.filled : ''
              } ${i === currentGuess.length ? styles.current : ''}`}
            >
              {currentGuess[i] || ''}
            </div>
          ))}
        </div>
      )
      rows.push(currentRow)

      const emptyRows = maxAttempts - guesses.length - 1
      for (let i = 0; i < emptyRows; i++) {
        rows.push(
          <div key={`empty-${i}`} className={styles.row}>
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className={styles.cell}></div>
            ))}
          </div>,
        )
      }
    }

    return rows
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.challenges.wordle.gameName}</h2>
      <p className={styles.attemptsText}>
        {t.challenges.wordle.attemptsLeft.replace(
          '{attempts}',
          `${guesses.length}`,
        )}
      </p>

      <div className={styles.grid}>{renderGrid()}</div>

      {!gameOver && !won && (
        <div className={styles.inputContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              value={currentGuess}
              onChange={handleInputChange}
              placeholder={t.challenges.wordle.guessPlaceholder}
              className={styles.input}
              autoFocus
              maxLength={5}
            />
            {error && <p className={styles.error}>{error}</p>}
            <SLButton
              type="submit"
              disabled={currentGuess.length !== 5}
              center
            >
              {t.challenges.wordle.submit}
            </SLButton>
          </form>
        </div>
      )}

      {gameOver && (
        <div className={styles.gameOver}>
          <p>
            {t.challenges.wordle.gameOver.replace('{word}', word)}
          </p>
          <SLButton type="button" onClick={handleRetry} center>
            {t.challenges.wordle.retry}
          </SLButton>
        </div>
      )}
    </div>
  )
}
