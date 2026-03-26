import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { LiveStatusBar } from '@/components/sections/LiveStatusBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Torch – IT Engineering Solutions',
  description:
    'Expert services in networking, cybersecurity and web development. Your success powered by expert IT solutions for unstoppable growth.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveStatusBar />
      <ServicesSection />
      <ContactSection />
    </>
  )
}