import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact Coasted Code - Get in Touch',
  description: 'Contact Coasted Code for inquiries about our coding programs, enrollment, or partnerships. We\'re here to help with your child\'s technology education journey.',
  keywords: [
    'contact coding school',
    'Coasted Code contact',
    'coding education inquiry',
    'STEM education contact',
    'programming school Ghana',
    'technology education support',
    'coding classes inquiry',
    'robotics education contact',
    'AI education support',
    'coding school partnership'
  ],
  url: '/contact'
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
