'use client'
import { useState, useMemo, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { TRACKS } from '@/lib/tracks'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, Users, BookOpen, ArrowRight, Star, MapPin, Calendar, Award, 
  Zap, Monitor, Users2, CheckCircle, Play, Trophy, GraduationCap, 
  Package, Video, Globe, Building, ChevronDown, ChevronUp
} from 'lucide-react'
// Performance utilities - simplified for development
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const performanceMonitor = {
  startMonitoring: () => {},
  recordRequest: () => {},
  recordError: () => {},
  endMonitoring: () => ({ loadTime: 0, renderTime: 0, memoryUsage: 0, networkRequests: 0, errors: 0 })
}
// Firebase database operations will be handled directly in components

export default function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [selectedMode, setSelectedMode] = useState<'in-lab' | 'online' | 'hybrid'>('in-lab')
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)
  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([])
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const loadParams = async () => {
      const { slug: trackSlug } = await params;
      setSlug(trackSlug);
    };
    loadParams();
  }, [params]);

  const track = useMemo(() => {
    if (!slug) return null;
    performanceMonitor.startMonitoring()
    const foundTrack = TRACKS.find(t => t.slug === slug)
    const metrics = performanceMonitor.endMonitoring()
    console.log('Track lookup performance:', metrics)
    return foundTrack
  }, [slug])

  if (!track) {
    notFound()
  }

  // Force new deployment - all TypeScript errors fixed
  const selectedModeData = {
    type: selectedMode,
    name: selectedMode === 'in-lab' ? 'In-Lab' : selectedMode === 'online' ? 'Online' : 'Hybrid',
    price: track.price.enrollment,
    schedule: selectedMode === 'in-lab' ? '2x/week, 2 hours each' : selectedMode === 'online' ? '3x/week, 1.5 hours each' : '2x/week in-lab + 1x/week online',
    location: selectedMode === 'in-lab' ? 'Our Learning Center' : selectedMode === 'online' ? 'Virtual Classroom' : 'Hybrid: Center + Online',
    instructors: [
      { name: 'Sarah Johnson', specialty: 'Robotics & AI' },
      { name: 'Mike Chen', specialty: 'Programming & Web Dev' },
      { name: 'Emma Davis', specialty: 'Creative Coding' }
    ],
    features: [
      'Live instruction with expert teachers',
      'Hands-on projects and experiments',
      'Peer collaboration and teamwork',
      'Real-time feedback and support',
      'Progress tracking and assessments',
      'Portfolio building opportunities',
      'Access to learning resources',
      'Parent progress reports'
    ]
  }

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'in-lab':
        return <Users2 className="h-5 w-5" />
      case 'online':
        return <Monitor className="h-5 w-5" />
      case 'hybrid':
        return <Zap className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getModeColor = (type: string) => {
    switch (type) {
      case 'in-lab':
        return 'from-blue-500 to-cyan-500'
      case 'online':
        return 'from-emerald-500 to-teal-500'
      case 'hybrid':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const toggleFeatureExpansion = (modeType: string) => {
    setExpandedFeatures(prev => 
      prev.includes(modeType) 
        ? prev.filter(t => t !== modeType)
        : [...prev, modeType]
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-emerald-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-emerald-500/10 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm border border-primary/20 mb-6">
                <Award className="h-4 w-4" />
                <span>{track.ages.includes('6-9') ? 'Beginner' : track.ages.includes('10-13') ? 'Core' : 'Advanced'} Level</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-primary to-emerald-600 bg-clip-text text-transparent mb-6">
                {track.name}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {track.tagline}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{track.ages}</div>
                  <div className="text-sm text-muted-foreground">Age Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{track.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
              </div>

                             {/* Mode Selector */}
               <div className="flex gap-4 mb-8">
                 {([
                   { type: 'in-lab' as const, name: 'In-Lab' },
                   { type: 'online' as const, name: 'Online' },
                   { type: 'hybrid' as const, name: 'Hybrid' }
                 ] as const).map((mode) => (
                  <motion.button
                    key={mode.type}
                    onClick={() => setSelectedMode(mode.type)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                      selectedMode === mode.type
                        ? 'bg-gradient-to-r ' + getModeColor(mode.type) + ' text-white border-transparent shadow-lg'
                        : 'bg-white/50 dark:bg-slate-700/50 border-white/20 dark:border-slate-600/50 hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getModeIcon(mode.type)}
                    <span className="text-sm font-medium">{mode.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
                             <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                 <div className="w-full h-96 bg-gradient-to-br from-primary/20 via-purple-500/20 to-emerald-500/20" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected Mode Details */}
      {selectedModeData && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              key={selectedMode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50"
            >
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Mode Information */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${getModeColor(selectedMode)} text-white`}>
                      {getModeIcon(selectedMode)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{selectedModeData.name}</h2>
                      <p className="text-muted-foreground">{selectedModeData.schedule}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">{selectedModeData.location}</span>
                  </div>

                  {/* Instructors */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Expert Instructors</h3>
                    <div className="grid gap-3">
                      {selectedModeData.instructors.map((instructor, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{instructor.name}</div>
                            <div className="text-sm text-muted-foreground">{instructor.specialty}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">What's Included</h3>
                    <div className="space-y-3">
                      {selectedModeData.features.slice(0, expandedFeatures.includes(selectedMode) ? undefined : 6).map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    {selectedModeData.features.length > 6 && (
                      <button
                        onClick={() => toggleFeatureExpansion(selectedMode)}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-4"
                      >
                        {expandedFeatures.includes(selectedMode) ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show More ({selectedModeData.features.length - 6} more)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Pricing and Enrollment */}
                <div className="lg:pl-8">
                  <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-emerald-500/10 rounded-3xl p-8 border border-primary/20">
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        GHS {selectedModeData.price.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">per student</div>
                    </div>

                    {/* Key Benefits */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                          <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Free Kit Included</div>
                          <div className="text-sm text-muted-foreground">Delivered to your home</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                                                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                           <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                         </div>
                        <div>
                          <div className="font-medium text-foreground">Certificate</div>
                          <div className="text-sm text-muted-foreground">Upon completion</div>
                        </div>
                      </div>

                      {selectedMode === 'online' && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                            <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Weekly Challenges</div>
                            <div className="text-sm text-muted-foreground">Compete and rank</div>
                          </div>
                        </div>
                      )}

                      {selectedMode === 'in-lab' && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                            <Users2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">5 Expert Instructors</div>
                            <div className="text-sm text-muted-foreground">Max 25 students</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enrollment Button */}
                    <motion.button
                      onClick={() => setShowEnrollmentForm(true)}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Enroll Now - {selectedModeData.name}
                    </motion.button>

                    <div className="text-center mt-4 text-sm text-muted-foreground">
                      Secure payment • Free kit delivery • 30-day satisfaction guarantee
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Course Modules */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Course Curriculum</h2>
            <p className="text-xl text-muted-foreground">Step-by-step learning journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {[
               { week: 1, title: 'Introduction to Programming' },
               { week: 2, title: 'Building Interactive Projects' },
               { week: 3, title: 'Advanced Concepts & Portfolio' }
             ].map((module, index) => (
               <motion.div
                 key={module.week}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50"
               >
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                     {module.week}
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground">Week {module.week}</h3>
                     <div className="text-sm text-muted-foreground">{module.title}</div>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What You'll Learn</h2>
            <p className="text-xl text-muted-foreground">Skills and knowledge you'll gain</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {track.outcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-emerald-500/5 rounded-2xl p-6 border border-primary/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Skill {index + 1}</h3>
                </div>
                <p className="text-foreground">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {showEnrollmentForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEnrollmentForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Enroll in {track.name}</h3>
              <p className="text-muted-foreground mb-6">
                {selectedModeData?.name} - GHS {selectedModeData?.price.toLocaleString()}
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Student Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Parent Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEnrollmentForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-foreground hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
