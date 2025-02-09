import React from 'react'
import styles from './SLButton.module.scss'

interface SLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  block?: boolean
  center?: boolean
  variant?: 'primary' | 'game'
  type?: 'submit' | 'button'
  children: React.ReactNode
}

export const SLButton: React.FC<SLButtonProps> = ({
  loading,
  disabled,
  block,
  center,
  variant = 'primary',
  type = 'button',
  children,
  className,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    block ? styles.block : '',
    center ? styles.center : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
}
