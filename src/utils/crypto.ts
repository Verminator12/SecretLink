import { Buffer } from 'buffer'

const generateKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )
}

// Convert CryptoKey to base64 string for storage
const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key)
  return Buffer.from(exported).toString('base64')
}

// Convert base64 string back to CryptoKey
const importKey = async (keyStr: string): Promise<CryptoKey> => {
  const keyData = Buffer.from(keyStr, 'base64')
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt'],
  )
}

// Encrypt text using AES-GCM
export const encryptText = async (text: string): Promise<{ encryptedData: string, key: string }> => {
  const key = await generateKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data,
  )

  const encryptedArray = new Uint8Array(encryptedBuffer)
  const combined = new Uint8Array(iv.length + encryptedArray.length)
  combined.set(iv)
  combined.set(encryptedArray, iv.length)

  return {
    encryptedData: Buffer.from(combined).toString('base64'),
    key: await exportKey(key),
  }
}

// Decrypt text using AES-GCM
export const decryptText = async (encryptedData: string, keyStr: string): Promise<string> => {
  const key = await importKey(keyStr)
  const combined = Buffer.from(encryptedData, 'base64')
  const combinedArray = new Uint8Array(combined)

  const iv = combinedArray.slice(0, 12)
  const encryptedArray = combinedArray.slice(12)

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedArray,
  )

  const decoder = new TextDecoder()
  return decoder.decode(decryptedBuffer)
}

/**
 * One-way hash function using SHA-256
 * @param text Text to hash
 * @returns Promise that resolves to the hashed text
 */
export const hashText = async (text: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
