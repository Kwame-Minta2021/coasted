'use client'
import { useEffect } from 'react'
import type { Course } from '@/types/course'

function Fact({ label, value }:{label:string, value?:string}) {
  if (!value) return null
  return (
    <div className="rounded-2xl border p-4 dark:border-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  )
}

function List({ title, items }:{title:string, items?:string[]}) {
  if (!items || items.length === 0) return null
  return (
    <div className="rounded-2xl border p-4 dark:border-slate-800">
      <h5 className="text-sm font-semibold">{title}</h5>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
        {items.map((t,i)=> <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

export default function CourseDetail({ course, onClose, onEnroll }:{ course: Course; onClose: ()=>void; onEnroll: ()=>void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-[1fr] md:grid-cols-[1fr_min(720px,100%)]">
      <button onClick={onClose} aria-label="Close" className="hidden md:block bg-black/40" />
      <div className="h-full overflow-auto bg-white p-6 shadow-2xl dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{course.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{course.level} • {course.mode} • Starts {new Date(course.startDate).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">Close</button>
            <button onClick={onEnroll} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Enroll</button>
          </div>
        </div>

        {course.image && <img src={course.image} alt="" className="mt-4 h-48 w-full rounded-2xl object-cover" />}

        {course.overview && (
          <section className="mt-6">
            <h4 className="text-base font-semibold">Overview</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{course.overview}</p>
          </section>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Fact label="Duration" value={course.duration} />
          <Fact label="Instructor" value={course.instructor} />
          <Fact label="Price" value={course.price} />
          {course.ageRange && <Fact label="Ages" value={course.ageRange} />}
          {course.category && <Fact label="Category" value={course.category} />}
          {course.meetLink && <Fact label="Live" value="Google Meet" />}
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <List title="You’ll learn" items={course.outcomes} />
          <List title="Prerequisites" items={course.prerequisites} />
          <List title="Tools" items={course.tools} />
        </div>

        {course.modules && course.modules.length > 0 && (
          <section className="mt-8">
            <h4 className="text-base font-semibold">Syllabus (week by week)</h4>
            <ol className="mt-3 space-y-3">
              {course.modules.map((m, i) => (
                <li key={i} className="rounded-2xl border p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Week {m.week || i+1}: {m.title}</div>
                  </div>
                  {m.items && m.items.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
                      {m.items.map((it, j) => <li key={j}>{it}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {course.meetLink && (
            <a href={course.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">
              Join Live (Google Meet)
            </a>
          )}
          <button onClick={onEnroll} className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )
}


