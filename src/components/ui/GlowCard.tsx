import React from 'react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function GlowCard({ children, className = '', delay = 0 }: GlowCardProps) {
  return (
    <div
      className={`glow-card corner-bracket relative p-6 scroll-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
