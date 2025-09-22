import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || 'https://coastedcode.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/instructor/',
          '/student/',
          '/guardian/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/enroll/callback',
          '/payment/',
          '/debug/',
          '/test/',
          '/auth-setup-guide/',
          '/forgot-password/',
          '/reset-password/',
          '/instructor-*/',
          '/debug-*/',
          '/test-*/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/instructor/',
          '/student/',
          '/guardian/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/enroll/callback',
          '/payment/',
          '/debug/',
          '/test/',
          '/auth-setup-guide/',
          '/forgot-password/',
          '/reset-password/',
          '/instructor-*/',
          '/debug-*/',
          '/test-*/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
