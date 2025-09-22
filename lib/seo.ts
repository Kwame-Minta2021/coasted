import { Metadata } from 'next'

export const siteConfig = {
  name: 'Coasted Code',
  title: 'Coasted Code – Hybrid AI, Robotics & Coding School',
  description: 'Empowering students aged 6-17 with cutting-edge technology education through live online classes, in-person labs, and AI-powered personalized learning experiences.',
  url: process.env.SITE_URL || 'https://coastedcode.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/coastedcode',
    github: 'https://github.com/Kwame-Minta2021/coasted',
  },
  keywords: [
    'coding school',
    'programming for kids',
    'AI education',
    'robotics for children',
    'online coding classes',
    'STEM education',
    'computer science for kids',
    'coding bootcamp',
    'technology education',
    'digital literacy',
    'Ghana coding school',
    'African tech education',
    'youth programming',
    'coding curriculum',
    'tech skills for kids'
  ],
  authors: [
    {
      name: 'Coasted Code Team',
      url: 'https://coastedcode.com/team',
    },
  ],
  creator: 'Coasted Code',
  publisher: 'Coasted Code',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const fullDescription = description || siteConfig.description
  const fullImage = image || siteConfig.ogImage
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const allKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: '@coastedcode',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

export function generateStructuredData({
  type,
  data,
}: {
  type: 'Organization' | 'EducationalOrganization' | 'Course' | 'WebSite' | 'BreadcrumbList'
  data: any
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo1.png`,
        sameAs: [
          siteConfig.links.twitter,
          siteConfig.links.github,
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+233-XXX-XXXX',
          contactType: 'customer service',
          areaServed: 'GH',
          availableLanguage: 'English',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'GH',
          addressLocality: 'Accra',
        },
      }

    case 'EducationalOrganization':
      return {
        ...baseStructuredData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo1.png`,
        educationalCredentialAwarded: 'Certificate of Completion',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Coding and Technology Courses',
          itemListElement: [
            {
              '@type': 'Course',
              name: 'Ages 6-9: Creative Coding',
              description: 'Introduction to coding through creative projects',
              provider: {
                '@type': 'Organization',
                name: siteConfig.name,
              },
            },
            {
              '@type': 'Course',
              name: 'Ages 10-13: Advanced Programming',
              description: 'Intermediate programming concepts and projects',
              provider: {
                '@type': 'Organization',
                name: siteConfig.name,
              },
            },
            {
              '@type': 'Course',
              name: 'Ages 14-17: Professional Development',
              description: 'Advanced programming and career preparation',
              provider: {
                '@type': 'Organization',
                name: siteConfig.name,
              },
            },
          ],
        },
      }

    case 'Course':
      return {
        ...baseStructuredData,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        courseMode: 'online',
        educationalLevel: data.ageGroup,
        teaches: data.skills,
        timeRequired: data.duration,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'GHS',
          availability: 'https://schema.org/InStock',
        },
      }

    case 'WebSite':
      return {
        ...baseStructuredData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'BreadcrumbList':
      return {
        ...baseStructuredData,
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }

    default:
      return baseStructuredData
  }
}
