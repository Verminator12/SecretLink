import React, { useState } from 'react'
import { useAppDispatch, useAppSelector, useTranslation } from '../../../hooks'
import { SecretService } from '../../../services/api'
import { SLButton } from '../../../components'
import styles from '../ChallengeForm.module.scss'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { hashText } from '../../../utils/crypto'

interface RiddleFormProps {
  onBack: () => void
}

export const RiddleForm: React.FC<RiddleFormProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { riddle: riddleText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)
  const [riddle, setRiddle] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const hashedAnswer = await hashText(answer.trim().toLowerCase())
    const riddleData = JSON.stringify({
      riddle: riddle.trim(),
      answer: hashedAnswer,
    })

    const { data, error } = await SecretService.createMessage(
      content,
      'riddle',
      riddleData,
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
          <h2 className={styles.formTitle}>{riddleText.form.label}</h2>
          <div className={styles.inputGroup}>
            <textarea
              value={riddle}
              onChange={e => setRiddle(e.target.value)}
              placeholder={riddleText.form.placeholder}
              className={`${styles.input} ${styles.textarea}`}
              disabled={loading}
              rows={4}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder={riddleText.form.answerPlaceholder}
              className={styles.input}
              disabled={loading}
            />
          </div>
          <SLButton
            type="submit"
            disabled={loading || !riddle.trim() || !answer.trim()}
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
