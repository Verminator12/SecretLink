import React, { useState, useEffect } from 'react'
import styles from './Minesweeper.module.scss'
import { useTranslation } from '../../../hooks'
import { BeforeGame } from '../BeforeGame/BeforeGame'

type MinesweeperProps = {
  parameters: string
  onComplete: () => void
}

type Tile = {
  value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'bomb'
  visible: boolean
  isFlagged: boolean
}

export const Minesweeper: React.FC<MinesweeperProps> = ({ parameters, onComplete }) => {
  const t = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [board, setBoard] = useState<Tile[][]>([[]])

  // const getDifficulty = () => {
  //   try {
  //     const protection = JSON.parse(parameters || '{}')
  //     return protection.difficulty as string || 'easy'
  //   } catch (err) {
  //     console.error('Error parsing difficulty:', err)
  //     return 'easy'
  //   }
  // }

  const initializeGame = () => {
    // const difficulty = getDifficulty()

    const newBoard = Array.from({ length: 5 }, () => {
      return Array.from({ length: 5 }, () => {
        return {
          value: (Math.random() * 9).toFixed(0) as Tile['value'],
          visible: false,
          isFlagged: false,
        }
      })
    })

    setBoard(newBoard)
  }

  useEffect(() => {
    if (isPlaying) {
      initializeGame()
    }
  }, [isPlaying])

  if (!isPlaying) {
    return (
      <BeforeGame gameName={t.challenges.minesweeper.gameName} onPlay={() => setIsPlaying(true)} />
    )
  }

  return (
    <div className={styles.game}>
      <div className={styles.gameHeader}>
        <div className={styles.stat}>
          <span className={styles.label}>{t.moves}</span>
          {/* <span className={styles.value}>{moves}</span> */}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t.pairs}</span>
          {/* <span className={styles.value}>
            {matchedPairs}
            /6
          </span> */}
        </div>
      </div>

      <div className={styles.grid}>
        {board.map((tile, index) => <div key={index}>{tile.map(tile => tile.value)}</div>)}
      </div>
    </div>
  )
}
