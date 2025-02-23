import React, { useState, useEffect, MouseEvent } from 'react'
import styles from './Minesweeper.module.scss'
import { useTranslation } from '../../../hooks'
import { BeforeGame } from '../BeforeGame/BeforeGame'
import { MinesweeperCell, type Cell, CellState } from './Cell'
import { SLButton } from '../../../components'
import { difficulty, getBoardParameters, getSurroundingMinesAndFlags, isCellOutOfBounds, shuffle2DArray, surroundingCellsPositions } from './utils'

type MinesweeperProps = {
  parameters: string
  onComplete: () => void
}

export const Minesweeper: React.FC<MinesweeperProps> = ({ parameters, onComplete }) => {
  const { gameName, retry, minesTotal } = useTranslation().challenges.minesweeper

  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setGameOver] = useState(false)

  const [board, setBoard] = useState<Cell[][]>([])
  const { rows, cols, mines } = getBoardParameters(parameters)
  const [score, setScore] = useState(mines)

  const initializeGame = () => {
    let placedMines = 0

    setGameOver(false)
    setScore(mines)

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

  const revealMines = () => {
    const newBoard = board.map(row => row.map(cell =>
      cell.isMine && cell.state === CellState.HIDDEN ? { ...cell, state: CellState.VISIBLE } : cell))
    setBoard(newBoard)
  }

  const revealSurroundingCells = (row: number, col: number) => {
    surroundingCellsPositions(row, col).forEach(([r, c]) => {
      // check for out of bounds
      if (isCellOutOfBounds(r, c, board)) {
        return
      }

      // visible and flagged cells can't be revealed
      if (board[r][c].state !== CellState.HIDDEN) {
        return
      }

      const newBoard = [...board]

      newBoard[r][c].state = CellState.VISIBLE
      setBoard(newBoard)

      if (board[r][c].isMine) {
        setGameOver(true)
      }

      const { minesAround } = getSurroundingMinesAndFlags(r, c, board)

      // check for empty surrounding cells and reveal them
      if (minesAround === 0) {
        revealSurroundingCells(r, c)
      }
    })
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
    const cellState = board[row][col].state

    if (isGameOver || cellState === CellState.VISIBLE) {
      return
    }

    const newBoard = [...board]

    if (cellState === CellState.FLAGGED) {
      newBoard[row][col].state = CellState.HIDDEN
      setScore(score + 1)
    } else {
      newBoard[row][col].state = CellState.FLAGGED
      setScore(score - 1)
    }

    setBoard(newBoard)
  }

  const onCellClick = (row: number, col: number) => {
    const { minesAround, flagsAround } = getSurroundingMinesAndFlags(row, col, board)
    const isChordValid = board[row][col].state === CellState.VISIBLE && minesAround > 0 && flagsAround === minesAround

    if (isGameOver || board[row][col].state === CellState.FLAGGED) {
      return
    }

    if (board[row][col].isMine) {
      setGameOver(true)
      return
    }

    // reveal surrounding cells for valid chords and empty cells
    if (minesAround === 0 || isChordValid) {
      revealSurroundingCells(row, col)
    }

    const newBoard = [...board]

    newBoard[row][col].state = CellState.VISIBLE
    setBoard(newBoard)
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
    if (isGameOver) {
      revealMines()
    }
  }, [isGameOver])

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
          {mines !== null && <span className={styles.value}>{minesTotal.replace('{mines}', score.toString())}</span>}
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

      <div className={styles.gameFooter}>
        {isGameOver && <SLButton onClick={() => initializeGame()}>{retry}</SLButton>}
      </div>
    </div>
  )
}
