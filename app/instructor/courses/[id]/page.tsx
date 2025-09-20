'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function CourseDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    age_group: '',
    difficulty_level: 1,
    category: '',
    learning_objectives: [''],
    video_links: ['']
  })

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) {
        router.push('/instructor/login')
        return
      }

      const response = await fetch(`/api/instructor/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setEditData({
          title: data.course.title || '',
          description: data.course.description || '',
          age_group: data.course.age_group || '6-9',
          difficulty_level: data.course.difficulty_level || 1,
          category: data.course.category || 'coding',
          learning_objectives: data.course.learning_objectives || [''],
          video_links: data.course.video_links || ['']
        })
      } else {
        setError('Failed to fetch course details')
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      setError('Failed to fetch course details')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) return

      const response = await fetch(`/api/instructor/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setIsEditing(false)
        alert('Course updated successfully!')
      } else {
        alert('Failed to update course')
      }
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Failed to update course')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) return

      const response = await fetch(`/api/instructor/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Course deleted successfully!')
        router.push('/instructor/courses')
      } else {
        alert('Failed to delete course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course')
    }
  }

  const updateLearningObjective = (index: number, value: string) => {
    const objectives = [...editData.learning_objectives]
    objectives[index] = value
    setEditData({ ...editData, learning_objectives: objectives })
  }

  const addLearningObjective = () => {
    setEditData({
      ...editData,
      learning_objectives: [...editData.learning_objectives, '']
    })
  }

  const removeLearningObjective = (index: number) => {
    const objectives = editData.learning_objectives.filter((_, i) => i !== index)
    setEditData({ ...editData, learning_objectives: objectives })
  }

  const updateVideoLink = (index: number, value: string) => {
    const videoLinks = [...editData.video_links]
    videoLinks[index] = value
    setEditData({ ...editData, video_links: videoLinks })
  }

  const addVideoLink = () => {
    setEditData({
      ...editData,
      video_links: [...editData.video_links, '']
    })
  }

  const removeVideoLink = (index: number) => {
    const videoLinks = editData.video_links.filter((_, i) => i !== index)
    setEditData({ ...editData, video_links: videoLinks })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <span className="text-6xl mb-4 block">❌</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/instructor/courses')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Courses
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Course' : course.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Update your course information' : 'Course details and management'}
            </p>
          </div>
          
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Course
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Course
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what students will learn in this course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Group
                    </label>
                    <select
                      value={editData.age_group}
                      onChange={(e) => setEditData({ ...editData, age_group: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="6-9">Ages 6-9</option>
                      <option value="10-13">Ages 10-13</option>
                      <option value="14-17">Ages 14-17</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={editData.difficulty_level}
                      onChange={(e) => setEditData({ ...editData, difficulty_level: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>Beginner</option>
                      <option value={2}>Intermediate</option>
                      <option value={3}>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                  <p className="text-gray-600 mt-2">{course.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Ages {course.age_group}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {course.difficulty_level === 1 ? 'Beginner' : course.difficulty_level === 2 ? 'Intermediate' : 'Advanced'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
            
            {isEditing ? (
              <div className="space-y-3">
                {editData.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter learning objective"
                    />
                    {editData.learning_objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLearningObjective(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLearningObjective}
                  className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="mr-2">+</span>
                  Add Learning Objective
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {course.learning_objectives?.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Video Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Video Content</h2>
            
            {isEditing ? (
              <div className="space-y-3">
                {editData.video_links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => updateVideoLink(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    />
                    {editData.video_links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideoLink(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVideoLink}
                  className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="mr-2">+</span>
                  Add Video Link
                </button>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Supported platforms:</strong> YouTube, Vimeo, Google Drive, Dropbox, and direct video URLs
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {course.video_links && course.video_links.length > 0 ? (
                  course.video_links.map((link: string, index: number) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {link}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No video content added yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Students Enrolled</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Student Progress
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add Assignment
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
