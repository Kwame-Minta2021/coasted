'use client'
import type { Track } from '@/types/track'

export default function TrackDetail({ track }: { track: Track }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">{track.name}</h2>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-slate-900">{track.badge}</span>
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{track.overview}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold">You'll learn</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              {track.outcomes.map(b => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold">Tools & Projects</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              {track.tools.slice(0, 3).map(tool => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/courses" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-semibold hover:bg-blue-700">See courses</a>
          <a href="/contact" className="inline-flex rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">Talk to an advisor</a>
        </div>
      </div>
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="relative overflow-hidden rounded-3xl border bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-20 blur-3xl" />
          <div className="relative">
            <h3 className="text-sm font-semibold">Representative modules</h3>
            <ol className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
              {track.modules.slice(0, 3).map(module => (
                <li key={module.week}>{module.title}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-slate-500">Exact modules vary by cohort.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


