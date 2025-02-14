import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useTranslation } from '../hooks'
import { setCurrentSlug } from '../store/secretSlice'
import { SecretReveal } from './SecretReveal'
import { SecretCreation } from './SecretCreation'
import { Layout } from '../components'

export const App: React.FC = () => {
  const t = useTranslation()
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

  return (
    <Layout title={currentSlug ? t.secretForYou : t.title}>
      {currentSlug ? <SecretReveal slug={currentSlug} /> : <SecretCreation />}
    </Layout>
  )
}
