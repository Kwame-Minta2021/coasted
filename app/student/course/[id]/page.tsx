'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Play, BookOpen, Clock, Star } from 'lucide-react'

export default function StudentCoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string)
    }
  }, [params.id])

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}`)
      
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
      } else {
        // Fallback to mock data if API fails
        const mockCourse = {
          id: courseId,
          title: "Introduction to Python Programming",
          description: "Learn the basics of Python programming with fun projects and games!",
          age_group: "10-13",
          difficulty_level: 2,
          category: "coding",
          duration_weeks: 4,
          max_students: 20,
          price: 800,
          course_image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
          video_links: [
            "https://youtube.com/watch?v=kqtD5dpn9C8",
            "https://youtube.com/watch?v=rfscVS0vtbw",
            "https://vimeo.com/123456789"
          ],
          learning_objectives: [
            "Understand basic Python syntax",
            "Create simple programs",
            "Use variables and functions"
          ],
          prerequisites: [
            "Basic computer skills",
            "No prior programming experience needed"
          ],
          tags: ["Python", "Beginner", "Fun", "Programming"],
          instructor: {
            name: "John Doe",
            bio: "Experienced coding instructor with 5+ years of teaching children programming fundamentals."
          }
        }
        setCourse(mockCourse)
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
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

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Image */}
          {course.course_image && (
            <div className="lg:w-1/3">
              <img
                src={course.course_image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Course Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
              </div>
              <div className="text-right">
                {course.price > 0 && (
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    ₵{course.price}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Ages {course.age_group}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1" />
                    {course.difficulty_level === 1 ? 'Beginner' : course.difficulty_level === 2 ? 'Intermediate' : 'Advanced'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {course.category}
              </div>
              <div className="flex items-center">
                <Play className="w-4 h-4 mr-1" />
                {course.video_links?.length || 0} videos
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.duration_weeks} weeks
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-1">👥</span>
                Max {course.max_students} students
              </div>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Content Section */}
      {course.video_links && course.video_links.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Play className="w-6 h-6 mr-2 text-blue-600" />
            Video Lessons
          </h2>
          <p className="text-gray-600 mb-6">Watch these videos to learn the course content</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.video_links.map((link: string, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Lesson {index + 1}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getVideoPlatform(link)}
                  </span>
                </div>
                <div className="text-sm text-blue-600 mb-3 break-all">
                  {link}
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      {course.learning_objectives && course.learning_objectives.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
          <ul className="space-y-2">
            {course.learning_objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
          <p className="text-gray-600 mb-4">Before taking this course, you should have:</p>
          <ul className="space-y-2">
            {course.prerequisites.map((prerequisite: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructor Information */}
      {course.instructor && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Your Instructor</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-500">👨‍🏫</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.instructor.name}</h3>
              <p className="text-gray-600">{course.instructor.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Course Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Enroll in Course
          </button>
          <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Add to Wishlist
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Join {course.max_students} other students in this course
        </p>
      </div>
    </div>
  )
}

function getVideoPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YouTube'
  } else if (url.includes('vimeo.com')) {
    return 'Vimeo'
  } else if (url.includes('drive.google.com')) {
    return 'Google Drive'
  } else if (url.includes('dropbox.com')) {
    return 'Dropbox'
  } else {
    return 'Video'
  }
}
