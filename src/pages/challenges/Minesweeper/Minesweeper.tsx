import React, { useState, useEffect, MouseEvent } from 'react'
import styles from './Minesweeper.module.scss'
import { useTranslation } from '../../../hooks'
import { BeforeGame } from '../BeforeGame/BeforeGame'
import { MinesweeperCell, type Cell, CellState } from './Cell'
import { SLButton } from '../../../components'
import { getSurroundingMinesAndFlags, isCellOutOfBounds, shuffle2DArray, surroundingCellsPositions } from './utils'

type MinesweeperProps = {
  parameters: string
  onComplete: () => void
}

const difficulty = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}

export const Minesweeper: React.FC<MinesweeperProps> = ({ parameters, onComplete }) => {
  const { gameName, retry, minesTotal } = useTranslation().challenges.minesweeper

  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [mines, setMines] = useState<number | null>(null)
  const [board, setBoard] = useState<Cell[][]>([])

  const getDifficulty = () => {
    try {
      const protection = JSON.parse(parameters || '{}')
      const level = protection.difficulty as keyof typeof difficulty

      return difficulty[level] || difficulty.easy
    } catch (err) {
      console.error('Error parsing difficulty:', err)
      return difficulty.easy
    }
  }

  const initializeGame = () => {
    const { rows, cols, mines } = getDifficulty()
    let placedMines = 0

    setGameOver(false)
    setMines(mines)

    const newBoard = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, (): Cell => {
        const isMine = placedMines < mines

        if (isMine) {
          placedMines++
        }
        return { isMine, state: CellState.HIDDEN }
      }))

    setBoard(shuffle2DArray(newBoard))
  }

  const onMiddleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    // detect middle click
    if (e.button === 1) {
      initializeGame()
      return false
    }
  }

  const onCellRightClick = (row: number, col: number) => {
    if (gameOver || board[row][col].state === CellState.VISIBLE) {
      return
    }

    const newBoard = [...board]

    if (board[row][col].state === CellState.FLAGGED) {
      setMines(mines !== null ? mines + 1 : null)
      newBoard[row][col].state = CellState.HIDDEN
    } else {
      setMines(mines !== null ? mines - 1 : null)
      newBoard[row][col].state = CellState.FLAGGED
    }
    setBoard(newBoard)
  }

  const revealBoard = () => {
    const newBoard = board.map(row => row.map(cell => cell.isMine ? { ...cell, state: CellState.VISIBLE } : cell))
    setBoard(newBoard)
  }

  const onCellClick = (row: number, col: number) => {
    if (gameOver) {
      return
    }

    if (board[row][col].isMine) {
      revealBoard()
      setGameOver(true)
      return
    }

    const { minesAround, flagsAround } = getSurroundingMinesAndFlags(row, col, board)
    const newBoard = [...board]

    if (board[row][col].state === CellState.FLAGGED) {
      return
    }

    newBoard[row][col].state = CellState.VISIBLE

    if (minesAround === 0) {
      surroundingCellsPositions(row, col).forEach(([r, c]) => {
        if (isCellOutOfBounds(r, c, board)) {
          return
        }

        if (board[r][c].state === CellState.VISIBLE) {
          return
        }

        const { minesAround: minesAroundCellToCheck } = getSurroundingMinesAndFlags(r, c, board)

        newBoard[r][c].state = CellState.VISIBLE

        // if cell has no mines around it, recursively reveal surrounding cells
        if (minesAroundCellToCheck === 0) {
          onCellClick(r, c)
          return
        }
      })
    }

    setBoard(newBoard)

    // reveal surrounding of visible cells with the same number of surrounding mines and flags
    if (board[row][col].state === CellState.VISIBLE && minesAround > 0 && flagsAround === minesAround) {
      revealSurroundingCells(row, col)
    }
  }

  const revealSurroundingCells = (row: number, col: number) => {
    const newBoard = [...board]
    let revealedAMine = false

    surroundingCellsPositions(row, col).forEach(([r, c]) => {
      if (isCellOutOfBounds(r, c, board)) {
        return
      }

      if (board[r][c].state !== CellState.HIDDEN) {
        return
      }

      newBoard[r][c].state = CellState.VISIBLE

      if (board[r][c].isMine) {
        revealedAMine = true
      }
    })

    setBoard(newBoard)

    if (revealedAMine) {
      revealBoard()
      setGameOver(true)
    }
  }

  useEffect(() => {
    if (board.length === 0 || !isPlaying) {
      return
    }

    if (board.length > 0 && board.every(row => row.every(cell =>
      cell.state === CellState.VISIBLE || (!cell.state.includes(CellState.VISIBLE) && cell.isMine)))
    ) {
      onComplete()
    }
  }, [board])

  useEffect(() => {
    if (isPlaying) {
      initializeGame()
    }
  }, [isPlaying])

  if (!isPlaying) {
    return (
      <BeforeGame gameName={gameName} onPlay={() => setIsPlaying(true)} />
    )
  }

  return (
    <div className={styles.game}>
      <div className={styles.gameHeader}>
        <div className={styles.stat}>
          {mines !== null && <span className={styles.value}>{minesTotal.replace('{mines}', mines.toString())}</span>}
        </div>
      </div>

      <div
        className={`${styles.board} ${styles.prevent_text_selection}`}
        style={{ gridTemplateColumns: `repeat(${board[0]?.length}, 1fr)` }}
        onAuxClick={onMiddleClick}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={e => e.preventDefault()}
      >
        {board.map((cells, rowIndex) => {
          return cells.map((cell, colIndex) => {
            const { minesAround } = getSurroundingMinesAndFlags(rowIndex, colIndex, board)

            return (
              <MinesweeperCell
                key={`cell-${rowIndex}-${colIndex}`}
                cell={{ ...cell }}
                minesAround={minesAround}
                size={difficulty.easy.cols === board[0].length ? 'large' : 'small'}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onToggleFlag={() => onCellRightClick(rowIndex, colIndex)}
              />
            )
          })
        })}
      </div>
      {gameOver && <SLButton onClick={() => initializeGame()}>{retry}</SLButton>}
    </div>
  )
}
