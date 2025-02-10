export interface Secret {
  id: string
  content: string
  created_at: string
  expiration_date: string
  slug?: string
  protection_type?: 'password' | 'game' | 'riddle'
  protection_data?: string // password hash or game/riddle configuration
}

export type ProtectionType = 'password' | 'game' | 'riddle'
