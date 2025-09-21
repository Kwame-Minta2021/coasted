'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  PlusCircle,
  Home
} from 'lucide-react'

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [instructor, setInstructor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the login page - if so, skip authentication check
      if (typeof window !== 'undefined' && window.location.pathname === '/instructor/login') {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('instructorToken')
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/instructor/login')
        setLoading(false)
        return
      }

      // Check if token is expired (only if it's a JWT token)
      if (token.includes('.')) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          
          if (payload.exp && payload.exp < currentTime) {
            console.log('Token expired, redirecting to login')
            localStorage.removeItem('instructorToken')
            localStorage.removeItem('instructorData')
            router.push('/instructor/login')
            setLoading(false)
            return
          }
        } catch (error) {
          console.error('Error checking token expiration:', error)
          localStorage.removeItem('instructorToken')
          localStorage.removeItem('instructorData')
          router.push('/instructor/login')
          setLoading(false)
          return
        }
      }

      // Verify token and get instructor info
      const instructorData = localStorage.getItem('instructorData')
      if (instructorData) {
        try {
          const parsedData = JSON.parse(instructorData)
          setInstructor(parsedData)
          setLoading(false)
        } catch (error) {
          console.error('Error parsing instructor data:', error)
          localStorage.removeItem('instructorData')
          localStorage.removeItem('instructorToken')
          router.push('/instructor/login')
          setLoading(false)
          return
        }
      } else {
        console.log('No instructor data found, redirecting to login')
        localStorage.removeItem('instructorToken')
        router.push('/instructor/login')
        setLoading(false)
      }
    }

    // Add a small delay to prevent flash of loading state
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  const logout = () => {
    localStorage.removeItem('instructorToken')
    localStorage.removeItem('instructorData')
    router.push('/instructor/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading instructor dashboard...</p>
        </div>
      </div>
    )
  }

  // If we're on the login page, just render the children (login form)
  if (typeof window !== 'undefined' && window.location.pathname === '/instructor/login') {
    return <>{children}</>
  }

  if (!instructor) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Instructor Portal</h1>
                <p className="text-xs text-gray-500">Coasted Code</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/instructor/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              href="/instructor/courses"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 group"
            >
              <BookOpen className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">My Courses</span>
            </Link>

            <Link
              href="/instructor/courses/new"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group"
            >
              <PlusCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Create Course</span>
            </Link>
            
            <Link
              href="/instructor/schedule"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 transition-all duration-200 group"
            >
              <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Schedule</span>
            </Link>
            
            <Link
              href="/instructor/students"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 transition-all duration-200 group"
            >
              <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Students</span>
            </Link>
            
            <Link
              href="/instructor/settings"
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-700 transition-all duration-200 group"
            >
              <Settings className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {instructor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">{instructor.name}</p>
                <p className="text-xs text-gray-500 truncate">{instructor.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-72">
        <main className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
