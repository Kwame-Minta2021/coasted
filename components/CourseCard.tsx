'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Course } from '@/types/course'
import { 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Play,
  ArrowRight
} from 'lucide-react'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/enroll?track=${course.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl bg-white dark:bg-slate-800 border border-white/20"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🎓</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{course.price}</div>
              <div className="text-sm opacity-90">Course fee</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 leading-tight">{course.title}</h3>
          <p className="text-sm opacity-90 mb-4">{course.overview || 'Learn and master new skills'}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{course.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <Star className="w-4 h-4" />
            <span>Instructor: {course.instructor}</span>
          </div>
          
          {course.ageRange && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Age Range: {course.ageRange}
            </div>
          )}
        </div>

        {/* Features */}
        {course.outcomes && course.outcomes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">What you'll learn:</h4>
            <div className="space-y-1">
              {course.outcomes.slice(0, 3).map((outcome, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleEnroll}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Enroll Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}