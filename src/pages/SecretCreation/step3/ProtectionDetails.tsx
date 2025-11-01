import React from 'react'
import { useAppSelector } from '../../../hooks'
import { RiddleForm, PasswordForm, MemoryForm, MinesweeperForm } from '../../challenges'

type ProtectionDetailsProps = {
  onBack: () => void
}

export const ProtectionDetails: React.FC<ProtectionDetailsProps> = ({ onBack }) => {
  const { protectionType } = useAppSelector(state => state.secret)

  switch (protectionType) {
    case 'password':
      return <PasswordForm onBack={onBack} />
    case 'memory':
      return <MemoryForm onBack={onBack} />
    case 'riddle':
      return <RiddleForm onBack={onBack} />
    case 'minesweeper':
      return <MinesweeperForm onBack={onBack} />
    default:
      return null
  }
}
