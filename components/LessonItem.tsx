'use client'

import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle, Lock } from 'lucide-react'

interface LessonItemProps {
  id: string
  title: string
  duration: string
  isCompleted?: boolean
  isLocked?: boolean
  onClick?: () => void
}

export default function LessonItem({ 
  id, 
  title, 
  duration, 
  isCompleted = false, 
  isLocked = false,
  onClick 
}: LessonItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
        isCompleted 
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
          : isLocked
          ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          isCompleted 
            ? 'bg-green-500 text-white' 
            : isLocked
            ? 'bg-slate-400 text-white'
            : 'bg-blue-500 text-white group-hover:bg-blue-600'
        }`}>
          {isCompleted ? (
            <CheckCircle className="h-5 w-5" />
          ) : isLocked ? (
            <Lock className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            isCompleted 
              ? 'text-green-800 dark:text-green-200' 
              : isLocked
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-slate-900 dark:text-white'
          }`}>
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {duration}
            </span>
            {isCompleted && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
