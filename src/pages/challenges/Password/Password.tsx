import React, { useState } from 'react'
import { useTranslation } from '../../../hooks'
import { hashText } from '../../../utils/crypto'
import { AnimatedLock } from './AnimatedLock'
import { SLButton } from '../../../components'
import styles from './Password.module.scss'

interface PasswordProps {
  parameters: string
  onComplete: () => void
}

export const Password: React.FC<PasswordProps> = ({
  parameters,
  onComplete,
}) => {
  const t = useTranslation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hashedPassword = await hashText(password)
    if (hashedPassword === parameters) {
      setIsUnlocking(true)
      setTimeout(() => {
        onComplete()
      }, 1000)
    } else {
      setError(t.incorrectPassword)
      setPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.iconContainer}>
        <AnimatedLock isUnlocking={isUnlocking} />
      </div>
      <h2 className={styles.title}>{t.enterPassword}</h2>
      <div className={styles.inputGroup}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={t.challenges.password.form.placeholder}
          className={styles.input}
          disabled={isUnlocking}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <SLButton type="submit" disabled={!password.trim() || isUnlocking} loading={isUnlocking} center>
        {t.unlockSecret}
      </SLButton>
    </form>
  )
}
