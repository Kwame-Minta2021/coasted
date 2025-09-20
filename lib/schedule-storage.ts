import fs from 'fs'
import path from 'path'

const SCHEDULE_FILE = path.join(process.cwd(), 'data', 'schedule-events.json')

// Ensure data directory exists
const dataDir = path.dirname(SCHEDULE_FILE)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export interface ScheduleEvent {
  id: string
  instructor_id: string
  title: string
  description: string
  start_time: string
  end_time: string
  event_type: 'class' | 'meeting' | 'office_hours'
  age_group: string
  max_students: number
  meeting_link: string
  is_recurring: boolean
  recurrence_pattern: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

// Initialize with default events if file doesn't exist
const getDefaultEvents = (): ScheduleEvent[] => [
  {
    id: '1',
    instructor_id: '',
    title: 'Python Basics - Class 1',
    description: 'Introduction to Python programming',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    event_type: 'class',
    age_group: '10-13',
    max_students: 20,
    meeting_link: 'Online - Google Meet',
    is_recurring: false,
    recurrence_pattern: 'weekly',
    status: 'scheduled',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    instructor_id: '',
    title: 'Python Basics - Class 2',
    description: 'Variables and Data Types',
    start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    event_type: 'class',
    age_group: '10-13',
    max_students: 20,
    meeting_link: 'Online - Google Meet',
    is_recurring: false,
    recurrence_pattern: 'weekly',
    status: 'scheduled',
    created_at: new Date().toISOString()
  }
]

export function loadEvents(): ScheduleEvent[] {
  try {
    if (fs.existsSync(SCHEDULE_FILE)) {
      const data = fs.readFileSync(SCHEDULE_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading schedule events:', error)
  }
  
  // Return default events if file doesn't exist or can't be read
  const defaultEvents = getDefaultEvents()
  saveEvents(defaultEvents)
  return defaultEvents
}

export function saveEvents(events: ScheduleEvent[]): void {
  try {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(events, null, 2))
  } catch (error) {
    console.error('Error saving schedule events:', error)
  }
}

export function addEvent(event: ScheduleEvent): void {
  const events = loadEvents()
  events.push(event)
  saveEvents(events)
}

export function getEventsByInstructor(instructorId: string): ScheduleEvent[] {
  const events = loadEvents()
  return events.filter(event => 
    event.instructor_id === instructorId || 
    !event.instructor_id // Include default events
  )
}
