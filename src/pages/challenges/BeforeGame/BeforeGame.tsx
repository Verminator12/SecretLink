import { LuGamepad2 } from 'react-icons/lu'
import { useTranslation } from '../../../hooks'
import styles from './BeforeGame.module.scss'
import { SLButton } from '../../../components'

type BeforeGameProps = {
  gameName: string
  onPlay: () => void
}

export const BeforeGame: React.FC<BeforeGameProps> = ({ gameName, onPlay }) => {
  const t = useTranslation()

  return (
    <div className={styles.gameChallenge}>
      <div className={styles.iconContainer}>
        <LuGamepad2 className={styles.icon} />
      </div>
      <h2 className={styles.title}>{t.beforeGame.title}</h2>
      <p className={styles.description}>{t.beforeGame.description.replace('{game}', gameName)}</p>
      <SLButton
        onClick={onPlay}
        variant="game"
        type="button"
        center
      >
        {t.beforeGame.startGame}
      </SLButton>
    </div>
  )
}
