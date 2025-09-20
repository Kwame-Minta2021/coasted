'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

export default function NewCoursePage() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    age_group: '6-9',
    difficulty_level: 1,
    category: 'coding',
    learning_objectives: [''],
    video_links: [''],
    prerequisites: [''],
    duration_weeks: 4,
    max_students: 20,
    is_published: false,
    course_image: '',
    tags: ['']
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const addObjective = () => {
    setCourseData({
      ...courseData,
      learning_objectives: [...courseData.learning_objectives, '']
    })
  }

  const updateObjective = (index: number, value: string) => {
    const objectives = [...courseData.learning_objectives]
    objectives[index] = value
    setCourseData({ ...courseData, learning_objectives: objectives })
  }

  const removeObjective = (index: number) => {
    const objectives = courseData.learning_objectives.filter((_, i) => i !== index)
    setCourseData({ ...courseData, learning_objectives: objectives })
  }

  const addVideoLink = () => {
    setCourseData({
      ...courseData,
      video_links: [...courseData.video_links, '']
    })
  }

  const updateVideoLink = (index: number, value: string) => {
    const videoLinks = [...courseData.video_links]
    videoLinks[index] = value
    setCourseData({ ...courseData, video_links: videoLinks })
  }

  const removeVideoLink = (index: number) => {
    const videoLinks = courseData.video_links.filter((_, i) => i !== index)
    setCourseData({ ...courseData, video_links: videoLinks })
  }

  const addPrerequisite = () => {
    setCourseData({
      ...courseData,
      prerequisites: [...courseData.prerequisites, '']
    })
  }

  const updatePrerequisite = (index: number, value: string) => {
    const prerequisites = [...courseData.prerequisites]
    prerequisites[index] = value
    setCourseData({ ...courseData, prerequisites: prerequisites })
  }

  const removePrerequisite = (index: number) => {
    const prerequisites = courseData.prerequisites.filter((_, i) => i !== index)
    setCourseData({ ...courseData, prerequisites: prerequisites })
  }

  const addTag = () => {
    setCourseData({
      ...courseData,
      tags: [...courseData.tags, '']
    })
  }

  const updateTag = (index: number, value: string) => {
    const tags = [...courseData.tags]
    tags[index] = value
    setCourseData({ ...courseData, tags: tags })
  }

  const removeTag = (index: number) => {
    const tags = courseData.tags.filter((_, i) => i !== index)
    setCourseData({ ...courseData, tags: tags })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) {
        router.push('/instructor/login')
        return
      }

      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
                body: JSON.stringify({
                  ...courseData,
                  learning_objectives: courseData.learning_objectives.filter(obj => obj.trim()),
                  video_links: courseData.video_links.filter(link => link.trim()),
                  prerequisites: courseData.prerequisites.filter(prereq => prereq.trim()),
                  tags: courseData.tags.filter(tag => tag.trim())
                })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/instructor/courses/${data.course.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600">Design a course for your target age group</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={courseData.title}
                onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Introduction to Python Programming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Group *
              </label>
              <select
                value={courseData.age_group}
                onChange={(e) => setCourseData({...courseData, age_group: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="6-9">Ages 6-9 (Early Elementary)</option>
                <option value="10-13">Ages 10-13 (Middle School)</option>
                <option value="14-17">Ages 14-17 (High School)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <select
                value={courseData.difficulty_level}
                onChange={(e) => setCourseData({...courseData, difficulty_level: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Elementary</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
                <option value={5}>5 - Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={courseData.category}
                onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="coding">Coding</option>
                <option value="robotics">Robotics</option>
                <option value="ai">Artificial Intelligence</option>
                <option value="general">General Tech</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              required
              rows={4}
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what students will learn in this course..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
          <p className="text-gray-600 mb-4">What will students be able to do after completing this course?</p>
          
          {courseData.learning_objectives.map((objective, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Students will be able to..."
              />
              {courseData.learning_objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addObjective}
            className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Learning Objective
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Video Content</h2>
          <p className="text-gray-600 mb-4">Add video links that will appear in the students' portal for this course</p>
          
          {courseData.video_links.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={link}
                onChange={(e) => updateVideoLink(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              />
              {courseData.video_links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVideoLink(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addVideoLink}
            className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Video Link
          </button>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Supported platforms:</strong> YouTube, Vimeo, Google Drive, Dropbox, and direct video URLs
            </p>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (weeks)
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={courseData.duration_weeks}
                onChange={(e) => setCourseData({...courseData, duration_weeks: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={courseData.max_students}
                onChange={(e) => setCourseData({...courseData, max_students: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Image URL
              </label>
              <input
                type="url"
                value={courseData.course_image}
                onChange={(e) => setCourseData({...courseData, course_image: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={courseData.is_published}
                onChange={(e) => setCourseData({...courseData, is_published: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish course immediately (make it visible to students)
              </span>
            </label>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
          <p className="text-gray-600 mb-4">What should students know before taking this course?</p>
          
          {courseData.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => updatePrerequisite(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Basic computer skills, No prior programming experience needed"
              />
              {courseData.prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addPrerequisite}
            className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Prerequisite
          </button>
        </div>

        {/* Tags */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Tags</h2>
          <p className="text-gray-600 mb-4">Add tags to help students find your course</p>
          
          {courseData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Python, Beginner, Fun"
              />
              {courseData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTag}
            className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
