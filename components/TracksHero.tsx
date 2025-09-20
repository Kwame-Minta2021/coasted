'use client'

export default function TracksHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-900/30" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-900/30" />

      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Tracks</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">From beginner to advanced, our pathways are designed to build confidence, real skills, and a love for STEM.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-lg">
            <span aria-hidden className="animate-bounce">🤖</span>
            <span aria-hidden className="animate-pulse">🧠</span>
            <span aria-hidden className="animate-bounce">💻</span>
            <span aria-hidden className="animate-pulse">🎨</span>
          </div>
        </div>
        <a href="/courses" className="inline-flex rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          Browse Courses
        </a>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="inline-flex gap-2 rounded-2xl border bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          {['Junior Makers','Future Builders','Teen Innovators'].map((name) => (
            <a key={name} href={`#${name.toLowerCase().split(' ')[0]}`} className="whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900">
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


