'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock, Star, Zap } from 'lucide-react'

interface PaywallGuardProps {
  children: ReactNode
  isPremium?: boolean
  showUpgrade?: boolean
}

export default function PaywallGuard({ children, isPremium = false, showUpgrade = true }: PaywallGuardProps) {
  if (isPremium) {
    return <>{children}</>
  }

  if (!showUpgrade) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-8 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
      
      <div className="relative z-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
          <Lock className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Premium Content
        </h3>
        
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Unlock this exclusive content and accelerate your learning journey
        </p>
        
        <div className="mb-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Advanced lessons and projects</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>Priority instructor support</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span>Exclusive resources and tools</span>
          </div>
        </div>
        
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
          <Star className="h-4 w-4" />
          Upgrade to Premium
        </button>
      </div>
    </motion.div>
  )
}
