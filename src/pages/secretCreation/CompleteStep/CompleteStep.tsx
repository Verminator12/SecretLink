import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppSelector } from '../../../hooks'
import { SubmitButton } from '../../../components/SubmitButton'
import styles from './CompleteStep.module.scss'

interface CompleteStepProps {
  onRestart: () => void
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ onRestart }) => {
  const t = useTranslation()
  const [isCopied, setIsCopied] = useState(false)
  const { generatedMessage } = useAppSelector(state => state.message)
  const fullLink = `${window.location.origin}?m=${generatedMessage?.slug}`

  const copyMessageLink = () => {
    if (!generatedMessage?.slug) return
    navigator.clipboard.writeText(fullLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className={styles.completeStep}>
      <h2 className={styles.completeTitle}>{t.secretGenerated}</h2>
      <div className={styles.messageCard}>
        <p className={styles.messageContent}>{generatedMessage?.content}</p>
        <div className={styles.urlContainer}>
          <p className={styles.messageUrl}>
            {fullLink}
          </p>
          <button 
            onClick={copyMessageLink} 
            className={styles.copyButton}
            title={t.copyLink}
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
      <button onClick={onRestart} className={styles.restartButton}>
        {t.createNewSecret}
      </button>
    </div>
  )
}