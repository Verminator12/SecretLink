import React from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setWordleWord, setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { SecretService } from '../../../services/api'
import { SLButton } from '../../../components'
import styles from '../ChallengeForm.module.scss'

type WordleFormProps = {
  onBack: () => void
}

export const WordleForm: React.FC<WordleFormProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { wordle: wordleText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { wordleWord, content, loading } = useAppSelector(state => state.secret)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const { data, error } = await SecretService.createMessage(
      content,
      'wordle',
      wordleWord.toUpperCase(),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5 && /^[A-Z]*$/.test(value)) {
      dispatch(setWordleWord(value))
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
              value={wordleWord}
              onChange={handleInputChange}
              placeholder={wordleText.form.placeholder}
              className={styles.input}
              disabled={loading}
              maxLength={5}
              style={{ textAlign: 'center' }}
            />
          </div>
          <SLButton type="submit" disabled={loading || wordleWord.length !== 5} loading={loading} center>
            {loading ? sendingButton : generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}
