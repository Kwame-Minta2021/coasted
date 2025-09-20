'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Plus, Users, Clock, Star, Play } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) {
        router.push('/instructor/login')
        return
      }

      const response = await fetch('/api/instructor/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
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
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-blue-100 text-lg">Manage your course content and modules</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
            </div>
            <a
              href="/instructor/courses/new"
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </a>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div key={course.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm rounded-full font-medium border border-blue-200/50">
                    {course.age_group}
                  </span>
                  <div className="flex items-center text-amber-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="text-sm font-medium">{course.difficulty_level}/5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.course_modules?.length || 0}</p>
                      <p className="text-xs text-gray-500">modules</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.category}</p>
                      <p className="text-xs text-gray-500">category</p>
                    </div>
                  </div>
                </div>

                {/* Video Links Display */}
                {course.video_links && course.video_links.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                    <div className="flex items-center text-sm text-purple-700 mb-2">
                      <Play className="w-4 h-4 mr-2" />
                      <span className="font-medium">{course.video_links.length} video{course.video_links.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-1">
                      {course.video_links.slice(0, 2).map((link: string, index: number) => (
                        <div key={index} className="text-xs text-purple-600 truncate bg-white/50 px-2 py-1 rounded">
                          {link}
                        </div>
                      ))}
                      {course.video_links.length > 2 && (
                        <div className="text-xs text-purple-500 font-medium">
                          +{course.video_links.length - 2} more videos
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push(`/instructor/courses/${course.id}`)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Manage Course
                  </button>
                  <button
                    onClick={() => router.push(`/instructor/courses/${course.id}/modules`)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    View Modules
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses yet</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">Start your teaching journey by creating your first course and sharing your knowledge with students.</p>
          <a
            href="/instructor/courses/new"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-medium"
          >
            <Plus className="w-6 h-6 mr-3" />
            Create Your First Course
          </a>
        </div>
      )}
    </div>
  )
}
