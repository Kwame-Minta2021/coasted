'use client'
import { useState, useMemo, useCallback, useEffect, useTransition } from 'react'
import Section from '@/components/Section'
import { TRACKS } from '@/lib/tracks'
import TrackCard from '@/components/TrackCard'
import { Search, Filter, Users, Clock, GraduationCap, Sparkles, Zap, Target, Rocket, Brain, Code, Palette, Globe, Shield, Award } from 'lucide-react'
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

export default function TracksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAge, setSelectedAge] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const ageGroups = [
    { value: 'all', label: 'All Ages', icon: Users },
    { value: '6-9', label: 'Ages 6-9', icon: Brain },
    { value: '10-13', label: 'Ages 10-13', icon: Code },
    { value: '14-17', label: 'Ages 14-17', icon: Rocket },
  ]

  const levels = [
    { value: 'all', label: 'All Levels', icon: Target },
    { value: 'Beginner', label: 'Beginner', icon: Sparkles },
    { value: 'Core', label: 'Core', icon: Zap },
    { value: 'Advanced', label: 'Advanced', icon: Award },
  ]

  // Filtering logic - Force new deployment to pick up latest commit - All TypeScript errors fixed - TrackCard component updated
  const filteredTracks = useMemo(() => {
    const filtered = TRACKS.filter(track => {
      const matchesSearch = !searchTerm || 
                           track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.tagline.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAge = selectedAge === 'all' || 
                        (selectedAge === '6-9' && track.ages.includes('6')) ||
                        (selectedAge === '10-13' && track.ages.includes('10')) ||
                        (selectedAge === '14-17' && track.ages.includes('14'))
      
      const matchesLevel = selectedLevel === 'all' || 
                          (selectedLevel === 'Beginner' && track.ages.includes('6-9')) ||
                          (selectedLevel === 'Core' && track.ages.includes('10-13')) ||
                          (selectedLevel === 'Advanced' && track.ages.includes('14-17'))
      
      return matchesSearch && matchesAge && matchesLevel
    });

    return filtered;
  }, [searchTerm, selectedAge, selectedLevel])

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      startTransition(() => {
        setSearchTerm(value);
      });
    }, 300),
    []
  );

  // Throttled hover handler
  const throttledSetHoveredTrack = useCallback(
    throttle((trackSlug: string | null) => {
      setHoveredTrack(trackSlug);
    }, 100),
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <Section className="relative overflow-hidden pb-0 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-float-slow" />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-3xl animate-float-medium" />
          <div className="absolute left-1/2 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl animate-float-fast" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-emerald-500/10 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Choose Your Learning Path</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-primary to-emerald-600 bg-clip-text text-transparent mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            Learning Tracks
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            From beginner to advanced, our pathways are designed to build confidence, real skills, and a love for STEM.
          </p>

          {/* Floating Icons */}
          <div className="mt-12 flex justify-center gap-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            {['🤖', '🧠', '💻', '🎨'].map((icon, index) => (
              <div
                key={index}
                className="text-4xl md:text-5xl animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          {[
            { icon: Users, value: TRACKS.length, label: 'Learning Tracks', color: 'from-blue-500 to-cyan-500' },
            { icon: Clock, value: '8-12', label: 'Weeks Duration', color: 'from-emerald-500 to-teal-500' },
            { icon: GraduationCap, value: '100%', label: 'Project-Based', color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Enhanced Filters Section */}
      <Section>
        <div className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-emerald-500/5 rounded-3xl blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
                  <input
                    type="text"
                    placeholder="Search tracks by name, description, or skills..."
                    defaultValue={searchTerm}
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl border border-white/20 dark:border-slate-600/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                {ageGroups.map((group) => {
                  const Icon = group.icon
                  return (
                    <button
                      key={group.value}
                      onClick={() => setSelectedAge(group.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                        selectedAge === group.value
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                          : 'bg-white/50 dark:bg-slate-700/50 border-white/20 dark:border-slate-600/50 hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{group.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Enhanced Tracks Grid */}
      <Section>
        {filteredTracks.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
            {filteredTracks.map((track, index) => (
              <div
                key={track.slug}
                onMouseEnter={() => throttledSetHoveredTrack(track.slug)}
                onMouseLeave={() => throttledSetHoveredTrack(null)}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${1200 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <TrackCard t={track} isHovered={hoveredTrack === track.slug} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-0 animate-fade-in-up" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div className="relative z-10">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No tracks found
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedAge('all')
                    setSelectedLevel('all')
                  }}
                  className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Enhanced CTA Section */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-emerald-500/10" />
        <div className="relative text-center max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '1400ms', animationFillMode: 'forwards' }}>
          <div className="mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="text-6xl mb-4">🚀</div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-primary to-emerald-600 bg-clip-text text-transparent mb-6">
            Ready to Start Your Child's Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join hundreds of families who have already discovered the power of hands-on learning with Coasted Code.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/enroll"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Rocket className="h-5 w-5 group-hover:animate-bounce" />
              Enroll Now
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-foreground px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Globe className="h-5 w-5 group-hover:animate-spin" />
              Get in Touch
            </a>
          </div>
        </div>
      </Section>
    </main>
  )
}
