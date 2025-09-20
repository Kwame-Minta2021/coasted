export type TrackModule = { week: number; title: string; items?: string[] }

export interface Track {
  slug: string
  name: string
  tagline: string
  badge: string
  ages: string
  duration: string
  cadence: string
  delivery: 'Online' | 'In-Lab' | 'Hybrid'
  overview: string
  outcomes: string[]
  prerequisites: string[]
  tools: string[]
  projects: string[]
  heroImage?: string
  modules: Array<{
    week: number
    title: string
  }>
  modes: Array<{
    type: 'in-lab' | 'online' | 'hybrid'
    name: string
    price: number
    features: string[]
    schedule: string
    location: string
    instructors: Array<{
      name: string
      specialty: string
    }>
  }>
}
