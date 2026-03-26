'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X as XIcon, Instagram, Linkedin } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'

function XLogo({ size = 17 }: { size?: number }) {
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

// Tracks which anchor section (#services, #contact) is currently scrolled to.
// Returns the section id, or 'home' if above all sections.
function useScrollSpy(sectionIds: string[]): string {
  const [active, setActive] = useState('home')

  useEffect(() => {
    if (sectionIds.length === 0) return

    const NAVBAR_H = 80

    const compute = () => {
      const scrollY = window.scrollY + NAVBAR_H + 10
      let found = 'home'
      sectionIds.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) found = id
      })
      setActive(found)
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    return () => window.removeEventListener('scroll', compute)
  }, [sectionIds.join(',')])

  return active
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Only anchor links need scroll spy — extract their ids
  const anchorIds = NAV_LINKS
    .filter(l => l.href.startsWith('#') || l.href.startsWith('/#'))
    .map(l => l.href.startsWith('/#') ? l.href.slice(2) : l.href.slice(1))

  // Only run scroll spy on homepage where the anchors live
  const activeSection = useScrollSpy(pathname === '/' ? anchorIds : [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  useEffect(() => {
    const pending = sessionStorage.getItem('scrollTo')
    if (!pending || pathname !== '/') return
    sessionStorage.removeItem('scrollTo')
    const t = setTimeout(() => scrollToAnchor(pending), 120)
    return () => clearTimeout(t)
  }, [pathname])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault()
        const id = href.slice(1)
        pathname === '/' ? scrollToAnchor(id) : (sessionStorage.setItem('scrollTo', id), router.push('/'))
        setIsMenuOpen(false)
        return
      }
      if (href.startsWith('/#')) {
        e.preventDefault()
        const id = href.slice(2)
        pathname === '/' ? scrollToAnchor(id) : (sessionStorage.setItem('scrollTo', id), router.push('/'))
        setIsMenuOpen(false)
        return
      }
    },
    [pathname, router]
  )

  // Determine if a nav link is active.
  const isLinkActive = (href: string): boolean => {
    // ── Anchor link: #services or #contact ──
    if (href.startsWith('#')) {
      const id = href.slice(1)
      return pathname === '/' && activeSection === id
    }
    if (href.startsWith('/#')) {
      const id = href.slice(2)
      return pathname === '/' && activeSection === id
    }
    // ── Home route ──
    if (href === '/') {
      // Only active on homepage when no anchor section has been scrolled into
      return pathname === '/' && activeSection === 'home'
    }
    // ── Any other route e.g. /about ──
    // Strip trailing slashes and compare
    const clean = (p: string) => p.replace(/\/$/, '') || '/'
    return clean(pathname) === clean(href)
  }

  const navLinkEl = (link: { href: string; label: string }, isMobile = false) => {
    const active = isLinkActive(link.href)
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`font-orbitron font-bold tracking-widest uppercase relative ${isMobile ? 'py-2 inline-block' : ''}`}
        style={{
          fontSize: isMobile ? '0.82rem' : '0.78rem',
          color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
          transition: 'color 0.2s ease',
        }}
        onClick={(e) => handleNavClick(e, link.href)}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-green)')}
        onMouseLeave={e => (e.currentTarget.style.color = active ? 'var(--accent-green)' : 'var(--text-secondary)')}
      >
        {link.label}
        {active && (
          <span
            className={`absolute left-0 right-0 h-px ${isMobile ? 'bottom-1' : '-bottom-1'}`}
            style={{ background: 'var(--accent-green)', boxShadow: '0 0 6px rgba(0,255,102,0.6)' }}
          />
        )}
      </Link>
    )
  }

  const socialLinks = [
    { Icon: XLogo,     href: 'https://x.com',                                                                                       label: 'X / Twitter' },
    { Icon: Instagram, href: 'https://www.instagram.com/torch.engineer?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram'   },
    { Icon: Linkedin,  href: 'https://www.linkedin.com/company/107182268',                                                           label: 'LinkedIn'    },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'navbar-scrolled' : 'py-4'}`}
      style={{
        background: isScrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glow)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/torch-logo.png" alt="Torch logo"
            width={120} height={40}
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => navLinkEl(link))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-green)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="font-orbitron font-bold tracking-widest uppercase"
            style={{
              fontSize: '0.75rem', padding: '8px 20px',
              border: '1px solid var(--accent-green)',
              color: 'var(--accent-green)', background: 'transparent',
              letterSpacing: '0.15em', transition: 'all 0.22s ease',
              cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 0 10px rgba(0,255,102,0.15)',
            }}
            onClick={(e) => handleNavClick(e, '#contact')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,102,0.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,102,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,102,0.15)' }}
          >
            Contact Us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden transition-all duration-300 overflow-hidden"
        style={{ maxHeight: isMenuOpen ? '400px' : '0', opacity: isMenuOpen ? 1 : 0 }}
      >
        <div className="px-6 py-4 flex flex-col gap-4"
          style={{ borderTop: '1px solid var(--border-glow)', background: 'rgba(0,0,0,0.98)' }}>
          {NAV_LINKS.map(link => navLinkEl(link, true))}
          <div className="flex items-center gap-4 pt-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: 'var(--text-secondary)' }}>
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}