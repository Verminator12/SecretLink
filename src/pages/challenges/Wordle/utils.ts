import { decryptText } from '../../../utils/crypto'

export type WordleRequest = {
  type: 'wordle'
  word: { data: string, key: string }
  attemps: number
}

export type WordleParameters = {
  word: string
  attemps: number
}

export const getWordleParameters = async (parameters: string): Promise<WordleParameters> => {
  const request = JSON.parse(parameters || '{}') as WordleRequest
  const { data, key } = request.word

  const decryptedWord = await decryptText(data, key)

  const params: WordleParameters = {
    word: decryptedWord,
    attemps: request.attemps,
  }

  return params
}
