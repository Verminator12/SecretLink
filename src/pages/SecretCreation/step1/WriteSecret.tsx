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

  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder={t.writeSecret}
          className={styles.input}
          disabled={loading}
        />
        <SLButton disabled={loading || !secret.trim()} loading={loading} onClick={() => dispatch(setContent(secret))}>
          {t.continueButton}
        </SLButton>
      </div>
    </form>
  )
}
