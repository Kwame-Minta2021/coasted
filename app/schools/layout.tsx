import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'School Partnerships - Coasted Code',
  description: 'Partner with Coasted Code to bring cutting-edge technology education to your school. Custom coding programs, teacher training, and curriculum integration.',
  keywords: [
    'school partnerships',
    'coding education schools',
    'STEM curriculum integration',
    'technology education partnerships',
    'coding programs schools',
    'robotics education schools',
    'AI education partnerships',
    'school technology programs',
    'coding curriculum schools',
    'STEM education partnerships'
  ],
  url: '/schools'
})

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
