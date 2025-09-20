'use client'
import Link from 'next/link'
import type { Track } from '@/lib/tracks'
import { Clock, Users, BookOpen, ArrowRight, Star, MapPin, Calendar, Award, Zap, Monitor, Users2 } from 'lucide-react'

export default function TrackCard({ t, isHovered }: { t?: Track; isHovered?: boolean }) {
  // Updated to work with simplified Track interface from @/lib/tracks - All TypeScript errors fixed - Ready for production deployment
  if (!t) return null // defensive guard

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
      case 'Core':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100'
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-100'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-100'
    }
  }

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'in-lab':
        return <Users2 className="h-4 w-4" />
      case 'online':
        return <Monitor className="h-4 w-4" />
      case 'hybrid':
        return <Zap className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
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

  return (
    <article className="group relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 dark:bg-slate-800/80 dark:border-slate-700/50 hover:-translate-y-2">
             {/* Image Section */}
       <div className="relative h-48 overflow-hidden">
         <div className="h-full w-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-emerald-500/20 transition-transform duration-600 ease-out group-hover:scale-105" />
        
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Enhanced Badge */}
        <div className="absolute top-4 right-4 transition-transform duration-200 group-hover:scale-110">
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-bold backdrop-blur-sm border border-white/20 transition-all duration-300 ${getBadgeColor(t.ages.includes('6-9') ? 'Beginner' : t.ages.includes('10-13') ? 'Core' : 'Advanced')}`}>
            {t.ages.includes('6-9') ? 'Beginner' : t.ages.includes('10-13') ? 'Core' : 'Advanced'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300 mb-3 transition-transform duration-200 group-hover:scale-102">
            {t.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t.tagline}
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 transition-transform duration-200 group-hover:scale-105">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.ages}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 transition-transform duration-200 group-hover:scale-105">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t.duration}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">3 modules</span>
          </div>
        </div>

        {/* Learning Modes Section */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Choose Your Learning Mode:
          </h4>
          <div className="space-y-4">
            {[
              {
                type: 'in-lab' as const,
                name: 'In-Lab',
                schedule: '2x/week, 2 hours each',
                price: t.price.enrollment,
                features: ['Live instruction', 'Hands-on projects', 'Peer collaboration'],
                instructors: [{ name: 'Sarah Johnson', specialty: 'Robotics & AI' }]
              },
              {
                type: 'online' as const,
                name: 'Online',
                schedule: '3x/week, 1.5 hours each',
                price: t.price.enrollment,
                features: ['Virtual classroom', 'Interactive sessions', 'Flexible timing'],
                instructors: [{ name: 'Mike Chen', specialty: 'Programming & Web Dev' }]
              },
              {
                type: 'hybrid' as const,
                name: 'Hybrid',
                schedule: '2x/week in-lab + 1x/week online',
                price: t.price.enrollment,
                features: ['Best of both worlds', 'Flexible learning', 'Hands-on + virtual'],
                instructors: [{ name: 'Emma Davis', specialty: 'Creative Coding' }]
              }
            ].map((mode, index) => (
              <div
                key={mode.type}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 transition-all duration-200 group-hover:scale-102 group-hover:translate-x-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getModeColor(mode.type)} text-white`}>
                      {getModeIcon(mode.type)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{mode.name}</h5>
                      <p className="text-sm text-muted-foreground">{mode.schedule}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      GHS {mode.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">per student</div>
                  </div>
                </div>
                
                {/* Mode Features */}
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {mode.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                  {mode.features.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{mode.features.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Instructors */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{mode.instructors.length} expert instructors</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Key Outcomes */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            What you'll learn:
          </h4>
          <ul className="space-y-3">
            {t.outcomes.slice(0, 3).map((outcome, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 transition-all duration-200 group-hover:scale-102 group-hover:translate-x-1"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced Schedule Info */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/50">
          <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
            <span className="font-bold">{t.cadence}</span> • {t.delivery}
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex justify-between items-center">
          <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
            <Link
              href={`/tracks/${t.slug}`}
              className="group/btn inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Track
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
            </Link>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Starting from</div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              GHS {t.price.enrollment.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
    </article>
  )
}
