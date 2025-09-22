import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Meet Our Team - Coasted Code Instructors',
  description: 'Meet the passionate educators and technology experts behind Coasted Code. Our team is dedicated to inspiring the next generation of coders and innovators.',
  keywords: [
    'Coasted Code team',
    'coding instructors',
    'technology educators',
    'STEM teachers Ghana',
    'programming mentors',
    'coding school staff',
    'robotics instructors',
    'AI education experts',
    'technology education team',
    'coding mentors Africa'
  ],
  url: '/team'
})

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
