'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowLeft, CheckCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID  = '1998torch'
const EMAILJS_TEMPLATE_ID = 'template_4sz8wrr'
const EMAILJS_PUBLIC_KEY  = 'ySb24KnaLmBW7s8BQ'

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

type FormData = {
  name: string
  company: string
  phone: string
  email: string
  project_type: string
  budget: string
  message: string
}

const INITIAL: FormData = {
  name:         '',
  company:      '',
  phone:        '',
  email:        '',
  project_type: '',
  budget:       '',
  message:      '',
}

const PROJECT_TYPES = [
  'Network Infrastructure',
  'Cybersecurity',
  'Web Development',
  'IT Consulting',
  'Cloud Solutions',
  'Software Development',
  'Other',
]

const BUDGET_RANGES = [
  'Rp 1.000.000 – Rp 5.000.000',
  'Rp 5.000.000 – Rp 20.000.000',
  'Rp 20.000.000 – Rp 50.000.000',
  'Rp 50.000.000 – Rp 100.000.000',
  'Rp 100.000.000 – Rp 500.000.000',
  'Rp 500.000.000+',
  'Belum tahu / Not sure yet',
]

// Validates required fields and returns an error string or null
function validate(form: FormData): string | null {
  if (!form.name.trim())         return 'Full name is required.'
  if (!form.email.trim())        return 'Email address is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                                 return 'Please enter a valid email address.'
  if (!form.project_type)        return 'Please select a project type.'
  if (!form.message.trim())      return 'Please tell us about your project.'
  return null
}

