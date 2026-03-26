interface SectionTitleProps {
  label: string
  className?: string
}

export function SectionTitle({ label, className = '' }: SectionTitleProps) {
  return (
    <div className={`section-divider my-12 ${className}`}>
      <span
        className="font-orbitron text-xs font-bold tracking-[0.3em] uppercase whitespace-nowrap"
        style={{ color: 'var(--text-secondary)' }}
      >
        ── {label} ──
      </span>
    </div>
  )
}
