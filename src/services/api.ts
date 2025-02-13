import { supabase } from '../lib/supabase'
import type { Secret, ProtectionType } from '../types'
import { encryptText, decryptText } from '../utils/crypto'

export class SecretService {
  static async fetchMessageBySlug(slug: string): Promise<{ data: Secret | null, error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) {
        throw error
      }

      // If no message found, return null without throwing an error
      if (!data) {
        return { data: null, error: null }
      }

      // Decrypt the message content if encryption key exists
      if (data.encryption_key) {
        try {
          data.content = await decryptText(data.content, data.encryption_key)
        } catch (decryptError) {
          console.error('Error decrypting message:', decryptError)
          return { data: null, error: new Error('Failed to decrypt message') }
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching message:', error)
      return { data: null, error: error as Error }
    }
  }

  static async createMessage(
    content: string,
    protectionType: ProtectionType,
    protectionData: string,
  ): Promise<{ data: Secret | null, error: Error | null }> {
    try {
      const slug = Math.random().toString(36).substring(2, 8)

      const { encryptedData, key } = await encryptText(content)

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content: encryptedData,
          encryption_key: key,
          slug,
          protection_type: protectionType,
          protection_data: protectionData,
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Return the original unencrypted content for the UI
      if (data) {
        data.content = content
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error creating message:', error)
      return { data: null, error: error as Error }
    }
  }

  static async deleteMessage(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Error deleting message:', error)
      return { error: error as Error }
    }
  }
}
