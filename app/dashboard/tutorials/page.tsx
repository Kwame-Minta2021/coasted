'use client'
import { motion } from 'framer-motion'
import PaywallGuard from '@/components/PaywallGuard'
import TutorialCard from '@/components/TutorialCard'
import { sampleTutorials } from '@/lib/sampleData'
import { TRACKS } from '@/lib/tracks'

export default function TutorialsPage() {
  const student = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('student') || '{"id":"","name":"","email":""}')
    : { id:'', email:'' }

  const courseId = TRACKS[0].slug
  const priceGhs = 149

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-300">Tutorials</h1>
      <PaywallGuard isPremium={false} showUpgrade={true}>
        {/* UNLOCKED CONTENT BELOW */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={{ 
            hidden: { opacity: 0 }, 
            show: { 
              opacity: 1, 
              transition: { staggerChildren: 0.08 } 
            } 
          }} 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sampleTutorials.map(t => (
            <motion.div 
              key={t.id} 
              variants={{ 
                hidden: { opacity: 0, y: 8 }, 
                show: { opacity: 1, y: 0 } 
              }}
            >
              <TutorialCard title={t.title} videoUrl={t.videoUrl} description={t.description} />
            </motion.div>
          ))}
        </motion.div>
      </PaywallGuard>
    </div>
  )
}
