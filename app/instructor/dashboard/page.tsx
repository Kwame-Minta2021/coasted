'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, Calendar, TrendingUp, Clock, Star } from 'lucide-react'

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    upcomingClasses: 0,
    completionRate: 0
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [upcomingSchedule, setUpcomingSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) return

      // Fetch courses
      const coursesResponse = await fetch('/api/instructor/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setRecentCourses(coursesData.courses?.slice(0, 5) || [])
        setStats(prev => ({ ...prev, totalCourses: coursesData.courses?.length || 0 }))
      }

      // Fetch schedule
      const scheduleResponse = await fetch('/api/instructor/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json()
        const upcoming = scheduleData.schedule?.filter((event: any) => 
          new Date(event.start_time) > new Date()
        ).slice(0, 5) || []
        setUpcomingSchedule(upcoming)
        setStats(prev => ({ ...prev, upcomingClasses: upcoming.length }))
      }

      // Set default values for stats that don't have API endpoints yet
      setStats(prev => ({
        ...prev,
        totalStudents: 0,
        completionRate: 0
      }))

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your courses today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
               <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
             </div>
             <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
               <BookOpen className="w-6 h-6 text-white" />
             </div>
           </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
               <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
             </div>
             <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
               <Users className="w-6 h-6 text-white" />
             </div>
           </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Classes</p>
               <p className="text-3xl font-bold text-gray-900">{stats.upcomingClasses}</p>
             </div>
             <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
               <Calendar className="w-6 h-6 text-white" />
             </div>
           </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
               <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
             </div>
             <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
               <TrendingUp className="w-6 h-6 text-white" />
             </div>
           </div>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="p-6">
            {recentCourses.length > 0 ? (
              <div className="space-y-4">
                {recentCourses.map((course: any) => (
                  <div key={course.id} className="group p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{course.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {course.age_group}
                          </span>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">{course.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-amber-600">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          {course.difficulty_level}/5
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Start your teaching journey by creating your first course</p>
                <a 
                  href="/instructor/courses/new" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Create Your First Course
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Schedule</h2>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="p-6">
            {upcomingSchedule.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedule.map((event: any) => (
                  <div key={event.id} className="group p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{event.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {new Date(event.start_time).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-sm text-gray-600">at</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(event.start_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-purple-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.event_type?.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming classes</h3>
                <p className="text-gray-600 mb-6">Schedule your first class to start teaching</p>
                <a 
                  href="/instructor/schedule" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Class
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/instructor/courses/new"
            className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Create Course</h3>
                <p className="text-sm text-gray-600">Start a new course</p>
              </div>
            </div>
            <div className="text-xs text-blue-600 font-medium">Get started →</div>
          </a>

          <a
            href="/instructor/schedule"
            className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">Schedule Class</h3>
                <p className="text-sm text-gray-600">Plan your next session</p>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">Schedule now →</div>
          </a>

          <a
            href="/instructor/students"
            className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">View Students</h3>
                <p className="text-sm text-gray-600">Check student progress</p>
              </div>
            </div>
            <div className="text-xs text-purple-600 font-medium">View progress →</div>
          </a>
        </div>
      </div>
    </div>
  )
}
