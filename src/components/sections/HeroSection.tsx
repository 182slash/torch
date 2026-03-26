'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Network, Shield, Terminal, ArrowRight, ChevronDown } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const NetworkScene = dynamic(
  () => import('@/components/three/NetworkScene').then(m => m.NetworkScene),
  { ssr: false }
)

function useTypewriter(words: string[], speed = 80, pause = 2200) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx % words.length]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else {
      setDeleting(false)
      setWordIdx(w => (w + 1) % words.length)
    }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

const SERVICE_DATA = {
  Network: {
    Icon: Network,
    title: 'Network Infrastructure',
    summary: 'Enterprise routing, switching & wireless. Fault-tolerant architectures engineered to keep your business online at full speed — 24/7.',
    tags: ['LAN / WAN', 'SD-WAN', 'VoIP', 'Cisco · Meraki'],
  },
  Security: {
    Icon: Shield,
    title: 'Cybersecurity',
    summary: 'Zero-trust posture, real-time threat monitoring & rapid incident response. Every layer hardened so attackers always hit a wall.',
    tags: ['Firewall', 'SOC / SIEM', 'Pen Testing', 'Compliance'],
  },
  Software: {
    Icon: Terminal,
    title: 'Software Development',
    summary: 'Custom web apps, automation pipelines & deep integrations. Complex workflows transformed into clean, scalable digital products.',
    tags: ['React · Next.js', 'REST / GraphQL', 'DevOps', 'Cloud'],
  },
} as const

type ServiceKey = keyof typeof SERVICE_DATA

