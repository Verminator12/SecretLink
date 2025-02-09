import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Message, ProtectionType } from '../types'

interface MessageState {
  content: string
  protectionType: ProtectionType | null
  password: string
  loading: boolean
  generatedMessage: Message | null
  currentSlug: string | null
  step: 'message' | 'protection' | 'details' | 'complete'
  isTransitioning: boolean
}

const initialState: MessageState = {
  content: '',
  protectionType: null,
  password: '',
  loading: false,
  generatedMessage: null,
  currentSlug: null,
  step: 'message',
  isTransitioning: false
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
    },
    setProtectionType: (state, action: PayloadAction<ProtectionType | null>) => {
      state.protectionType = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setGeneratedMessage: (state, action: PayloadAction<Message | null>) => {
      state.generatedMessage = action.payload
    },
    setCurrentSlug: (state, action: PayloadAction<string | null>) => {
      state.currentSlug = action.payload
    },
    setStep: (state, action: PayloadAction<MessageState['step']>) => {
      state.step = action.payload
    },
    setIsTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload
    },
    resetState: (state) => {
      return initialState
    }
  }
})

export const {
  setContent,
  setProtectionType,
  setPassword,
  setLoading,
  setGeneratedMessage,
  setCurrentSlug,
  setStep,
  setIsTransitioning,
  resetState
} = messageSlice.actions

export default messageSlice.reducer