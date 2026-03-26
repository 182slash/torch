import type { Metadata } from 'next'
import { Orbitron, Space_Mono, Syne } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const ChatWidget = dynamic(
  () => import('@/components/chat/ChatWidget').then(m => m.ChatWidget),
  { ssr: false }
)

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://torchengineer.com'),
  title: 'Torch – IT Engineering Solutions',
  description:
    'Expert services in networking, cybersecurity and web development. Your success powered by expert IT solutions for unstoppable growth.',
  keywords: [
    'networking',
    'cybersecurity',
    'web development',
    'IT infrastructure',
    'Indonesia',
    'IT engineering',
    'software development',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Torch – IT Engineering Solutions',
    description:
      'Expert services in networking, cybersecurity and web development.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Torch – IT Engineering Solutions',
    description:
      'Expert services in networking, cybersecurity and web development.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceMono.variable} ${syne.variable}`}
    >
      <body className="bg-[var(--bg-void)] text-[var(--text-primary)] font-syne antialiased">
        <div className="page-transition-overlay" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}