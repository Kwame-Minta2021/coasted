import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/lib/supabase/auth'
import Script from 'next/script'
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo'
import GoogleAnalyticsDynamic from '@/components/GoogleAnalyticsDynamic'

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: 'Coasted Code – Hybrid AI, Robotics & Coding School',
    description: 'Empowering students aged 6-17 with cutting-edge technology education through live online classes, in-person labs, and AI-powered personalized learning experiences.',
    keywords: [
      'coding school Ghana',
      'programming for kids',
      'AI education Africa',
      'robotics for children',
      'STEM education Ghana',
      'online coding classes',
      'technology education',
      'youth programming',
      'digital literacy',
      'computer science for kids'
    ],
  }),
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/logo1.png',
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationStructuredData = generateStructuredData({
    type: 'EducationalOrganization',
    data: {}
  })

  const websiteStructuredData = generateStructuredData({
    type: 'WebSite',
    data: {}
  })

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalyticsDynamic measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-H2EE34FVLG'} />
        <ThemeProvider>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