export default function ContactPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [form, setForm]             = useState<FormData>(INITIAL)
  const [sending, setSending]       = useState(false)
  const [sent, setSent]             = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [btnHovered, setBtnHovered] = useState(false)
  const [backHovered, setBackHovered] = useState(false)
  const [focused, setFocused]       = useState<string | null>(null)

  const refLabel   = useReveal(0)
  const refHeading = useReveal(80)
  const refForm    = useReveal(160)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field-level error on change
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (error) setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side validation
    const validationError = validate(form)
    if (validationError) {
      setError(validationError)
      // Highlight specific required empty fields
      const errs: Partial<Record<keyof FormData, string>> = {}
      if (!form.name.trim())    errs.name = 'Required'
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                                errs.email = 'Required'
      if (!form.project_type)   errs.project_type = 'Required'
      if (!form.message.trim()) errs.message = 'Required'
      setFieldErrors(errs)
      return
    }

    if (!formRef.current) return
    setSending(true)
    setError(null)
    setFieldErrors({})

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setSent(true)
      setForm(INITIAL)
    } catch (err) {
      console.error('EmailJS error:', err)
      setError('Something went wrong. Please try again or email us directly at support@torchengineer.com')
    } finally {
      setSending(false)
    }
  }

  // ── Animated glow border via CSS — injected once ──────────────────────────
  const glowCSS = `
    @keyframes contact-glow-spin {
      0%   { box-shadow: 2px 0   0 0 rgba(0,212,255,0.9), 0 0 8px 2px rgba(0,212,255,0.15); }
      25%  { box-shadow: 0  2px  0 0 rgba(0,212,255,0.9), 0 0 8px 2px rgba(0,212,255,0.15); }
      50%  { box-shadow: -2px 0  0 0 rgba(0,212,255,0.9), 0 0 8px 2px rgba(0,212,255,0.15); }
      75%  { box-shadow: 0 -2px  0 0 rgba(0,212,255,0.9), 0 0 8px 2px rgba(0,212,255,0.15); }
      100% { box-shadow: 2px 0   0 0 rgba(0,212,255,0.9), 0 0 8px 2px rgba(0,212,255,0.15); }
    }
    @keyframes contact-glow-border {
      0%   { border-color: rgba(0,212,255,1);   }
      25%  { border-color: rgba(0,255,102,0.8); }
      50%  { border-color: rgba(0,212,255,1);   }
      75%  { border-color: rgba(0,255,102,0.8); }
      100% { border-color: rgba(0,212,255,1);   }
    }
    .field-focused {
      border-color: rgba(0,212,255,1) !important;
      animation: contact-glow-border 1.8s ease-in-out infinite,
                 contact-glow-spin   1.8s linear      infinite;
      outline: none;
    }
    .field-error {
      border-color: rgba(255,80,80,0.8) !important;
      box-shadow: 0 0 8px rgba(255,80,80,0.2);
    }
  `

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-void)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.81rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'var(--accent-cyan)',
    marginBottom: '6px',
  }

  const fieldClass = (name: string) => {
    const classes = []
    if (focused === name)                        classes.push('field-focused')
    if (fieldErrors[name as keyof FormData])     classes.push('field-error')
    return classes.join(' ')
  }

  if (sent) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'var(--bg-void)',
          backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <CheckCircle size={48} style={{ color: 'var(--accent-green)', margin: '0 auto 20px' }} />
          <h2
            className="font-orbitron font-black"
            style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: 'var(--text-primary)', marginBottom: '12px' }}
          >
            MESSAGE SENT
          </h2>
          <p
            className="font-syne"
            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '32px' }}
          >
            Thanks for reaching out. We&apos;ll get back to you at{' '}
            <span style={{ color: 'var(--accent-cyan)' }}>{form.email || 'your email'}</span>{' '}
            as soon as possible.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 26px', background: 'transparent',
              color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)',
              fontFamily: 'var(--font-orbitron)', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'box-shadow 0.2s ease',
            }}
          >
            <ArrowLeft size={12} />
            Back to Home
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-void)',
        backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        padding: '80px 24px 80px',
      }}
    >
      <style>{glowCSS}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: backHovered ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-space-mono)', fontSize: '0.72rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '48px', padding: 0, transition: 'color 0.2s ease',
          }}
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {/* Label */}
        <div ref={refLabel} style={{ ...hiddenStyle(0), marginBottom: '10px' }}>
          <span className="font-space-mono uppercase"
            style={{ color: 'var(--accent-cyan)', fontSize: '0.607rem', letterSpacing: '0.3em' }}>
            Let&apos;s Work Together
          </span>
        </div>

        {/* Heading */}
        <div ref={refHeading} style={{ ...hiddenStyle(80), marginBottom: '40px' }}>
          <h1 className="font-orbitron font-black"
            style={{ fontSize: 'clamp(22px, 4vw, 38px)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            START YOUR
            <br />
            <span style={{ color: 'var(--accent-cyan)' }}>PROJECT</span>
          </h1>
        </div>

        {/* Form */}
        <div ref={refForm} style={hiddenStyle(160)}>
          <form ref={formRef} onSubmit={handleSubmit} noValidate>

            <input type="hidden" name="to_email" value="support@torchengineer.com" />

            {/* Row 1 — Name + Company */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Full Name <span style={{ color: 'rgba(255,80,80,0.8)' }}>*</span>
                </label>
                <input
                  id="name" name="name" type="text"
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="Your Name"
                  className={fieldClass('name')}
                  style={inputStyle}
                />
                {fieldErrors.name && <p style={{ color: 'rgba(255,80,80,0.9)', fontSize: '0.6rem', marginTop: '4px', fontFamily: 'var(--font-space-mono)' }}>{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="company" style={labelStyle}>Company / Organization</label>
                <input
                  id="company" name="company" type="text"
                  value={form.company} onChange={handleChange}
                  onFocus={() => setFocused('company')}
                  onBlur={() => setFocused(null)}
                  placeholder="Your Company"
                  className={fieldClass('company')}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2 — Phone + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="phone" style={labelStyle}>Phone Number</label>
                <input
                  id="phone" name="phone" type="tel"
                  value={form.phone} onChange={handleChange}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="+62 821 0000 0000"
                  className={fieldClass('phone')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email Address <span style={{ color: 'rgba(255,80,80,0.8)' }}>*</span>
                </label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="your@mail.com"
                  className={fieldClass('email')}
                  style={inputStyle}
                />
                {fieldErrors.email && <p style={{ color: 'rgba(255,80,80,0.9)', fontSize: '0.6rem', marginTop: '4px', fontFamily: 'var(--font-space-mono)' }}>{fieldErrors.email}</p>}
              </div>
            </div>

            {/* Row 3 — Project Type + Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="project_type" style={labelStyle}>
                  Project Type <span style={{ color: 'rgba(255,80,80,0.8)' }}>*</span>
                </label>
                <select
                  id="project_type" name="project_type"
                  value={form.project_type} onChange={handleChange}
                  onFocus={() => setFocused('project_type')}
                  onBlur={() => setFocused(null)}
                  className={fieldClass('project_type')}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select a type…</option>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {fieldErrors.project_type && <p style={{ color: 'rgba(255,80,80,0.9)', fontSize: '0.6rem', marginTop: '4px', fontFamily: 'var(--font-space-mono)' }}>{fieldErrors.project_type}</p>}
              </div>
              <div>
                <label htmlFor="budget" style={labelStyle}>Estimated Budget</label>
                <select
                  id="budget" name="budget"
                  value={form.budget} onChange={handleChange}
                  onFocus={() => setFocused('budget')}
                  onBlur={() => setFocused(null)}
                  className={fieldClass('budget')}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select a range…</option>
                  {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4 — Message */}
            <div style={{ marginBottom: '32px' }}>
              <label htmlFor="message" style={labelStyle}>
                Tell Us About Your Project <span style={{ color: 'rgba(255,80,80,0.8)' }}>*</span>
              </label>
              <textarea
                id="message" name="message"
                value={form.message} onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                placeholder="Describe your project, goals, timeline, and any specific requirements…"
                rows={6}
                className={fieldClass('message')}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              />
              {fieldErrors.message && <p style={{ color: 'rgba(255,80,80,0.9)', fontSize: '0.6rem', marginTop: '4px', fontFamily: 'var(--font-space-mono)' }}>{fieldErrors.message}</p>}
            </div>

            {/* General error */}
            {error && (
              <div style={{
                marginBottom: '20px', padding: '12px 16px',
                border: '1px solid rgba(255,60,60,0.4)',
                color: '#ff6b6b', fontFamily: 'var(--font-space-mono)',
                fontSize: '0.75rem', lineHeight: 1.6,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '13px 36px',
                background: sending ? 'transparent' : btnHovered ? 'transparent' : 'var(--accent-green)',
                color: sending ? 'var(--text-secondary)' : btnHovered ? 'var(--accent-green)' : '#000000',
                border: `1px solid ${sending ? 'var(--border-glow)' : 'var(--accent-green)'}`,
                fontFamily: 'var(--font-orbitron)', fontWeight: 700,
                fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', cursor: sending ? 'not-allowed' : 'pointer',
                boxShadow: btnHovered && !sending ? '0 0 24px rgba(0,255,102,0.4)' : '0 0 14px rgba(0,255,102,0.2)',
                transition: 'background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease',
              }}
            >
              <Send size={13} />
              {sending ? 'SENDING…' : 'SEND REQUEST'}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}