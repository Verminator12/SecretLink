import React, { useEffect } from 'react'
import styles from './SecretCreation.module.scss'
import { useAppDispatch, useAppSelector, useTranslation } from '../../hooks'
import { WriteSecret, ChooseProtection, ProtectionDetails, CompleteStep } from '.'
import {
  setIsTransitioning,
  setStep,
  setProtectionType,
  resetState,
  type SecretState,
  setContent,
} from '../../store/secretSlice'

export const SecretCreation: React.FC = () => {
  const t = useTranslation()
  const dispatch = useAppDispatch()
  const {
    content,
    protectionType,
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

  const handleSteps = async () => {
    if (!content.trim()) return

    if (step === 'secret') {
      changeStep('protection')
      return
    }

    if (!protectionType) return

    if (step === 'protection' && protectionType) {
      changeStep('details')
      return
    }
  }

  const handleBack = () => {
    dispatch(setIsTransitioning(true))

    setTimeout(() => {
      switch (step) {
        case 'protection':
          dispatch(setContent(''))
          dispatch(setStep('secret'))
          break
        case 'details': {
          dispatch(setProtectionType(null))
          dispatch(setStep('protection'))
          break
        }
      }
      dispatch(setIsTransitioning(false))
    }, 300)
  }

  const steps = {
    secret: <WriteSecret />,
    protection: <ChooseProtection onBack={handleBack} />,
    details: <ProtectionDetails onBack={handleBack} />,
    complete: <CompleteStep onRestart={() => changeStep('reset')} />,
  }

  useEffect(() => {
    handleSteps()
  }, [protectionType, content])

  return (
    <div className={`${styles.stepContainer} ${isTransitioning ? styles.transitioning : ''}`}>
      <p className={styles.description}>{t.description.howItWorks}</p>
      <p className={styles.description}>{t.description.selfDestructWarning}</p>
      {steps[step]}
    </div>
  )
}
