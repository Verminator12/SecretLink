import React, { useState } from 'react'
import { useTranslation } from '../../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../../store/messageSlice'
import { MessageService } from '../../../../services/api'
import { hashText } from '../../../../utils/crypto'
import { SLButton } from '../../../../components/SLButton'
import styles from '../ProtectionDetails.module.scss'

interface RiddleFormProps {
  onBack: () => void
}

export const RiddleForm: React.FC<RiddleFormProps> = ({ onBack }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.message)
  const [riddle, setRiddle] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const hashedAnswer = await hashText(answer.trim().toLowerCase())
    const riddleData = JSON.stringify({
      riddle: riddle.trim(),
      answer: hashedAnswer
    })

    const { data, error } = await MessageService.createMessage(
      content,
      'riddle',
      riddleData
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
          <h2 className={styles.formTitle}>{t.riddleLabel}</h2>
          <div className={styles.inputGroup}>
            <textarea
              value={riddle}
              onChange={(e) => setRiddle(e.target.value)}
              placeholder={t.riddlePlaceholder}
              className={`${styles.input} ${styles.textarea}`}
              disabled={loading}
              rows={4}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.answerPlaceholder}
              className={styles.input}
              disabled={loading}
            />
          </div>
          <SLButton 
            disabled={loading || !riddle.trim() || !answer.trim()} 
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