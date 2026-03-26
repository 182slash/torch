import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found · Torch',
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-lg space-y-8">
        {/* Error code */}
        <div>
          <p
            className="font-space-mono text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: 'var(--accent-cyan)' }}
          >
            ERROR · STATUS 404
          </p>
          <h1
            className="font-orbitron font-black leading-none"
            style={{
              fontSize: 'clamp(80px, 18vw, 160px)',
              color: 'var(--text-primary)',
              opacity: 0.15,
              letterSpacing: '-0.04em',
            }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-3 -mt-8">
          <h2
            className="font-orbitron font-bold text-xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Signal Lost
          </h2>
          <p
            className="font-syne text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            The page you&apos;re looking for has dropped off the network.
            <br />
            Let&apos;s get you back online.
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-32 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)' }}
        />

        {/* CTA */}
        <Link href="/" className="neon-btn inline-flex">
          ← RETURN HOME
        </Link>
      </div>
    </div>
  )
}
