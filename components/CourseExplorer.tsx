'use client'
import { useMemo, useState } from 'react'
import type { Course } from '@/types/course'
import CourseCard from '@/components/CourseCard'
import CourseDetail from '@/components/CourseDetail'

export default function CourseExplorer({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<Course | null>(null)
  const [chosenDetail, setChosenDetail] = useState<Course | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return courses
    const q = query.toLowerCase()
    return courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      (c.overview || '').toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    )
  }, [courses, query])

  return (
    <div className="space-y-6">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses"
        className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="group">
            <CourseCard course={c} />
            <div className="mt-2 flex justify-end">
              <button onClick={() => setChosenDetail(c)} className="text-sm font-medium text-blue-600 hover:underline">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {chosenDetail && (
        <CourseDetail
          course={chosenDetail}
          onClose={() => setChosenDetail(null)}
          onEnroll={() => { setChosen(chosenDetail); setChosenDetail(null) }}
        />
      )}
    </div>
  )
}


