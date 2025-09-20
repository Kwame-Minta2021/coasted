import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/lib/supabase/auth'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Coasted Code – Hybrid AI, Robotics & Coding School',
  description: 'Live online classes (Google Meet), in-person labs, and on-demand content for ages 6–17.',
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/logo1.png',
  },
  openGraph: {
    title: 'Coasted Code – Hybrid AI, Robotics & Coding School',
    description: 'Empowering students aged 6-17 with cutting-edge technology education',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coasted Code – Hybrid AI, Robotics & Coding School',
    description: 'Empowering students aged 6-17 with cutting-edge technology education',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
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
