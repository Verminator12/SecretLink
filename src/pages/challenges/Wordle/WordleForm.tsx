import React, { useState } from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { SecretService } from '../../../services/api'
import { SLButton } from '../../../components'
import { isValidWord } from '../../../utils/wordList'
import styles from '../ChallengeForm.module.scss'
import { encryptText } from '../../../utils/crypto'

type WordleFormProps = {
  onBack: () => void
}

export const WordleForm: React.FC<WordleFormProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { wordle: wordleText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)
  const [error, setError] = useState<string | null>(null)
  const [word, setWord] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidWord(word)) {
      setError(wordleText.invalidWord)
      return
    }

    setError(null)
    dispatch(setLoading(true))

    const { encryptedData, key } = await encryptText(word.toLocaleUpperCase())
    const gameConfig = JSON.stringify({ type: 'wordle', word: { data: encryptedData, key: key }, attemps: 6 })
    const { data, error: apiError } = await SecretService.createMessage(
      content,
      'wordle',
      gameConfig,
    )

    if (!apiError && data) {
      dispatch(setGeneratedMessage(data))
      dispatch(setIsTransitioning(true))
      setTimeout(() => {
        dispatch(setStep('complete'))
        dispatch(setIsTransitioning(false))
      }, 300)
    }

    dispatch(setLoading(false))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5 && /^[A-Z]*$/.test(value)) {
      setWord(value)
      setError(null)
    }
  }

  return (
    <>
      <button onClick={onBack} className={styles.backButton}>
        {backToOptions}
      </button>
      <div className={styles.protectionForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{wordleText.form.label}</h2>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={word}
              onChange={handleInputChange}
              placeholder={wordleText.form.placeholder}
              className={styles.input}
              disabled={loading}
              maxLength={5}
              style={{ textAlign: 'center' }}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <SLButton type="submit" disabled={loading || word.length !== 5} loading={loading} center>
            {loading ? sendingButton : generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}
