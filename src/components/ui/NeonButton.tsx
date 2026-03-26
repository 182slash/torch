'use client'

import React from 'react'
import Link from 'next/link'

interface NeonButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'cyan' | 'green'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function NeonButton({
  children,
  href,
  onClick,
  variant = 'cyan',
  className = '',
  type = 'button',
  disabled = false,
}: NeonButtonProps) {
  const cls = `neon-btn ${variant === 'green' ? 'neon-btn-green' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  )
}
