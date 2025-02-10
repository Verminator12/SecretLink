import React from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setContent } from '../../../store/secretSlice'
import { SLButton } from '../../../components/SLButton'
import styles from './WriteSecret.module.scss'

interface WriteSecretProps {
  onSubmit: (e: React.FormEvent) => void
}

export const WriteSecret: React.FC<WriteSecretProps> = ({ onSubmit }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.secret)

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={content}
          onChange={e => dispatch(setContent(e.target.value))}
          placeholder={t.writeSecret}
          className={styles.input}
          disabled={loading}
        />
        <SLButton type="submit" disabled={loading || !content.trim()} loading={loading}>
          {t.continueButton}
        </SLButton>
      </div>
    </form>
  )
}
