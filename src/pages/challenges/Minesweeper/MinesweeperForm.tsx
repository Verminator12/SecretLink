import React, { useState } from 'react'
import { useAppDispatch, useAppSelector, useTranslation } from '../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { SecretService } from '../../../services/api'
import { SLButton } from '../../../components'
import { difficulty } from './utils'
import styles from '../ChallengeForm.module.scss'

interface MinesweeperProps {
  onBack: () => void
}

type Difficulty = keyof typeof difficulty

export const MinesweeperForm: React.FC<MinesweeperProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { minesweeper: minesweeperText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const gameConfig = JSON.stringify({ type: 'minesweeper', difficulty })
    const { data, error } = await SecretService.createMessage(
      content,
      'minesweeper',
      gameConfig,
    )

    if (!error && data) {
      dispatch(setGeneratedMessage(data))
      dispatch(setIsTransitioning(true))
      setTimeout(() => {
        dispatch(setStep('complete'))
        dispatch(setIsTransitioning(false))
      }, 300)
    }

    dispatch(setLoading(false))
  }

  return (
    <>
      <button onClick={onBack} className={styles.backButton}>
        {backToOptions}
      </button>
      <div className={styles.protectionForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{minesweeperText.title}</h2>
          <p className={styles.formDescription}>{minesweeperText.description}</p>

          <div className={styles.inputGroup}>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
              className={styles.input}
              disabled={loading}
            >
              <option value="easy">{minesweeperText.difficulty.easy}</option>
              <option value="medium">{minesweeperText.difficulty.medium}</option>
              <option value="hard">{minesweeperText.difficulty.hard}</option>
            </select>
          </div>

          <SLButton
            type="submit"
            disabled={loading}
            loading={loading}
            center
          >
            {loading ? sendingButton : generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}
