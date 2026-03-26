'use client'

import { useEffect, useRef } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SERVICE_CATEGORIES } from '@/lib/constants'
import type { LucideIcon } from 'lucide-react'

function ServiceCard({
  title,
  description,
  icon: Icon,
  delay = 0,
}: {
  title: string
  description: string
  icon: LucideIcon
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check if already in view on mount
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

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-glow)',
        position: 'relative',
        padding: '24px',
      }}
      className="corner-bracket group hover:-translate-y-1 hover:border-[var(--accent-cyan)]"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-cyan)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(0,212,255,0.08)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glow)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Icon badge */}
        <div
          style={{
            width: '44px',
            height: '44px',
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color: 'var(--accent-cyan)' }} />
        </div>

        {/* Title */}
        <h3
          className="font-orbitron font-bold text-sm tracking-wide"
          style={{ color: 'var(--accent-green)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="font-syne text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    // Make header visible immediately if in viewport
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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      className="relative py-24"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Dot pattern bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 50%, rgba(0,212,255,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(0,255,136,0.02) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p
            className="font-space-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--accent-cyan)' }}
          >
            What We Do
          </p>
          <h2
            className="font-orbitron font-black"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              color: 'var(--text-primary)',
            }}
          >
            Our Services
          </h2>
        </div>

        {/* Categories */}
        {SERVICE_CATEGORIES.map((category) => (
          <div key={category.id}>
            <SectionTitle label={category.name} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.services.map((service, i) => (
                <ServiceCard
                  key={`${category.id}-${service.title}`}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}