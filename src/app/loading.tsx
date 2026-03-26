export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Animated network node */}
      <div className="relative w-16 h-16">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'spin 3s linear infinite' }}
        >
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
          <circle cx="32" cy="32" r="28" stroke="var(--border-glow)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 20px var(--accent-cyan)',
              animation: 'pulse-dot 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <p
        className="font-orbitron font-bold text-sm tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        torch<span style={{ color: 'var(--accent-cyan)' }}>.</span>
      </p>
    </div>
  )
}
