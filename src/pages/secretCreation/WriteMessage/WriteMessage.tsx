import React from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setContent } from '../../../store/messageSlice'
import { SLButton } from '../../../components/SLButton'
import styles from './WriteMessage.module.scss'

interface WriteMessageProps {
  onSubmit: (e: React.FormEvent) => void
}

export const WriteMessage: React.FC<WriteMessageProps> = ({ onSubmit }) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { content, loading } = useAppSelector(state => state.message)

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={content}
          onChange={(e) => dispatch(setContent(e.target.value))}
          placeholder={t.writeSecret}
          className={styles.input}
          disabled={loading}
        />
        <SLButton disabled={loading || !content.trim()} loading={loading}>
          {t.continueButton}
        </SLButton>
      </div>
    </form>
  )
}