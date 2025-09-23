// lib/sheets.ts
import { parseCSV } from './csv'
import type { Course } from '@/types/course'

/** Required fields a row must have to show up */
const REQUIRED: (keyof Course)[] = [
  'id','title','level','mode','startDate','duration','price','instructor'
]

// Map header variants → our field keys (case/space-insensitive)
const MAP: Record<string, keyof Course> = {
  id:'id', 'courseid':'id', 'slug':'id',
  title:'title', 'course':'title', 'coursetitle':'title',
  level:'level',
  mode:'mode',
  startdate:'startDate','start':'startDate','start_date':'startDate','start date':'startDate',
  duration:'duration',
  price:'price','price(ghs)':'price',
  instructor:'instructor','teacher':'instructor',
  image:'image','imageurl':'image','thumbnail':'image',
  meetlink:'meetLink','meet link':'meetLink','googlemeet':'meetLink',
  recordingurl:'recordingUrl','recording url':'recordingUrl',
  category:'category',
  age:'ageRange','age range':'ageRange',
  overview:'overview',
  outcomes:'outcomes',
  prerequisites:'prerequisites',
  tools:'tools',
  modules:'modules',
}

function normKey(h: string) {
  return h.toLowerCase().replace(/\s+|_/g, '')
}
function list(v?: string) {
  if (!v) return []
  return Array.from(new Set(v.split(/[|;,]|\r?\n/).map(x => x.trim()).filter(Boolean)))
}
function parseModules(v?: string): Course['modules'] {
  if (!v) return []
  try { const j = JSON.parse(v); if (Array.isArray(j)) return j } catch {}
  return v.split(/\r?\n/).map((line, i) => {
    const m = line.match(/^(?:week\s*(\d+)|w\s*(\d+))?\s*:?\s*(.+?)(?:\s*>\s*(.+))?$/i)
    const week = (m?.[1] || m?.[2] || String(i + 1)).trim()
    const title = (m?.[3] || line).trim()
    const items = list(m?.[4] || '')
    return { week, title, items }
  })
}

function toCsvUrl(u: string) {
  if (u.includes('/edit')) {
    const id = (u.match(/\/d\/([^/]+)/) || [])[1]
    const gid = (u.match(/gid=(\d+)/) || [])[1] || '0'
    if (id) return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`
  }
  return u
}

function isValid(c: Course) {
  return REQUIRED.every(k => String((c as any)[k] || '').trim().length > 0)
}

/** Public API used by your pages */
export async function fetchCoursesFromSheet(): Promise<Course[]> {
  const raw = process.env.SHEET_URL
  if (!raw) return SAMPLE_4

  const url = toCsvUrl(raw)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return SAMPLE_4

  const text = await res.text()
  const rows = parseCSV(text)
  if (!rows.length) return SAMPLE_4

  // Build header map from first row
  const first = rows[0]
  const headerMap: Record<string, string> = {}
  Object.keys(first).forEach(h => {
    const mapped = MAP[normKey(h)]
    if (mapped) headerMap[mapped] = h
  })

  const courses: Course[] = rows.map((r, i) => {
    const get = (k: keyof Course) => (r[headerMap[k]] ?? '').toString().trim()
    const c: Course = {
      id: get('id') || `row-${i}`,
      title: get('title') || 'Untitled',
      level: get('level') || '',
      mode: get('mode') || '',
      startDate: get('startDate') || new Date().toISOString().slice(0,10),
      duration: get('duration') || '',
      price: get('price') || '',
      instructor: get('instructor') || '',
      image: get('image') || undefined,
      meetLink: get('meetLink') || undefined,
      recordingUrl: get('recordingUrl') || undefined,
      category: get('category') || undefined,
      ageRange: get('ageRange') || undefined,
      overview: get('overview') || undefined,
      outcomes: list(get('outcomes')),
      prerequisites: list(get('prerequisites')),
      tools: list(get('tools')),
      modules: parseModules(get('modules')),
    }
    return c
  })
  .filter(isValid)
  .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
  .slice(0, 4) // ← exactly four

  // Ensure we always return 4 items for a premium look
  if (courses.length < 4) {
    const have = new Set(courses.map(c => c.id))
    const neededCount = Math.max(0, 4 - courses.length)
    const padded = SAMPLE_4.filter(s => !have.has(s.id)).slice(0, neededCount)
    return courses.concat(padded)
  }

  return courses
}

/** Hand-picked fallback set of exactly four */
const SAMPLE_4: Course[] = [
  {
    id: 'cc-junior-scratch',
    title: 'Scratch Adventures',
    level: '6–9 • Beginner',
    mode: 'Online',
    startDate: '2025-09-15',
    duration: '8 weeks',
    price: 'GHS 300',
    instructor: 'Coach Ama',
    image: 'https://images.unsplash.com/photo-1584697964190-6b11f9f93f7f?auto=format&fit=crop&w=1200&q=60',
    meetLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'cc-future-python',
    title: 'Python for Future Builders',
    level: '10–13 • Core',
    mode: 'Hybrid',
    startDate: '2025-10-01',
    duration: '10 weeks',
    price: 'GHS 450',
    instructor: 'Coach Kwesi',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=60'
  },
  {
    id: 'cc-teen-web',
    title: 'Full‑Stack Web Projects',
    level: '14–17 • Advanced',
    mode: 'In‑Person',
    startDate: '2025-11-05',
    duration: '12 weeks',
    price: 'GHS 600',
    instructor: 'Coach Esi',
    image: 'https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&q=60'
  },
  {
    id: 'cc-ai-lab',
    title: 'AI Literacy Lab',
    level: '10–13 • Core',
    mode: 'Online',
    startDate: '2025-09-30',
    duration: '8 weeks',
    price: 'GHS 380',
    instructor: 'Coach Nana',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=60'
  }
]
