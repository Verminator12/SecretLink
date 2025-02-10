import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  setCurrentSlug,
} from '../store/secretSlice'
import { SecretReveal } from './SecretReveal'
import { SecretCreation } from './SecretCreation'

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
