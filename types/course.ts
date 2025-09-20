export type Course = {
  id: string
  title: string
  level: string
  mode: string
  startDate: string
  duration: string
  price: string
  instructor: string
  image?: string
  meetLink?: string
  recordingUrl?: string

  // Optional structured fields
  category?: string
  ageRange?: string
  overview?: string
  outcomes?: string[]
  prerequisites?: string[]
  tools?: string[]
  modules?: {
    week?: string | number
    title: string
    items?: string[]
  }[]
}


