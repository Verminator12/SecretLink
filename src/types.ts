export interface Message {
  id: string
  content: string
  created_at: string
  expiration_date: string
  slug?: string
  protection_type?: 'password' | 'game' | 'riddle'
  protection_data?: string // password hash or game/riddle configuration
}

export type ProtectionType = 'password' | 'game' | 'riddle'

export interface GameConfig {
  type: 'memory' // for now we only have memory game
  pairs: number // number of pairs to match
}

export interface RiddleConfig {
  riddle: string
  answer: string
}

// Props for step components
export interface FormProps {
  message: string
  setMessage: (message: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  t: Record<string, string>
}

export interface ProtectionProps {
  protectionType: ProtectionType | null
  setProtectionType: (type: ProtectionType) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  t: Record<string, string>
}

export interface DetailsProps {
  protectionType: ProtectionType
  password: string
  setPassword: (password: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  t: Record<string, string>
}
