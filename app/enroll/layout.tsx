import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Enroll Your Child in Coding Classes - Coasted Code',
  description: 'Enroll your child in our comprehensive coding program. Ages 6-17. Flexible pricing starting from ₵650 enrollment. Secure payment via Mobile Money or Bank transfer.',
  keywords: [
    'enroll child coding',
    'coding classes enrollment',
    'programming course registration',
    'STEM education signup',
    'coding school Ghana',
    'online coding classes enrollment',
    'robotics course registration',
    'AI education signup',
    'technology education Ghana',
    'coding bootcamp enrollment'
  ],
  url: '/enroll'
})

export default function EnrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
