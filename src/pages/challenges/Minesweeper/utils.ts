import { Cell, CellState } from './Cell'

export const difficulty = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}

export const surroundingCellsPositions = (row: number, col: number) => [
  [row - 1, col - 1], [row - 1, col], [row - 1, col + 1], // above row
  [row, col - 1], [row, col + 1], // same row
  [row + 1, col - 1], [row + 1, col], [row + 1, col + 1], // below row
]

export const isCellOutOfBounds = (row: number, col: number, board: Cell[][]) => {
  return row < 0 || row >= board.length || col < 0 || col >= board[0].length
}

export const getSurroundingMinesAndFlags = (row: number, col: number, board: Cell[][]) => {
  let minesAround = 0
  let flagsAround = 0

  surroundingCellsPositions(row, col).forEach(([r, c]) => {
    if (isCellOutOfBounds(r, c, board)) {
      return
    }

    if (board[r][c].isMine) {
      minesAround += 1
    }

    if (board[r][c].state === CellState.FLAGGED) {
      flagsAround += 1
    }
  })

  return { minesAround, flagsAround }
}

export const shuffle2DArray = <T>(array: T[][]) => {
  const rows = array.length
  const cols = array[0].length

  const flatArray = array.flat()

  // Fisher-Yates Shuffle
  for (let i = flatArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flatArray[i], flatArray[j]] = [flatArray[j], flatArray[i]]
  }

  // Reshape into 2D
  const shuffledArray = []

  for (let i = 0; i < rows; i++) {
    shuffledArray.push(flatArray.slice(i * cols, (i + 1) * cols))
  }

  return shuffledArray
}

export const getBoardParameters = (parameters: string) => {
  try {
    const protection = JSON.parse(parameters || '{}')
    const level = protection.difficulty as keyof typeof difficulty

    return difficulty[level] || difficulty.easy
  } catch (err) {
    console.error('Error parsing difficulty:', err)
    return difficulty.easy
  }
}
