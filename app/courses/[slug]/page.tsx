'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, Star, ArrowRight, CheckCircle, Play } from 'lucide-react'
import Link from 'next/link'

// Mock course data - in real app this would come from database
const getCourseBySlug = (slug: string) => {
  const courses = [
    {
      slug: 'python-basics',
      title: 'Python Programming Fundamentals',
      summary: 'Learn the basics of Python programming with hands-on projects and real-world applications.',
      description: 'Master Python programming from the ground up. This comprehensive course covers variables, data types, control structures, functions, and object-oriented programming. Perfect for beginners with no prior coding experience.',
      duration: '8 weeks',
      level: 'Beginner',
      students: 1247,
      rating: 4.8,
      price: 'GHS 149',
      features: [
        'Interactive coding exercises',
        'Real-world projects',
        'Live instructor support',
        'Certificate of completion',
        'Lifetime access to materials',
        'Mobile-friendly learning'
      ],
      curriculum: [
        'Introduction to Python',
        'Variables and Data Types',
        'Control Structures',
        'Functions and Modules',
        'Object-Oriented Programming',
        'File Handling',
        'Error Handling',
        'Final Project'
      ]
    },
    {
      slug: 'web-development',
      title: 'Web Development with HTML, CSS & JavaScript',
      summary: 'Build modern, responsive websites from scratch using the latest web technologies.',
      description: 'Create stunning websites that work on all devices. Learn HTML5, CSS3, and JavaScript to build interactive, responsive web applications. Includes modern frameworks and best practices.',
      duration: '10 weeks',
      level: 'Intermediate',
      students: 892,
      rating: 4.9,
      price: 'GHS 199',
      features: [
        'Responsive design principles',
        'Modern CSS frameworks',
        'JavaScript ES6+ features',
        'Web accessibility standards',
        'Performance optimization',
        'Deployment strategies'
      ],
      curriculum: [
        'HTML5 Fundamentals',
        'CSS3 Styling',
        'Responsive Design',
        'JavaScript Basics',
        'DOM Manipulation',
        'Async Programming',
        'Web APIs',
        'Final Website Project'
      ]
    },
    {
      slug: 'ai-machine-learning',
      title: 'AI & Machine Learning for Kids',
      summary: 'Introduction to artificial intelligence and machine learning concepts through fun, interactive projects.',
      description: 'Explore the fascinating world of AI and machine learning! Learn how computers can learn and make decisions. Build your own AI projects using Python and popular ML libraries.',
      duration: '12 weeks',
      level: 'Advanced',
      students: 567,
      rating: 4.7,
      price: 'GHS 249',
      features: [
        'Hands-on AI projects',
        'Machine learning algorithms',
        'Data visualization',
        'Ethical AI principles',
        'Real-world applications',
        'Expert mentorship'
      ],
      curriculum: [
        'Introduction to AI',
        'Machine Learning Basics',
        'Data Preprocessing',
        'Supervised Learning',
        'Unsupervised Learning',
        'Neural Networks',
        'AI Ethics',
        'Capstone Project'
      ]
    }
  ]
  
  return courses.find(course => course.slug === slug) || courses[0]
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [course, setCourse] = useState<any>(null)
  
  useEffect(() => {
    const loadCourse = () => {
      const { slug } = params;
      const courseData = getCourseBySlug(slug);
      setCourse(courseData);
    };
    loadCourse();
  }, [params]);

  const handleEnroll = async () => {
    if (!course) return;
    
    setIsEnrolling(true)
    setEnrollmentStatus('idle')
    
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseSlug: course.slug,
          courseTitle: course.title
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setEnrollmentStatus('success')
        // Redirect to student dashboard after successful enrollment
        setTimeout(() => {
          window.location.href = `/student?course=${result.courseId}`
        }, 2000)
      } else {
        setEnrollmentStatus('error')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      setEnrollmentStatus('error')
    } finally {
      setIsEnrolling(false)
    }
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/courses" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to Courses
          </Link>
        </nav>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl mb-8"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-600 dark:text-slate-400">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-slate-600 dark:text-slate-400">{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-slate-600 dark:text-slate-400">{course.rating}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-slate-600 dark:text-slate-400">{course.level}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              {/* Enrollment Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {course.price}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    One-time payment
                  </div>
                </div>
                
                                 <button
                   onClick={handleEnroll}
                   disabled={isEnrolling}
                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
                 >
                   {isEnrolling ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       Joining Waitlist...
                     </>
                   ) : (
                     <>
                       <Play className="w-5 h-5" />
                       Join Waitlist
                     </>
                   )}
                 </button>
                
                                 {enrollmentStatus === 'success' && (
                   <div className="text-center text-green-600 dark:text-green-400 text-sm">
                     ✅ Successfully joined waitlist! We'll notify you when enrollment opens.
                   </div>
                 )}
                
                                 {enrollmentStatus === 'error' && (
                   <div className="text-center text-red-600 dark:text-red-400 text-sm">
                     ❌ Failed to join waitlist. Please try again.
                   </div>
                 )}
                 
                 <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                   Be first to know when enrollment opens
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Curriculum */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Curriculum</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.curriculum.map((module: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {index + 1}
                </div>
                <span className="text-slate-700 dark:text-slate-300">{module}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
