import { AboutSection } from '@/components/sections/AboutSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Torch IT Engineering',
  description:
    'Learn about Torch, our story, mission, and the team of engineers passionate about delivering world-class IT solutions in Indonesia.',
}

export default function AboutPage() {
  return <AboutSection />
}
