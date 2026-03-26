import { Network, Shield, Wrench, Code2, Link2, Settings, Globe, Layers, Activity } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ServiceItem {
  title: string
  description: string
  icon: LucideIcon
}

export interface ServiceCategory {
  id: string
  name: string
  services: ServiceItem[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'network',
    name: 'NETWORK',
    services: [
      {
        title: 'Infrastructure',
        description:
          'Design and deployment of scalable, secure wired and wireless network infrastructures.',
        icon: Network,
      },
      {
        title: 'Security',
        description:
          'VPN and firewall setup, network performance optimization, and cybersecurity solutions.',
        icon: Shield,
      },
      {
        title: 'Support',
        description: 'Ongoing monitoring and support for network health and security.',
        icon: Wrench,
      },
    ],
  },
  {
    id: 'software',
    name: 'SOFTWARE',
    services: [
      {
        title: 'Development',
        description:
          'Develop tailored software solutions to meet specific business needs, from mobile apps to enterprise-level systems.',
        icon: Code2,
      },
      {
        title: 'Integration',
        description:
          'Integrate third-party services and APIs into software applications for seamless functionality across platforms.',
        icon: Link2,
      },
      {
        title: 'Support',
        description:
          'Provide ongoing maintenance and updates to ensure software scalability, security, and performance as business needs evolve.',
        icon: Settings,
      },
    ],
  },
  {
    id: 'website',
    name: 'WEBSITE',
    services: [
      {
        title: 'Development',
        description: 'Full-stack web development for building dynamic, responsive websites.',
        icon: Globe,
      },
      {
        title: 'Design',
        description: 'Custom website design UX/UI development tailored to business needs.',
        icon: Layers,
      },
      {
        title: 'Support',
        description: 'Ongoing support for website performance optimization and security.',
        icon: Activity,
      },
    ],
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
]

export const SOCIAL_LINKS = {
  twitter: 'https://x.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
}

export const COMPANY_INFO = {
  name: 'torch.',
  tagline: 'Engineering Solutions. Empowering Business.',
  subTagline: 'Your Success, Powered by Expert IT Solutions for Unstoppable Growth',
  email: 'support@torchengineer.com',
  location: 'Indonesia',
}