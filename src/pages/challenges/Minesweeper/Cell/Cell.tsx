import React from 'react'
import styles from './Cell.module.scss'
import { Cell, CellState } from './types'

type CellProps = {
  cell: Cell
  minesAround: number
  size: 'small' | 'large'
  onClick: () => void
  onToggleFlag: () => void
}

const colorsByMinesAround = ['', 'blue', 'green', 'crimson', 'purple', 'maroon', 'dodgerblue', 'black', 'gray']

export const MinesweeperCell: React.FC<CellProps> = ({ cell, minesAround, size, onClick, onToggleFlag }) => {
  const icon = cell.isMine ? '💣' : `${minesAround > 0 ? minesAround : ''}`

  return (
    <button
      className={`${styles.cell} ${cell.state === CellState.VISIBLE && cell.isMine ? styles.mine : styles[cell.state]} ${styles[size]}`}
      style={{ color: colorsByMinesAround[minesAround] }}
      onClick={onClick}
      onContextMenu={onToggleFlag}
    >
      {cell.state === CellState.VISIBLE && icon}
      {cell.state === CellState.FLAGGED && '🚩'}
    </button>
  )
}
