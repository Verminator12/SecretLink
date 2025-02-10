import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Secret, ProtectionType } from '../types'

export interface SecretState {
  content: string
  protectionType: ProtectionType | null
  password: string
  loading: boolean
  generatedMessage: Secret | null
  currentSlug: string | null
  step: 'secret' | 'protection' | 'details' | 'complete'
  isTransitioning: boolean
}

const initialState: SecretState = {
  content: '',
  protectionType: null,
  password: '',
  loading: false,
  generatedMessage: null,
  currentSlug: null,
  step: 'secret',
  isTransitioning: false,
}

export const secretSlice = createSlice({
  name: 'secret',
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
    setGeneratedMessage: (state, action: PayloadAction<Secret | null>) => {
      state.generatedMessage = action.payload
    },
    setCurrentSlug: (state, action: PayloadAction<string | null>) => {
      state.currentSlug = action.payload
    },
    setStep: (state, action: PayloadAction<SecretState['step']>) => {
      state.step = action.payload
    },
    setIsTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload
    },
    resetState: (_state) => {
      return initialState
    },
  },
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
  resetState,
} = secretSlice.actions

export default secretSlice.reducer
