import React from 'react'
import styles from './SecretCreation.module.scss'
import { useAppDispatch, useAppSelector, useTranslation } from '../../hooks'
import { WriteSecret, ChooseProtection, ProtectionDetails, CompleteStep } from '.'
import {
  setGeneratedMessage,
  setIsTransitioning,
  setLoading,
  setStep,
  setProtectionType,
  resetState,
  type SecretState,
} from '../../store/secretSlice'
import { SecretService } from '../../services/api'
import { hashText } from '../../utils/crypto'

export const SecretCreation: React.FC = () => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const {
    content,
    protectionType,
    password,
    step,
    isTransitioning,
  } = useAppSelector(state => state.secret)

  const changeStep = (newStep: SecretState['step'] | 'reset') => {
    dispatch(setIsTransitioning(true))
    setTimeout(() => {
      dispatch(newStep === 'reset' ? resetState() : setStep(newStep))
      dispatch(setIsTransitioning(false))
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    if (step === 'secret') {
      changeStep('protection')
      return
    }

    if (step === 'protection' && protectionType) {
      changeStep('details')
      return
    }

    dispatch(setLoading(true))
    const protectionData = protectionType === 'password'
      ? await hashText(password)
      : JSON.stringify({ type: 'memory', pairs: 6 })

    const { data, error } = await SecretService.createMessage(
      content,
      protectionType!,
      protectionData,
    )

    if (!error && data) {
      dispatch(setGeneratedMessage(data))
      changeStep('complete')
    }

    dispatch(setLoading(false))
  }

  const handleBack = () => {
    dispatch(setIsTransitioning(true))

    setTimeout(() => {
      switch (step) {
        case 'protection':
          dispatch(setStep('secret'))
          break
        case 'details': {
          dispatch(setStep('protection'))
          dispatch(setProtectionType(null))
          break
        }
      }
      dispatch(setIsTransitioning(false))
    }, 300)
  }

  const steps = {
    secret: <WriteSecret onSubmit={handleSubmit} />,
    protection: <ChooseProtection onSubmit={handleSubmit} onBack={handleBack} />,
    details: <ProtectionDetails onBack={handleBack} />,
    complete: <CompleteStep onRestart={() => changeStep('reset')} />,
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
        <div className={`${styles.stepContainer} ${isTransitioning ? styles.transitioning : ''}`}>
          {steps[step]}
        </div>
      </div>
    </div>
  )
}
