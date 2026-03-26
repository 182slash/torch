'use client'

import { useEffect, useRef } from 'react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function highlightTorch(text: string) {
  const parts = text.split(/(torch)/gi)
  return parts.map((part, i) =>
    part.toLowerCase() === 'torch' ? (
      <span key={i} style={{ color: 'var(--accent-cyan)', textShadow: '0 0 10px rgba(0,212,255,0.4)', fontWeight: 600 }}>
        {part}
      </span>
    ) : (
      part
    )
  )
}

const hiddenStyle: React.CSSProperties = {
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.6s ease, transform 0.6s ease',
}


export function AboutSection() {
  const ref0 = useReveal()
  const ref1 = useReveal()
  const ref2 = useReveal()
  const ref3 = useReveal()
  const ref4 = useReveal()

  const paragraphs = [
    `torch was born out of a shared dream among a group of engineers. We weren't just colleagues, we were a family bound by a common passion for innovation and problem-solving. Each of us had unique expertise — be it in networking, security, software, web development, or IT infrastructure — but we realized that together, our combined strength created something extraordinary. It was a testament to our friendship and our belief in the power of teamwork.`,
    `What sets torch apart is the heart we put into every project. From the start, we agreed that success wouldn't just be about offering top-notch services but about creating genuine connections with our clients. Every solution we provide reflects our shared commitment to excellence and integrity. Whether designing a secure network or creating a seamless user experience, we infuse each task with the dedication of a team that genuinely loves what they do.`,
    `Our mission is to make a difference through innovative solutions, backed by the unwavering support of our remarkable team. At the heart of torch is to be a light in this world, to be part of the solution driven by passion and fueled by the faith that through the unity of team work we can achieve great things. Together, we strive to bring exceptional service not only because we are skilled engineers but because we genuinely care about the people we serve.`,
  ]

  const paraRefs = [ref1, ref2, ref3]

  return (
    <div
      className="min-h-screen pt-24 pb-24"
      style={{
        background: 'var(--bg-void)',
        backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Hero banner — icon removed, subtitle fixed for mobile */}
      <div
        className="w-full py-14 mb-16 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-glow)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center gap-3 px-6">
          {/* TorchLogoSVG removed */}
          <h1
            className="font-orbitron font-black cursor-blink"
            style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            torch<span style={{ color: 'var(--accent-cyan)' }}>.</span>
          </h1>
          {/* Subtitle: centered, no awkward wrap on mobile */}
          <p
            className="font-space-mono uppercase"
            style={{
              color: 'var(--accent-cyan)',
              letterSpacing: '0.2em',
              fontSize: 'clamp(0.55rem, 2.4vw, 0.75rem)',
              textAlign: 'center',
              lineHeight: 1.8,
            }}
          >
            Engineering Solutions
            <span style={{ display: 'inline', margin: '0 0.4em', opacity: 0.5 }}>·</span>
            Empowering Business
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {/* Label */}
        <div ref={ref0} style={{ ...hiddenStyle, textAlign: 'center' }}>
          <span
            className="font-space-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Our Story
          </span>
          <div
            className="mt-3 h-px w-24 mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)' }}
          />
        </div>

        {/* Paragraphs */}
        {paragraphs.map((para, i) => (
          <div
            key={i}
            ref={paraRefs[i]}
            style={{
              ...hiddenStyle,
              transitionDelay: `${i * 80}ms`,
              position: 'relative',
              paddingLeft: '24px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'linear-gradient(to bottom, var(--accent-cyan), transparent)',
                opacity: 0.4,
              }}
              aria-hidden="true"
            />
            <p
              className="font-syne leading-relaxed"
              style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}
            >
              {highlightTorch(para)}
            </p>
          </div>
        ))}

        {/* Founder block */}
        <div
          ref={ref4}
          style={{
            ...hiddenStyle,
            transitionDelay: '200ms',
            paddingTop: '40px',
            marginTop: '24px',
            borderTop: '1px solid var(--border-glow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p className="font-orbitron font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Julio Silalahi
            </p>
            <p
              className="font-space-mono text-xs tracking-[0.25em] uppercase mt-1"
              style={{ color: 'var(--accent-cyan)' }}
            >
              Founder
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}