'use client'

import { useState, useEffect } from 'react'
// Replaced UI component imports with standard HTML elements
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  BookOpen,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  level: string
  category: string
  price: number
  duration: string
  instructor: string
  status: string
  created_at: string
  course_modules: Array<{
    id: string
    title: string
    description: string
    is_published: boolean
    course_content: Array<{
      id: string
      title: string
      content_type: string
      is_published: boolean
    }>
  }>
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '',
    category: '',
    price: '',
    duration: '',
    instructor: ''
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.error || 'Failed to fetch courses')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCourses([data.course, ...courses])
        setShowCreateForm(false)
        setFormData({
          title: '',
          description: '',
          level: '',
          category: '',
          price: '',
          duration: '',
          instructor: ''
        })
      } else {
        setError(data.error || 'Failed to create course')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description || '',
      level: course.level,
      category: course.category || '',
      price: course.price.toString(),
      duration: course.duration || '',
      instructor: course.instructor || ''
    })
    setShowCreateForm(true)
  }

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCourse) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingCourse.id,
          ...formData,
          price: parseInt(formData.price)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCourses(courses.map(course => 
          course.id === editingCourse.id ? data.course : course
        ))
        setShowCreateForm(false)
        setEditingCourse(null)
        setFormData({
          title: '',
          description: '',
          level: '',
          category: '',
          price: '',
          duration: '',
          instructor: ''
        })
      } else {
        setError(data.error || 'Failed to update course')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md border animate-pulse">
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage your course catalog and content</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Create/Edit Course Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
            <p className="text-gray-600 mt-1">
              {editingCourse ? 'Update course information' : 'Add a new course to your catalog'}
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter course title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (GHS) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="800"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level *
                  </label>
                  <select 
                    value={formData.level} 
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="coding">Coding</option>
                    <option value="robotics">Robotics</option>
                    <option value="ai">AI</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="8 weeks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    placeholder="Instructor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Course description and learning objectives"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingCourse(null)
                    setFormData({
                      title: '',
                      description: '',
                      level: '',
                      category: '',
                      price: '',
                      duration: '',
                      instructor: ''
                    })
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {course.level} • {course.category}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    GHS {course.price}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {course.duration || 'TBD'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {course.course_modules?.length || 0} modules
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {course.course_modules?.reduce((total, module) => 
                      total + (module.course_content?.length || 0), 0
                    ) || 0} lessons
                  </div>
                </div>

                {course.instructor && (
                  <p className="text-xs text-gray-500">
                    Instructor: {course.instructor}
                  </p>
                )}

                <div className="pt-2 border-t">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    onClick={() => window.open(`/admin/content?course_id=${course.id}`, '_blank')}
                  >
                    Manage Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Create your first course to get started</p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        </div>
      )}
    </div>
  )
}
