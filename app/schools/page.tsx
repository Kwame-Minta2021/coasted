'use client'

import Section from '@/components/Section'
import SchoolEstimator from '@/components/SchoolEstimator'

export default function SchoolsPage() {
  return (
    <main>
      {/* HERO */}
      <Section id="schools" className="pb-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Coasted Code for Schools</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              We set up and run turnkey STEM clubs, bootcamps, and teacher training. Robotics kits,
              curriculum, vetted mentors, and showcases—tailored for your student population.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Weekly after‑school clubs or intensive holiday bootcamps</li>
              <li>• Tracks for ages 6–9, 10–13, and 14–17 (coding, robotics, AI literacy)</li>
              <li>• Hybrid delivery: on‑site labs + Google Meet live support</li>
              <li>• Safeguarding, consent, attendance, and progress reporting</li>
            </ul>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Outcomes we target</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Problem‑solving', 'Project‑based learning with real demos'],
                ['Teamwork', 'Showcases and peer code reviews'],
                ['Digital fluency', 'Coding, AI basics, and safe online practice'],
                ['Creativity', 'Build games, robots, and mini‑apps'],
              ].map(([t,d]) => (
                <div key={t} className="rounded-2xl border p-4 dark:border-slate-800">
                  <div className="font-medium">{t}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ESTIMATOR + PROPOSAL */}
      <Section className="pt-0">
        <SchoolEstimator />
      </Section>

      {/* FAQ */}
      <Section id="faq" className="pt-0">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ['Do you supply hardware?', 'Yes. We provide a per‑cohort robotics kit set and spares. Schools may also purchase/keep kits at the end of term.'],
            ['How do you handle safeguarding?', 'Mentors are vetted and trained. We use consent forms, attendance tracking, and safe‑usage guidelines for all tools and platforms.'],
            ['What’s a typical cadence?', '8–12 weeks, 1–2 sessions/week (60–90 mins). Bootcamps run 4–10 days.'],
            ['Can teachers upskill?', 'Yes, we offer co‑teaching and teacher PD modules with ready‑to‑use lesson plans.'],
          ].map(([q,a]) => (
            <div key={q} className="rounded-2xl border p-5 dark:border-slate-800">
              <div className="font-semibold">{q}</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a}</div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
