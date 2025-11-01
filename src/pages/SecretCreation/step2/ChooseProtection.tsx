import React from 'react'
import { useTranslation } from '../../../hooks/useTranslation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import styles from './ChooseProtection.module.scss'
import { ChallengeCard } from '../../challenges'
import { ProtectionType } from '../../../types'
import { setProtectionType } from '../../../store/secretSlice'

type ChooseProtectionProps = {
  onBack: () => void
}

const challenges: ProtectionType[] = [
  'password',
  'memory',
  'riddle',
  'minesweeper',
]

export const ChooseProtection: React.FC<ChooseProtectionProps> = ({
  onBack,
}) => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const { protectionType } = useAppSelector(state => state.secret)

  return (
    <>
      <button onClick={onBack} className={styles.backButton}>
        {t.back}
      </button>
      <h2 className={styles.formTitle}>{t.protectionType}</h2>
      <div className={styles.protectionOptions}>
        {challenges.map((name) => {
          return (
            <ChallengeCard
              key={name}
              title={t.challenges[name].title}
              description={t.challenges[name].description}
              selected={protectionType === name}
              onClick={() => dispatch(setProtectionType(name))}
            />
          )
        })}
      </div>
    </>
  )
}
