import React from 'react'
import { useAppDispatch, useAppSelector, useTranslation } from '../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { SecretService } from '../../../services/api'
import { SLButton } from '../../../components'
import styles from '../ChallengeForm.module.scss'

interface MemoryFormProps {
  onBack: () => void
}

export const MemoryForm: React.FC<MemoryFormProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { memory: memoryText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const gameConfig = JSON.stringify({ type: 'memory', pairs: 6 })
    const { data, error } = await SecretService.createMessage(
      content,
      'memory',
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
          <h2 className={styles.formTitle}>{memoryText.title}</h2>
          <p className={styles.formDescription}>{memoryText.description}</p>
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
