'use client'

import { useState } from 'react'
import CourseCard from '@/components/CourseCard'
import type { Course } from '@/types/course'
import { motion, AnimatePresence } from 'framer-motion'

// Structured course data based on the new framework
const courses = [
  {
    id: 'junior-makers',
    title: 'Junior Makers (Ages 6-9)',
    subtitle: 'Spark Curiosity & Creativity',
    description: 'Creative thinking, problem-solving through storytelling, and hands-on robotics play. Perfect for young innovators!',
    price: 89,
    duration: '12 weeks',
    level: 'Beginner',
    ageGroup: '6-9 years',
    features: [
      'Creative Thinking & Imagination Lab',
      'Critical Thinking through Storytelling',
      'Introduction to Coding with Blocks',
      'Digital Play & Simple Robotics',
      'Math Adventures with Games',
      'Introduction to AI Concepts'
    ],
    supportFeatures: [
      'Free Robotics Starter Kit delivered to home',
      'Access to recorded courses for revision',
      'Weekly Fun Meet-Ups with peers',
      'Online mini-challenges and games'
    ],
    outcome: 'Develops curiosity, hands-on play with robots, early computational thinking, and confidence in expressing ideas.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    icon: '🎨',
    popular: false
  },
  {
    id: 'cc-ai-lab',
    title: 'AI Literacy Lab (Ages 10-13)',
    subtitle: 'Build Skills & Confidence',
    description: 'Problem-solving, Python programming, robotics fundamentals, and creative AI projects. Build real tech solutions!',
    price: 129,
    duration: '16 weeks',
    level: 'Intermediate',
    ageGroup: '10-13 years',
    features: [
      'Problem Solving & Logical Reasoning',
      'Introduction to Python Programming',
      'Robotics Fundamentals',
      'Creative Projects in AI',
      'STEM in Real Life',
      'Teamwork & Presentation Skills'
    ],
    supportFeatures: [
      'Free Robotics Starter Kit (age-appropriate)',
      'Access to recorded tutorials & challenges',
      'Weekly Peer Labs',
      'Group problem-solving sessions'
    ],
    outcome: 'Equips learners with coding literacy, teamwork, robotics hands-on experience, and ability to create real tech solutions.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: '🤖',
    popular: true
  },
  {
    id: 'robotics-lab',
    title: 'Robotics Lab (Ages 10-13)',
    subtitle: 'Build & Program Robots',
    description: 'Advanced robotics, sensor programming, automation projects, and real-world applications. Future engineers start here!',
    price: 149,
    duration: '20 weeks',
    level: 'Intermediate',
    ageGroup: '10-13 years',
    features: [
      'Advanced Robotics Assembly',
      'Sensor Programming & Control',
      'Automation Projects',
      'Real-world Applications',
      'Engineering Principles',
      'Project-based Learning'
    ],
    supportFeatures: [
      'Advanced Robotics Starter Kit',
      'Step-by-step video tutorials',
      'Weekly robotics challenges',
      'Expert mentorship sessions'
    ],
    outcome: 'Master robotics fundamentals, understand engineering principles, and build functional automated systems.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    icon: '⚙️',
    popular: false
  },
  {
    id: 'python-programming',
    title: 'Python Programming (Ages 14-17)',
    subtitle: 'Innovate & Launch',
            description: 'Programming & cybersecurity, applied AI, entrepreneurship, and capstone projects. Launch your tech career early!',
    price: 199,
    duration: '24 weeks',
    level: 'Advanced',
    ageGroup: '14-17 years',
    features: [
              'Programming & Cybersecurity (Python, JavaScript)',
      'Applied Robotics & AI',
      'Entrepreneurship in Tech',
      'Research & Problem Identification',
      'Design Thinking & Prototyping',
      'Capstone Project'
    ],
    supportFeatures: [
      'Free Robotics Starter Kit Pro Edition',
      'Recorded masterclasses from experts',
      'Weekly Innovation Meet-Ups',
      'Industry mentorship opportunities'
    ],
    outcome: 'Empowers learners to innovate, build real-world solutions, and prepare for higher education or launch projects.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: '🚀',
    popular: false
  }
]

// Adapter function to convert local course format to Course type
function adaptCourse(localCourse: any): Course {
  return {
    id: localCourse.id,
    title: localCourse.title,
    level: localCourse.level,
    mode: 'online', // default value
    startDate: new Date().toISOString(), // default value
    duration: localCourse.duration,
    price: `$${localCourse.price}`,
    instructor: 'CoastedCode Team', // default value
    overview: localCourse.description,
    outcomes: localCourse.features,
    ageRange: localCourse.ageGroup
  }
}

export default function CoursesClient() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const ageGroups = [
    { id: 'all', label: 'All Ages', count: courses.length },
    { id: '6-9', label: 'Ages 6-9', count: courses.filter(c => c.ageGroup === '6-9 years').length },
    { id: '10-13', label: 'Ages 10-13', count: courses.filter(c => c.ageGroup === '10-13 years').length },
    { id: '14-17', label: 'Ages 14-17', count: courses.filter(c => c.ageGroup === '14-17 years').length }
  ]

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' }
  ]

  const filteredCourses = courses.filter(course => {
    const ageMatch = selectedAgeGroup === 'all' || course.ageGroup.includes(selectedAgeGroup)
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel
    return ageMatch && levelMatch
  })

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Choose Your Learning Track
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Each track is carefully designed for your child's age and skill level, with progressive learning that builds confidence and competence.
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Age Group Filter */}
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Age Group</h3>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedAgeGroup(group.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedAgeGroup === group.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {group.label} ({group.count})
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Skill Level</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedLevel === level.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredCourses.length}</span> of {courses.length} courses
        </p>
        {(selectedAgeGroup !== 'all' || selectedLevel !== 'all') && (
          <button
            onClick={() => { setSelectedAgeGroup('all'); setSelectedLevel('all') }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Courses Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedAgeGroup}-${selectedLevel}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard course={adaptCourse(course)} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Try adjusting your filters to see more courses
          </p>
          <button
            onClick={() => { setSelectedAgeGroup('all'); setSelectedLevel('all') }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Pricing Comparison */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Flexible Pricing Options
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Choose the plan that works best for your family
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Monthly</h4>
              <div className="text-3xl font-bold text-blue-600 mb-1">$29-49</div>
              <div className="text-sm text-slate-500 mb-4">per month</div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Access to all courses
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Free robotics kit
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Live sessions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Cancel anytime
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Quarterly</h4>
              <div className="text-3xl font-bold mb-1">$79-149</div>
              <div className="text-sm opacity-90 mb-4">per quarter</div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  15% savings
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Exclusive workshops
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-300 mr-2">✓</span>
                  Progress tracking
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Annual</h4>
              <div className="text-3xl font-bold text-green-600 mb-1">$249-399</div>
              <div className="text-sm text-slate-500 mb-4">per year</div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  30% savings
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  VIP mentorship
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Career guidance
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Portfolio building
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              What's included in the robotics kit?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Each kit includes age-appropriate robotics components, sensors, and step-by-step instructions. Kits are tailored to each course level.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Can my child switch courses?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Yes! Students can switch between courses within their age group. We'll help ensure they're in the right track for their skill level.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              How do the peer meetups work?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Weekly online sessions where students collaborate, share projects, and learn from each other in a safe, moderated environment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              What if my child needs extra help?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              We offer 1-on-1 tutoring sessions and have a dedicated support team. No student gets left behind!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
