import React, { PropsWithChildren } from 'react'
import styles from './Layout.module.scss'
import { useTranslation } from '../../hooks'

type LayoutProps = {
  title: string
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children, title }) => {
  const t = useTranslation()

  return (
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
  )
}
