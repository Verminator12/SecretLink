import { supabase } from '../lib/supabase'
import type { Message, ProtectionType } from '../types'

export class MessageService {
  static async fetchMessageBySlug(slug: string): Promise<{ data: Message | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle() // Use maybeSingle instead of single to handle not found case

      if (error) {
        throw error
      }

      // If no message found, return null without throwing an error
      if (!data) {
        return { data: null, error: null }
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
    protectionData: string
  ): Promise<{ data: Message | null; error: Error | null }> {
    try {
      const slug = Math.random().toString(36).substring(2, 8)

      const { data, error } = await supabase
        .from('messages')
        .insert([{ 
          content, 
          slug,
          protection_type: protectionType,
          protection_data: protectionData,
        }])
        .select()
        .single()

      if (error) {
        throw error
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