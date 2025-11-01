import React, { PropsWithChildren, useEffect, useRef } from 'react'
import styles from './Layout.module.scss'
import { useTranslation } from '../../hooks'

type LayoutProps = {
  title: string
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children, title }) => {
  const t = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  const parallax = (event: MouseEvent) => {
    // const _w = window.innerWidth / 2
    // const _h = window.innerHeight / 2
    // const _mouseX = event.clientX
    // const _mouseY = event.clientY
    // const _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`
    // const _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`
    // const _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`
    // const x = `${_depth3}, ${_depth2}, ${_depth1}`

    const x = (event.clientX / window.innerWidth - 0.5) * 2
    const y = (event.clientY / window.innerHeight - 0.5) * 2

    const rotateX = y * 20 // max 20deg up/down
    const rotateY = -x * 20 // max 10deg left/right

    if (ref.current) {
      ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.2)`
      // ref.current.style.backgroundPosition = x
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', parallax)
    return () => window.removeEventListener('mousemove', parallax)
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
