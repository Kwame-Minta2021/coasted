export interface Track {
  slug: string
  name: string
  tagline: string
  ages: string
  duration: string
  cadence: string
  delivery: string
  outcomes: string[]
  price: {
    enrollment: number
    monthly: number
  }
}

export const TRACKS: Track[] = [
  {
    slug: 'junior-makers',
    name: 'Junior Makers',
    tagline: 'Creative coding & robotics for young minds',
    ages: 'Ages 6-9',
    duration: '12 weeks',
    cadence: '2x/week',
    delivery: 'Online + In-person labs',
    outcomes: [
      'Build confidence with technology',
      'Create simple animations and games',
      'Understand basic robotics concepts',
      'Develop problem-solving skills'
    ],
    price: {
      enrollment: 650,
      monthly: 200
    }
  },
  {
    slug: 'app-builder',
    name: 'App Builder',
    tagline: 'Mobile apps & web development',
    ages: 'Ages 10-13',
    duration: '16 weeks',
    cadence: '3x/week',
    delivery: 'Online + In-person labs',
    outcomes: [
      'Build functional mobile apps',
      'Create responsive websites',
      'Learn JavaScript and Python',
      'Understand app deployment'
    ],
    price: {
      enrollment: 750,
      monthly: 250
    }
  },
  {
    slug: 'ai-robotics',
    name: 'AI & Robotics',
    tagline: 'Advanced programming & AI integration',
    ages: 'Ages 14-17',
    duration: '20 weeks',
    cadence: '3x/week',
    delivery: 'Online + In-person labs',
    outcomes: [
      'Build AI-powered applications',
      'Create advanced robotics systems',
      'Learn machine learning basics',
      'Develop portfolio projects'
    ],
    price: {
      enrollment: 800,
      monthly: 299
    }
  }
]
