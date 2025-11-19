import React, { FormEvent, useState } from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../store/secretSlice'
import { SecretService } from '../../../services/api'
import { hashText } from '../../../utils/crypto'
import { SLButton } from '../../../components'
import styles from '../ChallengeForm.module.scss'

interface PasswordFormProps {
  onBack: () => void
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ onBack }) => {
  const { backToOptions, sendingButton, generateButton, challenges: { password: passwordText } } = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)
  const [password, setPassword] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))

    const hashedPassword = await hashText(password)
    const { data, error } = await SecretService.createMessage(
      content,
      'password',
      hashedPassword,
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
          <h2 className={styles.formTitle}>{passwordText.form.label}</h2>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={passwordText.form.placeholder}
              className={styles.input}
              disabled={loading}
            />
          </div>
          <SLButton type="submit" disabled={loading || !password.trim()} loading={loading} center>
            {loading ? sendingButton : generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}
