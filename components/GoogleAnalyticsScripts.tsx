'use client'

import Script from 'next/script'

interface GoogleAnalyticsScriptsProps {
  measurementId: string
}

export default function GoogleAnalyticsScripts({ measurementId }: GoogleAnalyticsScriptsProps) {
  return (
    <>
      {/* Google Analytics Script - matches Google's recommended format */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        onLoad={() => {
          console.log('Google Analytics script loaded successfully')
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
