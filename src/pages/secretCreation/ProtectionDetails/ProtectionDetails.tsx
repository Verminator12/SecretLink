import React from 'react'
import { useAppSelector } from '../../../hooks'
import { PasswordForm } from './forms/PasswordForm'
import { GameForm } from './forms/GameForm'
import { RiddleForm } from './forms/RiddleForm'

interface ProtectionDetailsProps {
  onBack: () => void
}

export const ProtectionDetails: React.FC<ProtectionDetailsProps> = ({ onBack }) => {
  const { protectionType } = useAppSelector(state => state.message)

  switch (protectionType) {
    case 'password':
      return <PasswordForm onBack={onBack} />
    case 'game':
      return <GameForm onBack={onBack} />
    case 'riddle':
      return <RiddleForm onBack={onBack} />
    default:
      return null
  }
}
