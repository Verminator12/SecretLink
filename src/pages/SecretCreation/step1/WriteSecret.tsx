import React, { useState } from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setContent } from '../../../store/secretSlice'
import { SLButton } from '../../../components'
import styles from './WriteSecret.module.scss'

export const WriteSecret: React.FC = () => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const [secret, setSecret] = useState('')
  const { loading } = useAppSelector(state => state.secret)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setContent(secret))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder={t.writeSecret}
          className={styles.input}
          disabled={loading}
        />
        <SLButton type="submit" disabled={loading || !secret.trim()} loading={loading}>
          {t.continueButton}
        </SLButton>
      </div>
    </form>
  )
}
