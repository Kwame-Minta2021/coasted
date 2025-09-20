'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from '@/components/Section'

const PHONE = process.env.NEXT_PUBLIC_PHONE || '+233 54 384 5970'
const PHONE_TEL = (process.env.NEXT_PUBLIC_PHONE || '+233543845970').replace(/\s+/g, '')
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || 'hello@coastedcode.org'

export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <Section id="contact" className="relative overflow-hidden pb-6">
        <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/30" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-900/30" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Let’s build brilliant young makers together
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              Reach out for school partnerships, parent questions, or general support. We’ll reply within 24 hours.
            </p>

            {/* Action tiles */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ContactTile
                title="Call"
                desc={PHONE}
                href={`tel:${PHONE_TEL}`}
                emoji="📞"
              />
              <ContactTile
                title="Email"
                desc={EMAIL}
                href={`mailto:${EMAIL}`}
                emoji="✉️"
              />
              <ContactTile
                title="WhatsApp"
                desc="+233 WhatsApp"
                href={`https://wa.me/${PHONE_TEL.replace('+','')}`}
                emoji="💬"
                target="_blank"
              />
            </div>
          </motion.div>

          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <div className="overflow-hidden rounded-3xl border bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between p-5">
                <div>
                  <div className="text-sm font-semibold">Cape Coast, Ghana</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Hybrid: online + in‑person labs</div>
                </div>
                <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Open for partners
                </span>
              </div>
              <iframe
                title="Coasted Code – Cape Coast Map"
                className="h-64 w-full border-t dark:border-slate-800"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Cape%20Coast%2C%20Ghana&output=embed"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FORM + INFO */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold">Send us a message</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Parents, schools, or partners—tell us what you’re looking for. We’ll get back fast.
            </p>
            <ContactForm />
          </motion.div>

          {/* Office hours & quick links */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-6"
          >
            <Card title="Office hours">
              <ul className="text-sm text-slate-700 dark:text-slate-300">
                <li>Mon–Fri: 9:00–17:30 GMT</li>
                <li>Sat: 10:00–14:00 GMT</li>
                <li>Sun & holidays: by arrangement</li>
              </ul>
            </Card>

            <Card title="What to expect">
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
                <li>Friendly support for parents & schools</li>
                <li>Safeguarding-first approach</li>
                <li>Clear pricing & timelines</li>
                <li>Live classes via Google Meet + in-person labs</li>
              </ul>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-3xl border bg-gradient-to-br from-blue-600 to-emerald-600 p-6 text-white shadow-sm dark:border-slate-800"
            >
              <div className="text-lg font-semibold">For Schools</div>
              <p className="mt-1 text-sm text-blue-50">
                Need a turnkey STEM club or bootcamp? Estimate cost & staffing with our quick planner.
              </p>
              <a href="/schools" className="mt-3 inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/20">
                Open Planner →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Section>
    </main>
  )
}

/* ----------------- Components ----------------- */

function ContactTile({
  title, desc, href, emoji, target
}: { title: string; desc: string; href: string; emoji: string; target?: string }) {
  return (
    <motion.a
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className="group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800"
    >
      <div className="text-xl" aria-hidden>{emoji}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="text-sm text-slate-600 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-200">
        {desc}
      </div>
    </motion.a>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const canSubmit =
    form.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim().length >= 10

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('loading')
    try {
      const fd = new FormData()
      fd.append('kind', 'contact') // tag for your /api/partner inbox
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      fd.append('subject', form.subject || 'General enquiry')
      fd.append('message', form.message)
      const res = await fetch('/api/partner', { method: 'POST', body: fd })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label="Your name"
          value={form.name}
          onChange={v => setForm(s => ({ ...s, name: v }))}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={v => setForm(s => ({ ...s, email: v }))}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label="Phone (optional)"
          value={form.phone}
          onChange={v => setForm(s => ({ ...s, phone: v }))}
          placeholder={PHONE}
        />
        <Input
          label="Subject (optional)"
          value={form.subject}
          onChange={v => setForm(s => ({ ...s, subject: v }))}
          placeholder="Partnership, Parent enquiry, Support..."
        />
      </div>

      <Textarea
        label="Message"
        value={form.message}
        onChange={v => setForm(s => ({ ...s, message: v }))}
        rows={6}
        required
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          disabled={!canSubmit || status === 'loading'}
          className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </button>

        {status === 'ok' && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium text-emerald-600"
          >
            Thank you! We’ll reply within 24 hours.
          </motion.span>
        )}
        {status === 'error' && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium text-red-600"
          >
            Something went wrong—please try again.
          </motion.span>
        )}
      </div>
    </form>
  )
}

function Input({
  label, value, onChange, type = 'text', required, placeholder
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="group grid gap-1">
      <span className="text-xs font-medium text-slate-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"
      />
    </label>
  )
}

function Textarea({
  label, value, onChange, rows = 5, required
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  required?: boolean
}) {
  return (
    <label className="group grid gap-1">
      <span className="text-xs font-medium text-slate-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"
      />
    </label>
  )
}
