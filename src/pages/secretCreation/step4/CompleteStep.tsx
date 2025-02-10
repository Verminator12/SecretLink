import React, { useState } from 'react'
import { LuCopy, LuCheck } from 'react-icons/lu'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppSelector } from '../../../hooks'
import styles from './CompleteStep.module.scss'
import { SLButton } from '../../../components/SLButton'

interface CompleteStepProps {
  onRestart: () => void
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ onRestart }) => {
  const t = useTranslation()
  const [isCopied, setIsCopied] = useState(false)
  const { generatedMessage } = useAppSelector(state => state.secret)
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
          <SLButton
            onClick={copyMessageLink}
            className={styles.copyButton}
            title={t.copyLink}
            center
          >
            {isCopied ? <LuCheck size={20} /> : <LuCopy size={20} />}
          </SLButton>
        </div>
      </div>
      <SLButton onClick={onRestart} className={styles.restartButton}>
        {t.createNewSecret}
      </SLButton>
    </div>
  )
}
