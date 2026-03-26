import React from 'react'

interface CornerBracketProps {
  children: React.ReactNode
  className?: string
}

export function CornerBracket({ children, className = '' }: CornerBracketProps) {
  return (
    <div className={`corner-bracket relative ${className}`}>
      {children}
    </div>
  )
}
