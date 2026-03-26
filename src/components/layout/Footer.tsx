'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { COMPANY_INFO } from '@/lib/constants'

function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}

function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Footer() {
  const pathname = usePathname()
  const router = useRouter()

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return
      e.preventDefault()
      const id = href.slice(1)
      if (pathname === '/') {
        scrollToAnchor(id)
      } else {
        sessionStorage.setItem('scrollTo', id)
        router.push('/')
      }
    },
    [pathname, router]
  )

  return (
    <footer
      id="contact-footer"
      style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-glow)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/torch-logo.png"
              alt="Torch logo"
              width={130}
              height={44}
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            />
            <p className="font-space-mono leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              {COMPANY_INFO.tagline}
            </p>
            <p className="font-syne" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Jakarta, Indonesia
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-orbitron font-bold tracking-widest uppercase" style={{ color: 'var(--accent-green)', fontSize: '0.8rem' }}>
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: '/',         label: 'Home'     },
                { href: '/about',    label: 'About'    },
                { href: '#services', label: 'Services' },
                { href: '#contact',  label: 'Contact'  },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-space-mono tracking-wide transition-colors duration-200 w-fit"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-green)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-orbitron font-bold tracking-widest uppercase" style={{ color: 'var(--accent-green)', fontSize: '0.8rem' }}>
              Connect
            </h4>
            <div className="flex gap-4">
              {[
                { Icon: XLogo,     href: 'https://x.com',   label: 'X / Twitter' },
                { Icon: Instagram, href: 'https://www.instagram.com/torch.engineer?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram'   },
                { Icon: Linkedin,  href: 'https://www.linkedin.com/company/107182268/admin/dashboard/',  label: 'LinkedIn'    },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 corner-bracket relative transition-all duration-200"
                  style={{ border: '1px solid var(--border-glow)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent-green)'
                    e.currentTarget.style.borderColor = 'var(--accent-green)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border-glow)'
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="font-space-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: 'var(--accent-green)' }}>
                {COMPANY_INFO.email}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-glow)' }}
        >
          <p className="font-space-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            © 2022 TOR-CH. All rights reserved.
          </p>
          <p className="font-space-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
  <span style={{ color: '#ffffff' }}>HardCode.</span>{' '}
  <span style={{ color: 'var(--accent-green)' }}>Your Legacy.</span>
</p>
        </div>
      </div>
    </footer>
  )
}