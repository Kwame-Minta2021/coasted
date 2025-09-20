export interface Lesson {
  id: string
  title: string
  duration: string
  status: 'not_started' | 'in_progress' | 'completed'
  track: string
  description?: string
}

export interface Course {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  progress: number
}

export interface Tutorial {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
}

export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Coding',
    duration: '15 min',
    status: 'completed',
    track: 'Junior Makers',
    description: 'Learn the basics of programming concepts'
  },
  {
    id: '2',
    title: 'Building Your First Game',
    duration: '20 min',
    status: 'in_progress',
    track: 'Junior Makers',
    description: 'Create a simple game using Scratch'
  },
  {
    id: '3',
    title: 'Robotics Fundamentals',
    duration: '25 min',
    status: 'not_started',
    track: 'Junior Makers',
    description: 'Understanding basic robotics concepts'
  },
  {
    id: '4',
    title: 'Web Development Basics',
    duration: '30 min',
    status: 'not_started',
    track: 'App Builder',
    description: 'Introduction to HTML and CSS'
  },
  {
    id: '5',
    title: 'JavaScript Fundamentals',
    duration: '35 min',
    status: 'not_started',
    track: 'App Builder',
    description: 'Learn JavaScript programming basics'
  },
  {
    id: '6',
    title: 'AI and Machine Learning',
    duration: '40 min',
    status: 'not_started',
    track: 'AI & Robotics',
    description: 'Introduction to artificial intelligence'
  }
]

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'junior-makers',
    title: 'Junior Makers',
    description: 'Creative coding & robotics for young minds',
    lessons: SAMPLE_LESSONS.filter(l => l.track === 'Junior Makers'),
    progress: 33
  },
  {
    id: 'app-builder',
    title: 'App Builder',
    description: 'Mobile apps & web development',
    lessons: SAMPLE_LESSONS.filter(l => l.track === 'App Builder'),
    progress: 0
  },
  {
    id: 'ai-robotics',
    title: 'AI & Robotics',
    description: 'Advanced programming & AI integration',
    lessons: SAMPLE_LESSONS.filter(l => l.track === 'AI & Robotics'),
    progress: 0
  }
]

export const getLessonsByTrack = (track: string): Lesson[] => {
  return SAMPLE_LESSONS.filter(lesson => lesson.track === track)
}

export const getCourseProgress = (track: string): number => {
  const lessons = getLessonsByTrack(track)
  if (lessons.length === 0) return 0
  
  const completed = lessons.filter(l => l.status === 'completed').length
  return Math.round((completed / lessons.length) * 100)
}

export const sampleTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Coding',
    description: 'Learn the fundamentals of programming and set up your development environment',
    videoUrl: 'https://example.com/tutorial1',
    duration: '15 min'
  },
  {
    id: '2',
    title: 'Building Your First Web App',
    description: 'Create a simple web application using HTML, CSS, and JavaScript',
    videoUrl: 'https://example.com/tutorial2',
    duration: '25 min'
  },
  {
    id: '3',
    title: 'Introduction to Robotics',
    description: 'Learn basic robotics concepts and build your first robot',
    videoUrl: 'https://example.com/tutorial3',
    duration: '30 min'
  },
  {
    id: '4',
    title: 'AI Fundamentals',
    description: 'Understand artificial intelligence and machine learning basics',
    videoUrl: 'https://example.com/tutorial4',
    duration: '20 min'
  },
  {
    id: '5',
    title: 'Game Development Basics',
    description: 'Create simple games using programming concepts',
    videoUrl: 'https://example.com/tutorial5',
    duration: '35 min'
  },
  {
    id: '6',
    title: 'Mobile App Development',
    description: 'Build mobile applications for iOS and Android',
    videoUrl: 'https://example.com/tutorial6',
    duration: '40 min'
  }
]
