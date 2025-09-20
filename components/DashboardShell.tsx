'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '🏠' },
  { href: '/dashboard/lessons', label: 'Lessons', icon: '📚' },
  { href: '/dashboard/tutorials', label: 'Tutorials', icon: '🎥' },
  { href: '/dashboard/enroll', label: 'Enroll', icon: '📝' },
  { href: '/dashboard/parent', label: 'Parent Controls', icon: '👨‍👩‍👧' }
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [student, setStudent] = useState<{name:string,email:string}|null>(null)
  const [studentName, setStudentName] = useState<string>('Student')
  const { user } = useAuth()
  
  useEffect(() => {
    const raw = localStorage.getItem('student')
    if (raw) try { setStudent(JSON.parse(raw)) } catch {}
  }, [])

  // Fetch student name from enrollment data
  useEffect(() => {
    const fetchStudentName = async () => {
      if (!user?.email) {
        setStudentName('Student');
        return;
      }

      try {
        const { data: enrollment, error } = await supabase
          .from('enrollments')
          .select('child_name')
          .eq('email', user.email)
          .single();

        if (enrollment && !error) {
          setStudentName(enrollment.child_name || user.displayName || user.email?.split('@')[0] || 'Student');
        } else {
          setStudentName(user.displayName || user.email?.split('@')[0] || 'Student');
        }
      } catch (err) {
        console.error('Error fetching student name:', err);
        setStudentName(user.displayName || user.email?.split('@')[0] || 'Student');
      }
    };

    fetchStudentName();
  }, [user?.email, user?.displayName])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="h-max rounded-3xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 p-4 text-white">
            <div className="text-sm opacity-90">Welcome</div>
            <div className="mt-1 font-semibold">{studentName}</div>
            <div className="text-xs opacity-90">{student?.email || 'Signed in'}</div>
          </div>
          <nav className="mt-3 grid">
            {NAV.map(n => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`group mt-1 inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-100 dark:bg-slate-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-base" aria-hidden>{n.icon}</span>
                  <span>{n.label}</span>
                </Link>
                
              )
            })}
            
          </nav>
          <button
            onClick={() => { localStorage.removeItem('student'); window.location.href = '/login' }}
            className="mt-3 w-full rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </motion.aside>

        {/* Main content */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-6"
        >
          {children}
        </motion.section>
      </div>
    </div>
  )
}
