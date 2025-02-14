import styles from './ChallengeCard.module.scss'

type ChallengeCardProps = {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, description, selected = false, onClick }) => {
  return (
    <button
      className={`${styles.option} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <h3 className={styles.optionTitle}>{title}</h3>
      <p className={styles.optionDescription}>{description}</p>
    </button>
  )
}
