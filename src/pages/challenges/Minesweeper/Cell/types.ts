export enum CellState {
  HIDDEN = 'hidden',
  VISIBLE = 'visible',
  FLAGGED = 'flagged',
}

export type Cell = {
  isMine: boolean
  state: CellState
}
