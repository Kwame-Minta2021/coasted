'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

interface GoogleAnalyticsProps {
  measurementId: string
}

// Dynamic component that only loads on client side
const GoogleAnalyticsScripts = dynamic(
  () => import('./GoogleAnalyticsScripts'),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function GoogleAnalyticsDynamic({ measurementId }: GoogleAnalyticsProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <GoogleAnalyticsScripts measurementId={measurementId} />
}
