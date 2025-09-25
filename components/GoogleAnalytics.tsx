'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GoogleAnalyticsProps {
  measurementId: string
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    // Initialize gtag function exactly as Google provides
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments)
    }

    // Configure Google Analytics
    window.gtag('js', new Date())
    window.gtag('config', measurementId)
  }, [measurementId, isClient])

  // Don't render anything on server side
  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script - matches Google's recommended format */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        onLoad={() => {
          console.log('Google Analytics script loaded')
        }}
        onError={(e) => {
          console.error('Google Analytics script failed to load:', e)
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  )
}

// Utility functions for tracking events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag && window.dataLayer) {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }
}

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && window.dataLayer) {
    try {
      const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-H2EE34FVLG'
      window.gtag('config', measurementId, {
        page_title: title || document.title,
        page_location: url,
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }
}

// Common tracking events for your application
export const trackEnrollment = (courseName: string, studentAge?: number) => {
  trackEvent('enrollment', 'engagement', courseName, studentAge)
}

export const trackCourseView = (courseName: string) => {
  trackEvent('course_view', 'engagement', courseName)
}

export const trackLessonComplete = (lessonName: string, courseName: string) => {
  trackEvent('lesson_complete', 'learning', `${courseName} - ${lessonName}`)
}

export const trackPayment = (amount: number, currency: string = 'GHS') => {
  trackEvent('purchase', 'ecommerce', currency, amount)
}

export const trackLogin = (userType: 'student' | 'instructor' | 'admin') => {
  trackEvent('login', 'authentication', userType)
}

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'engagement', searchTerm)
}
