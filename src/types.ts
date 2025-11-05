export type Secret = {
  id: string
  content: string
  created_at: string
  expiration_date: string
  slug: string
  protection_type: 'password' | 'memory' | 'riddle' | 'minesweeper' | 'wordle'
  protection_data: string
}

export type ProtectionType = 'password' | 'memory' | 'riddle' | 'minesweeper' | 'wordle'
