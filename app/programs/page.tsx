import { TRACKS } from '@/lib/tracks'

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-900/30" />
            <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-900/30" />

            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Learning Tracks</h1>
                <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">From beginner to advanced, our pathways are designed to build confidence, real skills, and a love for STEM.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-lg">
                  <span aria-hidden className="animate-bounce">🤖</span>
                  <span aria-hidden className="animate-pulse">🧠</span>
                  <span aria-hidden className="animate-bounce">💻</span>
                  <span aria-hidden className="animate-pulse">🎨</span>
                </div>
              </div>
              <a href="/courses" className="inline-flex rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
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
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {TRACKS.map((t) => (
              <div key={t.slug} className="group relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 dark:bg-slate-800/80 dark:border-slate-700/50 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-emerald-500/20 transition-transform duration-600 ease-out group-hover:scale-105" />
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Enhanced Badge */}
                  <div className="absolute top-4 right-4 transition-transform duration-200 group-hover:scale-110">
                    <span className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold backdrop-blur-sm border border-white/20 transition-all duration-300 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
                      {t.ages.includes('6-9') ? 'Beginner' : t.ages.includes('10-13') ? 'Core' : 'Advanced'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300 mb-3 transition-transform duration-200 group-hover:scale-102">
                      {t.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t.tagline}
                    </p>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="mb-8 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 transition-transform duration-200 group-hover:scale-105">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.ages}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 transition-transform duration-200 group-hover:scale-105">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 transition-transform duration-200 group-hover:scale-105">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">3 modules</span>
                    </div>
                  </div>

                  {/* Enhanced CTA Button */}
                  <div className="flex justify-between items-center">
                    <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                      <a
                        href={`/tracks/${t.slug}`}
                        className="group/btn inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Explore Track
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                      </a>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Starting from</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        GHS {t.price.enrollment.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILS SECTIONS */}
      {TRACKS.map((t) => (
        <section key={t.slug} id={t.slug} className="py-16 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight">{t.name}</h2>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-slate-900">{t.ages.includes('6-9') ? 'Beginner' : t.ages.includes('10-13') ? 'Core' : 'Advanced'}</span>
                </div>
                                  <p className="mt-2 text-slate-600 dark:text-slate-300">{t.tagline}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4 dark:border-slate-800">
                    <h3 className="text-sm font-semibold">You'll learn</h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {t.outcomes.map(b => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl border p-4 dark:border-slate-800">
                    <h3 className="text-sm font-semibold">Tools & Projects</h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Scratch & Blockly</li>
                      <li>Arduino & Robotics</li>
                      <li>Web Development Tools</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/courses" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-semibold hover:bg-blue-700">See courses</a>
                  <a href="/contact" className="inline-flex rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">Talk to an advisor</a>
                </div>
              </div>
              <div>
                <div className="relative overflow-hidden rounded-3xl border bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-20 blur-3xl" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold">Representative modules</h3>
                    <ol className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
                      <li>Introduction to Programming</li>
                      <li>Building Interactive Projects</li>
                      <li>Advanced Concepts & Portfolio</li>
                    </ol>
                    <p className="mt-4 text-xs text-slate-500">Exact modules vary by cohort.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}


