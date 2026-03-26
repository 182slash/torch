'use client'

import { useState, useEffect, useRef } from 'react'
import { Instagram, Linkedin, Send } from 'lucide-react'

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}
import { usePathname, useRouter } from 'next/navigation'

function useReveal(delay = 0) {
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
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

const hiddenStyle = (delay = 0): React.CSSProperties => ({
  opacity: 0,
  transform: 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
})

export function ContactSection() {
  const [btnHovered, setBtnHovered] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const refLabel   = useReveal(0)
  const refHeading = useReveal(80)
  const refBody    = useReveal(160)
  const refForm    = useReveal(240)
  const refDivider = useReveal(320)
  const refSocial  = useReveal(400)

  // After navigating to '/', scroll to the pending anchor
  useEffect(() => {
    const pending = sessionStorage.getItem('scrollTo')
    if (!pending || pathname !== '/') return
    sessionStorage.removeItem('scrollTo')
    const t = setTimeout(() => {
      const el = document.getElementById(pending)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(t)
  }, [pathname])

  function handleGetStarted() {
    router.push('/contact')
  }

  return (
    <section
      id="contact"
      style={{
        paddingTop: '77px',
        paddingBottom: '77px',
        position: 'relative',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-glow)',
      }}
    >
      {/* Gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Label */}
        <div ref={refLabel} style={{ ...hiddenStyle(0), marginBottom: '10px' }}>
          <span
            className="font-space-mono uppercase"
            style={{
              color: 'var(--accent-cyan)',
              fontSize: '0.607rem',
              letterSpacing: '0.3em',
            }}
          >
            Connect With Us
          </span>
        </div>

        {/* Heading */}
        <div ref={refHeading} style={{ ...hiddenStyle(80), marginBottom: '13px' }}>
          <h2
            className="font-orbitron font-black"
            style={{
              fontSize: 'clamp(22.7px, 4.05vw, 38.9px)',
              color: 'var(--text-primary)',
            }}
          >
            GET EXPERT
            <br />
            <span style={{ color: 'var(--accent-cyan)' }}>IT SOLUTIONS</span>
          </h2>
        </div>

        {/* Body */}
        <div ref={refBody} style={{ ...hiddenStyle(160), marginBottom: '32.4px' }}>
          <p
            className="font-syne"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.81rem',
              lineHeight: 1.7,
              whiteSpace: 'normal',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Ready to transform your business with cutting-edge IT engineering? Drop us a message and let&apos;s build something extraordinary.
          </p>
        </div>

        {/* Get Started button */}
        <div ref={refForm} style={{ ...hiddenStyle(240), marginBottom: '32.4px' }}>
          <button
            type="button"
            onClick={handleGetStarted}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 36px',
              background: btnHovered ? 'transparent' : 'var(--accent-green)',
              color: btnHovered ? 'var(--accent-green)' : '#000000',
              border: '1px solid var(--accent-green)',
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: btnHovered
                ? '0 0 24px rgba(0,255,102,0.4)'
                : '0 0 14px rgba(0,255,102,0.2)',
              transition: 'background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease',
            }}
          >
            <Send size={12} />
            GET STARTED
          </button>
        </div>

        {/* Divider */}
        <div
          ref={refDivider}
          style={{
            ...hiddenStyle(320),
            height: '1px',
            marginBottom: '32.4px',
            background: 'linear-gradient(90deg, transparent, var(--border-glow), transparent)',
          }}
        />

        {/* Social icons */}
        <div
          ref={refSocial}
          style={{
            ...hiddenStyle(400),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16.2px',
          }}
        >
          {[
            { Icon: XLogo,     href: 'https://x.com',                                                                                         label: 'X / Twitter' },
            { Icon: Instagram, href: 'https://www.instagram.com/torch.engineer?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',   label: 'Instagram'   },
            { Icon: Linkedin,  href: 'https://www.linkedin.com/company/107182268',                                                             label: 'LinkedIn'    },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="corner-bracket relative transition-all duration-200"
              style={{
                padding: '9.7px',
                border: '1px solid var(--border-glow)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-cyan)'
                e.currentTarget.style.borderColor = 'var(--accent-cyan)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.borderColor = 'var(--border-glow)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}