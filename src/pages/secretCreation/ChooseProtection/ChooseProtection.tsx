import React from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setProtectionType } from '../../../store/messageSlice'
import { SubmitButton } from '../../../components/SubmitButton'
import styles from './ChooseProtection.module.scss'

interface ChooseProtectionProps {
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export const ChooseProtection: React.FC<ChooseProtectionProps> = ({ 
  onSubmit,
  onBack
}) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { protectionType, loading } = useAppSelector(state => state.message)

  return (
    <>
      <button onClick={onBack} className={styles.backButton}>
        {t.back}
      </button>
      <h2 className={styles.formTitle}>{t.protectionType}</h2>
      <div className={styles.protectionOptions}>
        <button
          className={`${styles.option} ${protectionType === 'password' ? styles.selected : ''}`}
          onClick={() => dispatch(setProtectionType('password'))}
        >
          <h3 className={styles.optionTitle}>{t.passwordOption}</h3>
          <p className={styles.optionDescription}>{t.passwordDescription}</p>
        </button>
        <button
          className={`${styles.option} ${protectionType === 'game' ? styles.selected : ''}`}
          onClick={() => dispatch(setProtectionType('game'))}
        >
          <h3 className={styles.optionTitle}>{t.gameOption}</h3>
          <p className={styles.optionDescription}>{t.gameDescriptionCreation}</p>
        </button>
        <button
          className={`${styles.option} ${protectionType === 'riddle' ? styles.selected : ''}`}
          onClick={() => dispatch(setProtectionType('riddle'))}
        >
          <h3 className={styles.optionTitle}>{t.riddleOption}</h3>
          <p className={styles.optionDescription}>{t.riddleDescriptionCreation}</p>
        </button>
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <button
          type="submit"
          disabled={!protectionType}
          className={styles.button}
        >
          {t.continueButton}
        </button>
      </form>
    </>
  )
}