// ─── Desktop CardBody ──────────────────────────────────────────────────────────
function CardBody({
  serviceKey, visible, Icon, title, summary, tags,
  CONNECTOR_H, CARD_W, pulseKey, style,
}: {
  serviceKey: ServiceKey
  visible: boolean
  Icon: typeof Network
  title: string
  summary: string
  tags: readonly string[]
  CONNECTOR_H: number
  CARD_W: number
  pulseKey: number
  style?: React.CSSProperties
}) {
  return (
    <>
      <svg
        width={40} height={CONNECTOR_H} viewBox={`0 0 40 ${CONNECTOR_H}`}
        style={{ overflow: 'visible', display: 'block', opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
      >
        <defs>
          <linearGradient id={`lineGrad-${serviceKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff66" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00ff66" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id={`glowGrad-${serviceKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff66" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {serviceKey !== 'Security' ? (
          <>
            <line x1="20" y1="0" x2="20" y2={CONNECTOR_H} stroke={`url(#glowGrad-${serviceKey})`} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
            <line x1="20" y1="0" x2="20" y2={CONNECTOR_H} stroke={`url(#glowGrad-${serviceKey})`} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
            <line x1="20" y1="0" x2="20" y2={CONNECTOR_H} stroke={`url(#lineGrad-${serviceKey})`} strokeWidth={0.8} strokeLinecap="round" />
            <circle key={`pulse-${pulseKey}`} cx="20" cy="0" r="2.5" fill="#00ff66" opacity="0"
              style={{ animation: visible ? `dataPulse-${serviceKey} 0.7s cubic-bezier(0.4,0,0.2,1) 0.05s forwards` : 'none' }} />
            <line key={`tail-${pulseKey}`} x1="20" y1="0" x2="20" y2="0" stroke="#00ff66" strokeWidth={1.5} strokeLinecap="round" opacity="0"
              style={{ animation: visible ? `dataTail-${serviceKey} 0.7s cubic-bezier(0.4,0,0.2,1) 0.05s forwards` : 'none' }} />
            <circle cx="20" cy={CONNECTOR_H - 1} r="2" fill="#00ff66" opacity="0"
              style={{ animation: visible ? `anchorFadeIn 0.3s ease 0.65s forwards` : 'none' }} />
          </>
        ) : (
          <>
            <circle cx="20" cy={CONNECTOR_H - 1} r="2" fill="#00ff66" opacity="0"
              style={{ animation: visible ? `anchorFadeIn 0.3s ease 0.1s forwards` : 'none' }} />
            <circle cx="20" cy={CONNECTOR_H / 2} r="1.5" fill="#00ff66" opacity="0"
              style={{ animation: visible ? `anchorFadeIn 0.3s ease 0.2s forwards` : 'none' }} />
          </>
        )}
        <circle cx="20" cy="1" r="2" fill="#00ff66" opacity="0.9" />
      </svg>

      <style>{`
        @keyframes dataPulse-${serviceKey} {
          0%   { cy: 0;                  opacity: 0;    r: 1.5; }
          10%  { cy: 0;                  opacity: 0.9;  r: 2.5; }
          85%  { cy: ${CONNECTOR_H - 2}; opacity: 0.85; r: 2.5; }
          100% { cy: ${CONNECTOR_H - 2}; opacity: 0;    r: 1.5; }
        }
        @keyframes dataTail-${serviceKey} {
          0%   { y1: 0; y2: 0;                                       opacity: 0;   }
          10%  { y1: 0; y2: 0;                                       opacity: 0.4; }
          85%  { y1: ${CONNECTOR_H * 0.55}; y2: ${CONNECTOR_H - 4}; opacity: 0.2; }
          100% { y1: ${CONNECTOR_H * 0.55}; y2: ${CONNECTOR_H - 4}; opacity: 0;   }
        }
        @keyframes anchorFadeIn {
          from { opacity: 0; }
          to   { opacity: 0.85; }
        }
      `}</style>

      <div style={{
        width: CARD_W,
        background: 'rgba(2,4,2,0.92)',
        border: '1px solid rgba(0,255,102,0.22)',
        backdropFilter: 'blur(18px)',
        padding: '18.5px 20px 17px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: visible ? '0 0 0 1px rgba(0,255,102,0.05), 0 0 24px rgba(0,255,102,0.08), 0 20px 60px rgba(0,0,0,0.70)' : 'none',
        ...style,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9.24, marginBottom: 10.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26.2, height: 26.2, flexShrink: 0, border: '1px solid rgba(0,255,102,0.30)', background: 'rgba(0,255,102,0.05)' }}>
            <Icon size={11.6} style={{ color: '#00ff66' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.601rem', fontWeight: 700, color: '#00ff66', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
            {title}
          </span>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(0,255,102,0.25), transparent)', marginBottom: 9.24 }} />
        <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.678rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.75, margin: '0 0 13.86px' }}>
          {summary}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4.62 }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.508rem', color: 'rgba(0,255,102,0.75)', background: 'rgba(0,255,102,0.05)', border: '1px solid rgba(0,255,102,0.16)', padding: '3.08px 7.7px', letterSpacing: '0.07em' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Mobile card — no connector, position: absolute so it scrolls with page ───
function MobileCard({
  serviceKey, docTop, onNode,
}: {
  serviceKey: ServiceKey
  docTop: number   // badge bottom in document coordinates (viewport bottom + scrollY)
  onNode: (el: HTMLDivElement | null) => void
}) {
  const { Icon, title, summary, tags } = SERVICE_DATA[serviceKey]
  const screenW = window.innerWidth
  const CARD_W = Math.min(280, screenW - 32)
  const cardLeft = screenW / 2 - CARD_W / 2

  return createPortal(
    <div
      ref={onNode}
      style={{
        // absolute in document space — scrolls with the page naturally
        position: 'absolute',
        top: docTop + 8,
        left: cardLeft,
        width: CARD_W,
        zIndex: 99999,
        pointerEvents: 'auto',
        isolation: 'isolate',
      }}
    >
      <div style={{
        width: '100%',
        background: 'rgba(2,4,2,0.97)',
        border: '1px solid rgba(0,255,102,0.28)',
        backdropFilter: 'blur(20px)',
        padding: '16px 18px 14px',
        boxShadow: '0 0 0 1px rgba(0,255,102,0.05), 0 0 24px rgba(0,255,102,0.12), 0 8px 40px rgba(0,0,0,0.95)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, flexShrink: 0, border: '1px solid rgba(0,255,102,0.30)', background: 'rgba(0,255,102,0.05)' }}>
            <Icon size={12} style={{ color: '#00ff66' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.6rem', fontWeight: 700, color: '#00ff66', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
            {title}
          </span>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(0,255,102,0.25), transparent)', marginBottom: 9 }} />
        <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: '0 0 12px' }}>
          {summary}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.55rem', color: 'rgba(0,255,102,0.75)', background: 'rgba(0,255,102,0.05)', border: '1px solid rgba(0,255,102,0.16)', padding: '3px 8px', letterSpacing: '0.07em' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Desktop popover ───────────────────────────────────────────────────────────
function ServicePopover({
  serviceKey, visible, onMouseEnter, onMouseLeave,
}: {
  serviceKey: ServiceKey
  visible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const { Icon, title, summary, tags } = SERVICE_DATA[serviceKey]
  const CONNECTOR_H = 22
  const CARD_W = 260
  const [pulseKey, setPulseKey] = useState(0)
  useEffect(() => { if (visible) setPulseKey(k => k + 1) }, [visible])

  return (
    <div
      className={`dsk-popover-${serviceKey}`}
      style={{
        position: 'absolute', top: '100%', left: '50%',
        transform: 'translateX(-50%)', zIndex: 60,
        flexDirection: 'column', alignItems: 'center',
        pointerEvents: visible ? 'auto' : 'none',
        marginTop: '6px', display: 'none',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>{`@media (min-width: 640px) { .dsk-popover-${serviceKey} { display: flex !important; } }`}</style>
      <CardBody
        serviceKey={serviceKey} visible={visible} Icon={Icon}
        title={title} summary={summary} tags={tags}
        CONNECTOR_H={CONNECTOR_H} CARD_W={CARD_W} pulseKey={pulseKey}
      />
    </div>
  )
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
export function HeroSection() {
  const typeText = useTypewriter(
    [
      'Where Technology Meets Fire',
      'Carry the Torch. Lead the Future.',
      'Light the Way Forward',
      'Ignite Your Vision',
      'Built Tough. Wired Smart.',
      'Your Network. Our Obsession.',
      'Fortified Systems. Fearless. BulletProof',
      'Secure. Scalable. Unstoppable.',
      'Burn Brighter.',
    ],
    55,
    2400
  )

  // Desktop: null until mount (then set to Security if desktop)
  const [hovered, setHovered] = useState<ServiceKey | null>(null)
  // Mobile: null until mount (then set to Security if mobile)
  const [mobileOpen, setMobileOpen] = useState<ServiceKey | null>(null)
  // docTop = badge bottom in document coordinates = viewport bottom + scrollY at tap time
  const [docTop, setDocTop] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const hideTimer = useRef<ReturnType<typeof setTimeout>>()
  const badgeRefs = useRef<Partial<Record<ServiceKey, HTMLDivElement | null>>>({})
  const mobileCardNode = useRef<HTMLDivElement | null>(null)
  const mobileOpenRef = useRef<ServiceKey | null>(null)
  const lastTapTime = useRef(0)

  // On mount: set defaults for desktop and mobile separately
  useEffect(() => {
    setIsMounted(true)
    const mobile = window.innerWidth < 640

    setTimeout(() => {
      const el = badgeRefs.current['Security']
      if (!el) return
      const r = el.getBoundingClientRect()
      if (mobile) {
        // Mobile: open Security card, store document-space top
        setDocTop(r.bottom + window.scrollY)
        setMobileOpen('Security')
      } else {
        // Desktop: hover Security
        setHovered('Security')
      }
    }, 150)
  }, [])

  // Keep ref in sync with state for use in native event listeners
  useEffect(() => { mobileOpenRef.current = mobileOpen }, [mobileOpen])

  // Native touch handling — only close on deliberate outside TAP, never on scroll
  useEffect(() => {
    let touchMoved = false
    let touchStartTarget: EventTarget | null = null

    const onTouchStart = (e: TouchEvent) => {
      touchMoved = false
      touchStartTarget = e.target
    }
    const onTouchMove = () => {
      touchMoved = true
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!mobileOpenRef.current) return
      // If finger moved during touch = scroll = keep card open
      if (touchMoved) return
      const target = (touchStartTarget || e.target) as Node
      // Inside card — keep open
      if (mobileCardNode.current?.contains(target)) return
      // Inside any badge — badge's own handler will switch card
      const onBadge = Object.values(badgeRefs.current).some(el => el?.contains(target))
      if (onBadge) return
      // True outside tap — close
      setMobileOpen(null)
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const cardRefCallback = useCallback((el: HTMLDivElement | null) => {
    mobileCardNode.current = el
  }, [])

  // Desktop hover
  const handleMouseEnter = useCallback((key: ServiceKey) => {
    clearTimeout(hideTimer.current)
    setHovered(key)
  }, [])

  const handleMouseLeave = useCallback(() => {
    hideTimer.current = setTimeout(() => setHovered(null), 180)
  }, [])

  // Mobile tap
  const handleTouchBadge = useCallback((key: ServiceKey) => {
    lastTapTime.current = Date.now()
    const el = badgeRefs.current[key]
    if (el) {
      const r = el.getBoundingClientRect()
      // Store document-space position: viewport bottom + current scroll
      setDocTop(r.bottom + window.scrollY)
    }
    setMobileOpen(prev => prev === key ? null : key)
  }, [])

  // Skip onClick if touch just fired (iOS fires both)
  const handleClickBadge = useCallback((key: ServiceKey) => {
    if (Date.now() - lastTapTime.current < 600) return
    handleMouseEnter(key)
  }, [handleMouseEnter])

  const SERVICES: { Icon: typeof Network; label: ServiceKey }[] = [
    { Icon: Network,  label: 'Network'  },
    { Icon: Shield,   label: 'Security' },
    { Icon: Terminal, label: 'Software' },
  ]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', background: '#000000' }}
      aria-label="Hero — Torch IT Engineering"
    >
      <style>{`
        @keyframes bounceDown {
          0%,100% { transform: translateY(0);   opacity: 0.3; }
          50%      { transform: translateY(6px); opacity: 0.7; }
        }
      `}</style>

      <div className="absolute inset-0 z-0" aria-hidden="true">
        <NetworkScene />
      </div>

      <div className="absolute inset-0 z-1 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.10) 100%)' }}
        aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-32 z-1 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #000000, transparent)' }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-32 z-1 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000000, transparent)' }} aria-hidden="true" />

      <div className="absolute left-0 right-0 z-2 pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true">
        <div style={{ position: 'absolute', left: 0, top: '50%', width: '6vw', height: '1px', background: 'linear-gradient(to right, transparent, rgba(0,255,102,0.4))' }} />
        <div style={{ position: 'absolute', right: 0, top: '50%', width: '6vw', height: '1px', background: 'linear-gradient(to left, transparent, rgba(0,255,102,0.4))' }} />
      </div>

      <div className="scanline-overlay z-2" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center" style={{ paddingBottom: '20vh' }}>
        <div className="w-full max-w-4xl flex flex-col items-center gap-4">

          <div className="hero-tag flex items-center gap-3" style={{ animationDelay: '0.1s' }}>
            <div style={{ width: 32, height: 1, background: 'var(--accent-green)', opacity: 0.5 }} />
            <span className="font-space-mono uppercase tracking-[0.35em]" style={{ color: 'var(--accent-green)', fontSize: '0.539rem' }}>
              IT Engineering Solutions · Empowering Business
            </span>
            <div style={{ width: 32, height: 1, background: 'var(--accent-green)', opacity: 0.5 }} />
          </div>

          <div className="hero-title relative" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,102,0.12) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(1.4)' }}
              aria-hidden="true" />
            <Image
              src="/torch-logo.png" alt="Torch IT Engineering"
              width={520} height={160}
              style={{ height: 'clamp(55px, 10.77vw, 114px)', width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 24px rgba(0,255,102,0.25))' }}
              priority
            />
          </div>

          <div className="hero-subtitle" style={{ animationDelay: '0.5s', minHeight: '2rem' }}>
            <p className="font-orbitron font-bold uppercase" style={{ fontSize: 'clamp(9.2px, 1.235vw, 13.87px)', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: 'var(--accent-green)', borderRight: '2px solid var(--accent-green)', paddingRight: '3px', display: 'inline-block', minWidth: '1ch' }}>
                {typeText}
              </span>
            </p>
          </div>

          <p className="hero-body font-syne leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.52)', fontSize: 'clamp(0.831rem, 1.108vw, 0.998rem)', fontStyle: 'italic', maxWidth: 492, animationDelay: '0.7s' }}>
            Expert services in networking, cybersecurity, and web development —
            tailored solutions for unstoppable business growth.
          </p>

          <div className="hero-cta flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.9s' }}>
            <a
              href="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '10.7px 24.6px',
                background: 'var(--accent-green)', color: '#000000',
                fontFamily: 'var(--font-orbitron)', fontWeight: 700,
                fontSize: '0.599rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                border: '1px solid var(--accent-green)',
                boxShadow: '0 0 28px rgba(0,255,102,0.35), 0 0 60px rgba(0,255,102,0.12)',
                transition: 'all 0.25s ease', cursor: 'pointer', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-green)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,102,0.5), 0 0 80px rgba(0,255,102,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.boxShadow = '0 0 28px rgba(0,255,102,0.35), 0 0 60px rgba(0,255,102,0.12)' }}
            >
              Get Started <ArrowRight size={15} />
            </a>
            <a
              href="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9.975px 21.565px',
                background: 'transparent', color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-orbitron)', fontWeight: 700,
                fontSize: '0.578rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.25s ease', cursor: 'pointer', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              Our Story
            </a>
          </div>

          {/* Service badges */}
          <div className="hero-badges flex items-center justify-center gap-2 pt-2"
            style={{ animationDelay: '1.1s', flexWrap: 'nowrap' }}>
            {SERVICES.map(({ Icon, label }, i) => (
              <div
                key={label}
                ref={el => { badgeRefs.current[label] = el }}
                style={{ position: 'relative', zIndex: 99 }}
                onMouseEnter={() => handleMouseEnter(label)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchBadge(label)}
                onClick={() => handleClickBadge(label)}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: 'clamp(5px, 1.5vw, 6.79px) clamp(8px, 2.5vw, 15.26px)',
                  background: (hovered === label || mobileOpen === label) ? 'rgba(0,255,102,0.06)' : 'rgba(0,0,0,0.5)',
                  border: `1px solid ${(hovered === label || mobileOpen === label) ? 'rgba(0,255,102,0.50)' : 'rgba(0,255,102,0.18)'}`,
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: 'clamp(0.5rem, 1.8vw, 0.609rem)',
                  color: (hovered === label || mobileOpen === label) ? '#00ff66' : 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.1em',
                  transition: 'all 0.22s ease',
                  cursor: 'pointer',
                  animationDelay: `${1.1 + i * 0.1}s`,
                  boxShadow: (hovered === label || mobileOpen === label) ? '0 0 14px rgba(0,255,102,0.10)' : 'none',
                  userSelect: 'none',
                  zIndex: 1,
                }}>
                  <Icon size={14.3} style={{
                    color: '#00ff66',
                    filter: (hovered === label || mobileOpen === label) ? 'drop-shadow(0 0 4px rgba(0,255,102,0.8))' : 'none',
                    transition: 'filter 0.22s ease',
                  }} />
                  {label}
                </div>

                {/* Desktop only popover */}
                <ServicePopover
                  serviceKey={label}
                  visible={hovered === label}
                  onMouseEnter={() => { clearTimeout(hideTimer.current); setHovered(label) }}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile card portal — position: absolute so it scrolls with page */}
      {isMounted && mobileOpen && window.innerWidth < 640 && (
        <MobileCard
          serviceKey={mobileOpen}
          docTop={docTop}
          onNode={cardRefCallback}
        />
      )}

      <div className="absolute bottom-8 left-1/2 z-10 flex flex-col items-center gap-2" style={{ transform: 'translateX(-50%)' }} aria-hidden="true">
        <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.3)', animation: 'bounceDown 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}