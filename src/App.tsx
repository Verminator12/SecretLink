import React, { useEffect } from 'react'
import { SecretReveal } from './pages/SecretReveal'
import { SecretCreation } from './pages/SecretCreation'
import { useAppDispatch, useAppSelector } from './hooks'
import {
  setCurrentSlug,
} from './store/secretSlice'

export const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    currentSlug,
  } = useAppSelector(state => state.secret)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const slug = urlParams.get('m')

    if (slug) {
      dispatch(setCurrentSlug(slug))
    }
  }, [])

  return currentSlug ? <SecretReveal slug={currentSlug} /> : <SecretCreation />
}
