import React from 'react'
import { useTranslation } from '../../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../../store/messageSlice'
import { MessageService } from '../../../../services/api'
import { SLButton } from '../../../../components/SLButton'
import styles from '../ProtectionDetails.module.scss'

interface GameFormProps {
  onBack: () => void
}

export const GameForm: React.FC<GameFormProps> = ({ onBack }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.message)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const gameConfig = JSON.stringify({ type: 'memory', pairs: 6 })
    const { data, error } = await MessageService.createMessage(
      content,
      'game',
      gameConfig
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
        {t.backToOptions}
      </button>
      <div className={styles.protectionForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{t.gameOption}</h2>
          <p className={styles.formDescription}>{t.gameDescriptionCreation}</p>
          <SLButton
            disabled={loading}
            loading={loading}
            center
          >
            {loading ? t.sendingButton : t.generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}