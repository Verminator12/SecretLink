import React, { useEffect } from 'react'
import { MessageService } from './services/api'
import { MessageView } from './pages/secretReveal/MessageView'
import { WriteMessage } from './pages/secretCreation/WriteMessage'
import { ChooseProtection } from './pages/secretCreation/ChooseProtection'
import { ProtectionDetails } from './pages/secretCreation/ProtectionDetails'
import { CompleteStep } from './pages/secretCreation/CompleteStep'
import { useTranslation } from './hooks/useTranslation'
import { useAppDispatch, useAppSelector } from './hooks'
import {
  setCurrentSlug,
  setGeneratedMessage,
  setIsTransitioning,
  setLoading,
  setStep,
  setProtectionType,
  resetState
} from './store/messageSlice'
import { hashText } from './utils/crypto'
import styles from './styles/App.module.scss'

export const App: React.FC = () => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const {
    content,
    protectionType,
    password,
    loading,
    generatedMessage,
    currentSlug,
    step,
    isTransitioning
  } = useAppSelector(state => state.message)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const slug = urlParams.get('m')

    if (slug) {
      dispatch(setCurrentSlug(slug))
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    if (step === 'message') {
      dispatch(setIsTransitioning(true))
      setTimeout(() => {
        dispatch(setStep('protection'))
        dispatch(setIsTransitioning(false))
      }, 300)
      return
    }

    if (step === 'protection' && protectionType) {
      dispatch(setIsTransitioning(true))
      setTimeout(() => {
        dispatch(setStep('details'))
        dispatch(setIsTransitioning(false))
      }, 300)
      return
    }

    dispatch(setLoading(true))
    const protectionData = protectionType === 'password' 
      ? await hashText(password)
      : JSON.stringify({ type: 'memory', pairs: 6 })

    const { data, error } = await MessageService.createMessage(
      content, 
      protectionType!,
      protectionData
    )

    if (!error && data) {
      dispatch(setGeneratedMessage(data))
      dispatch(setIsTransitioning(true))
      setTimeout(() => {
        dispatch(setStep('complete'))
        dispatch(setIsTransitioning(false))
      }, 300)
    }
    
    dispatch(setLoading(false))
  }

  const handleBack = () => {
    dispatch(setIsTransitioning(true))
    setTimeout(() => {
      if (step === 'protection') {
        dispatch(setStep('message'))
      } else if (step === 'details') {
        dispatch(setStep('protection'))
        dispatch(setProtectionType(null))
      } else if (currentSlug) {
        dispatch(setCurrentSlug(null))
        window.history.pushState({}, '', window.location.pathname)
      }
      dispatch(setIsTransitioning(false))
    }, 300)
  }

  const handleRestart = () => {
    dispatch(setIsTransitioning(true))
    setTimeout(() => {
      dispatch(resetState())
      dispatch(setIsTransitioning(false))
    }, 300)
  }

  const renderStep = () => {
    const className = `${styles.stepContainer} ${isTransitioning ? styles.transitioning : ''}`

    if (step === 'message') {
      return (
        <div className={className}>
          <WriteMessage onSubmit={handleSubmit} />
        </div>
      )
    }

    if (step === 'protection') {
      return (
        <div className={className}>
          <ChooseProtection
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      )
    }

    if (step === 'details') {
      return (
        <div className={className}>
          <ProtectionDetails
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      )
    }

    return (
      <div className={className}>
        <CompleteStep onRestart={handleRestart} />
      </div>
    )
  }

  if (currentSlug) {
    return <MessageView slug={currentSlug} onBack={handleBack} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.slogan}>{t.slogan}</p>
          </div>
        </div>

        <p className={styles.description}>{t.description}</p>

        {renderStep()}
      </div>
    </div>
  )
}