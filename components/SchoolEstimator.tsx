'use client'

import { useMemo, useState } from 'react'

type Inputs = {
  schoolName: string
  contactName: string
  email: string
  phone: string

  size: 'small' | 'medium' | 'large'
  segment: '6-9' | '10-13' | '14-17' | 'mixed'
  delivery: 'onsite' | 'online' | 'hybrid'
  program: 'club' | 'bootcamp' | 'teacher'
  sessionsPerWeek: 1 | 2
  durationWeeks: 8 | 10 | 12
  cohorts: 1 | 2 | 3 | 4
}

const DEFAULT: Inputs = {
  schoolName: '',
  contactName: '',
  email: '',
  phone: '',
  size: 'medium',
  segment: '10-13',
  delivery: 'hybrid',
  program: 'club',
  sessionsPerWeek: 1,
  durationWeeks: 10,
  cohorts: 2,
}

export default function SchoolEstimator() {
  const [v, setV] = useState<Inputs>(DEFAULT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  
  const update = <K extends keyof Inputs>(k: K, val: Inputs[K]) => setV(s => ({ ...s, [k]: val }))

  const estimate = useMemo(() => calcEstimate(v), [v])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    // include computed estimate in submission
    fd.append('estimate_monthly', String(estimate.monthly))
    fd.append('estimate_total', String(estimate.total))
    fd.append('mentor_count', String(estimate.mentors))
    fd.append('kits', String(estimate.kits))
    fd.append('summary', estimate.summary)

    const res = await fetch('/api/partner', { method: 'POST', body: fd })
    if (res.ok) alert('Thanks! We’ll send a tailored proposal shortly.')
    else alert('Something went wrong. Please try again.')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Configurator */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Design your program</h3>
        <form className="mt-4 grid gap-4" onSubmit={submit}>
          {/* Contact */}
          <div className="grid gap-3 md:grid-cols-2">
            <input required name="school" placeholder="School name" value={v.schoolName}
              onChange={e=>update('schoolName', e.target.value)} className="rounded-xl border px-4 py-3 bg-white text-slate-900 border-slate-300 placeholder-slate-500 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:placeholder-slate-400"/>
            <input required name="contact" placeholder="Contact person" value={v.contactName}
              onChange={e=>update('contactName', e.target.value)} className="rounded-xl border px-4 py-3 bg-white text-slate-900 border-slate-300 placeholder-slate-500 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:placeholder-slate-400"/>
            <input required name="email" type="email" placeholder="Email" value={v.email}
              onChange={e=>update('email', e.target.value)} className="rounded-xl border px-4 py-3 bg-white text-slate-900 border-slate-300 placeholder-slate-500 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:placeholder-slate-400"/>
            <input name="phone" placeholder="Phone" value={v.phone}
              onChange={e=>update('phone', e.target.value)} className="rounded-xl border px-4 py-3 bg-white text-slate-900 border-slate-300 placeholder-slate-500 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:placeholder-slate-400"/>
          </div>

          {/* Size / Segment / Delivery */}
          <div className="grid gap-3 md:grid-cols-3">
            <Select label="School size" value={v.size} onChange={val=>update('size', val)}
              options={[
                { value:'small', label:'Small (<300)' },
                { value:'medium', label:'Medium (300–1000)' },
                { value:'large', label:'Large (>1000)' },
              ]}/>
            <Select label="Student segment" value={v.segment} onChange={val=>update('segment', val)}
              options={[
                { value:'6-9', label:'Ages 6–9' },
                { value:'10-13', label:'Ages 10–13' },
                { value:'14-17', label:'Ages 14–17' },
                { value:'mixed', label:'Mixed' },
              ]}/>
            <Select label="Delivery" value={v.delivery} onChange={val=>update('delivery', val)}
              options={[
                { value:'onsite', label:'On‑site' },
                { value:'online', label:'Online (Meet)' },
                { value:'hybrid', label:'Hybrid' },
              ]}/>
          </div>

          {/* Program / Cadence */}
          <div className="grid gap-3 md:grid-cols-3">
            <Select label="Program type" value={v.program} onChange={val=>update('program', val)}
              options={[
                { value:'club', label:'After‑school Club' },
                { value:'bootcamp', label:'Holiday Bootcamp' },
                { value:'teacher', label:'Teacher Training' },
              ]}/>
            <Select label="Sessions / week" value={v.sessionsPerWeek} onChange={val=>update('sessionsPerWeek', Number(val) as 1|2)}
              options={[{value:1,label:'1x'}, {value:2,label:'2x'}]} />
            <Select label="Duration (weeks)" value={v.durationWeeks} onChange={val=>update('durationWeeks', Number(val) as 8|10|12)}
              options={[{value:8,label:'8'}, {value:10,label:'10'}, {value:12,label:'12'}]} />
          </div>

          {/* Cohorts */}
          <div className="grid gap-3 md:grid-cols-3">
            <Select label="Cohorts (≈20–25 students each)" value={v.cohorts} onChange={val=>update('cohorts', Number(val) as 1|2|3|4)}
              options={[{value:1,label:'1'}, {value:2,label:'2'}, {value:3,label:'3'}, {value:4,label:'4'}]} />
          </div>

          {/* Hidden fields for server */}
          <input type="hidden" name="config_json" value={JSON.stringify(v)} />

          <div className="mt-2 flex flex-wrap gap-3">
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700">Request Proposal</button>
            <a href="#faq" className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Read FAQ</a>
          </div>
        </form>
      </div>

      {/* Estimate Panel */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Estimated Plan</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Auto‑generated from your inputs. We’ll confirm and customize in your proposal.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Fact label="Mentors needed" value={`${estimate.mentors}`} />
          <Fact label="Robotics kits" value={`${estimate.kits}`} />
          <Fact label="Session length" value={`${estimate.sessionMinutes} min`} />
          <Fact label="Students per cohort" value={`${estimate.studentsPerCohort}`} />
        </div>

        <div className="mt-5 rounded-2xl border p-4 dark:border-slate-800">
          <div className="text-xs uppercase tracking-wide text-slate-500">Budget</div>
          <div className="mt-1 text-2xl font-bold">GHS {fmt(estimate.monthly)} <span className="text-sm font-medium text-slate-500">/ month</span></div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Estimated total for program: <span className="font-semibold">GHS {fmt(estimate.total)}</span></div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold">What’s included</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
            {estimate.includes.map(i => <li key={i}>{i}</li>)}
          </ul>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold">Program summary</h4>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{estimate.summary}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

function Select<T extends string | number>({
  label, value, onChange, options
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value as any}
        onChange={e => onChange((isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) as T)}
        className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {options.map(o => <option key={String(o.value)} value={o.value as any}>{o.label}</option>)}
      </select>
    </label>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 dark:border-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  )
}

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
}

/**
 * Simple deterministic estimator.
 * You can refine coefficients as you learn actual delivery costs.
 */
function calcEstimate(v: Inputs) {
  // base cohort params
  const studentsPerCohort = 24
  const sessionMinutes = v.program === 'teacher' ? 90 : 75

  // mentor ratio & kits
  const mentorsPerCohort =
    v.segment === '6-9' ? 2 : 1.5  // younger learners need more facilitation
  const deliveryMultiplier =
    v.delivery === 'onsite' ? 1.2 : v.delivery === 'hybrid' ? 1.15 : 1.0
  const programMultiplier =
    v.program === 'bootcamp' ? 1.25 : v.program === 'teacher' ? 1.1 : 1.0
  const sizeDiscount =
    v.size === 'large' ? 0.9 : v.size === 'medium' ? 0.95 : 1.0

  const mentors = Math.ceil(mentorsPerCohort * v.cohorts)
  const kits = v.program === 'teacher' ? 0 : v.cohorts * (v.segment === '14-17' ? 14 : 10)

  // pricing model (GHS): base per session per cohort
  const basePerSession = 1200 // delivery + curriculum
  const kitCost = kits * 850 // amortized estimate
  const sessionsTotal = v.sessionsPerWeek * v.durationWeeks * v.cohorts

  const subtotal = basePerSession * sessionsTotal * deliveryMultiplier * programMultiplier
  const monthly = (subtotal / Math.max(1, v.durationWeeks / 4)) * sizeDiscount
  const total = (subtotal + kitCost) * sizeDiscount

  const includes = [
    `${mentors} mentor(s) per ${v.cohorts} cohort(s)`,
    `${sessionMinutes}‑minute sessions, ${v.sessionsPerWeek}x/week`,
    'Curriculum & lesson plans',
    v.delivery !== 'online' ? 'On‑site lab facilitation & setup' : 'Virtual classroom (Google Meet)' ,
    v.program === 'teacher' ? 'Teacher PD & co‑teaching' : 'Student showcases & progress reports',
    kits ? `${kits} robotics/electronics kits (loan or purchase option)` : 'No kits required',
    'Safeguarding & attendance tracking',
  ]

  const summary =
    `${v.durationWeeks}-week ${labelProgram(v.program)} for ${labelSegment(v.segment)} learners `
    + `(${v.cohorts} cohort${v.cohorts>1?'s':''}, ${v.sessionsPerWeek}×/week, ${sessionMinutes} min), `
    + `${v.delivery} delivery. Includes mentors, materials, and reporting.`

  return { mentors, kits, sessionMinutes, studentsPerCohort, monthly: Math.round(monthly), total: Math.round(total), includes, summary }
}

function labelProgram(p: Inputs['program']) {
  return p === 'club' ? 'after‑school club' : p === 'bootcamp' ? 'holiday bootcamp' : 'teacher training'
}
function labelSegment(s: Inputs['segment']) {
  return s === '6-9' ? 'ages 6–9' : s === '10-13' ? 'ages 10–13' : s === '14-17' ? 'ages 14–17' : 'mixed ages'
}
