import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Learning Tracks - Creative Coding, Robotics & AI',
  description: 'Explore our comprehensive learning tracks: Creative Coding, Robotics & Automation, and AI & Machine Learning. Designed for students aged 6-17 with hands-on projects.',
  keywords: [
    'coding tracks',
    'robotics learning track',
    'AI machine learning course',
    'creative coding program',
    'STEM learning paths',
    'programming tracks kids',
    'technology education tracks',
    'coding curriculum paths',
    'robotics education Ghana',
    'AI education children'
  ],
  url: '/tracks'
})

export default function TracksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
