import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import styles from './Layout.module.scss'
import { useTranslation } from '../../hooks'

type LayoutProps = {
  title: string
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children, title }) => {
  const t = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState<number | null>(null)

  const parallax = (event: MouseEvent) => {
    if (frame) {
      cancelAnimationFrame(frame)
    }

    const animationFrame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2

      const rotateX = y * 20
      const rotateY = -x * 20

      if (ref.current) {
        ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.2)`
      }
    })

    setFrame(animationFrame)
  }

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (frame) {
      cancelAnimationFrame(frame)
    }

    const animationFrame = requestAnimationFrame(() => {
      const gamma = event.gamma ?? 0 // left/right tilt [-90, 90]
      const beta = event.beta ?? 0 // front/back tilt [-180, 180]

      // Normalize to -1 → 1
      const x = gamma / 45
      const y = beta / 45

      const rotateX = y * 20
      const rotateY = -x * 20

      if (ref.current) {
        ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.2)`
      }
    })

    setFrame(animationFrame)
  }

  useEffect(() => {
    window.addEventListener('mousemove', parallax)
    window.addEventListener('deviceorientation', handleDeviceOrientation, true)

    return () => {
      window.removeEventListener('mousemove', parallax)
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true)

      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <>
      <div ref={ref} className={styles['background-3d']} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.slogan}>{t.slogan}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
