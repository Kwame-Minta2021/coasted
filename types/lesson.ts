export type LessonResource = {
  title: string
  url: string
}

export type Lesson = {
  id: string
  title: string
  description: string
  durationMinutes: number
  status?: 'not_started' | 'in_progress' | 'completed'
  videoUrl?: string
  resources?: LessonResource[]
}


