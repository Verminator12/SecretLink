import React from 'react'
import { Lock } from 'lucide-react'
import styles from './AnimatedLock.module.scss'

interface AnimatedLockProps {
  isUnlocking: boolean
}

export const AnimatedLock: React.FC<AnimatedLockProps> = ({ isUnlocking }) => {
  return (
    <div className={`${styles.lockContainer} ${isUnlocking ? styles.unlocking : ''}`}>
      <div className={styles.shackle} />
      <div className={styles.lockBody}>
      </div>
    </div>
  )
}