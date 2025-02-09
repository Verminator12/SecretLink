import React from 'react'
import { useTranslation } from '../../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { setPassword, setGeneratedMessage, setStep, setIsTransitioning, setLoading } from '../../../../store/messageSlice'
import { SecretService } from '../../../../services/api'
import { hashText } from '../../../../utils/crypto'
import { SLButton } from '../../../../components/SLButton'
import styles from '../ProtectionDetails.module.scss'

interface PasswordFormProps {
  onBack: () => void
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ onBack }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { password, content, loading } = useAppSelector(state => state.message)

  const handleSubmit = async (e: React.FormEvent) => {
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
        {t.backToOptions}
      </button>
      <div className={styles.protectionForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{t.passwordLabel}</h2>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={e => dispatch(setPassword(e.target.value))}
              placeholder={t.passwordPlaceholder}
              className={styles.input}
              disabled={loading}
            />
          </div>
          <SLButton type="submit" disabled={loading || !password.trim()} loading={loading} center>
            {loading ? t.sendingButton : t.generateButton}
          </SLButton>
        </form>
      </div>
    </>
  )
}
