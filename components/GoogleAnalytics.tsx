'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId)

    return () => {
      // Cleanup
      document.head.removeChild(script)
    }
  }, [measurementId])

  return null
}

// Utility functions for tracking events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-H2EE34FVLG'
    window.gtag('config', measurementId, {
      page_title: title || document.title,
      page_location: url,
    })
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
