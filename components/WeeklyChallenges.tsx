'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Calendar, Clock, Users, Star, Target, 
  TrendingUp, Award, Zap, Code, Palette, Brain,
  ChevronRight, Play, Upload, CheckCircle
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'coding' | 'robotics' | 'design' | 'problem-solving'
  difficulty: 'easy' | 'medium' | 'hard'
  startDate: string
  endDate: string
  maxPoints: number
  isActive: boolean
  submissionsCount: number
}

interface Submission {
  id: string
  studentName: string
  points: number
  submittedAt: string
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
}

export default function WeeklyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [rankings, setRankings] = useState<Submission[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Robot Maze Navigator',
        description: 'Program your robot to navigate through a complex maze using sensors. Submit a video of your robot completing the challenge.',
        type: 'robotics',
        difficulty: 'medium',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        maxPoints: 100,
        isActive: true,
        submissionsCount: 45
      },
      {
        id: '2',
        title: 'Python Data Analyzer',
        description: 'Create a Python script to analyze a dataset and generate insights. Include visualizations and key findings.',
        type: 'coding',
        difficulty: 'hard',
        startDate: '2024-01-22',
        endDate: '2024-01-29',
        maxPoints: 100,
        isActive: true,
        submissionsCount: 32
      },
      {
        id: '3',
        title: 'Responsive Website Design',
        description: 'Build a responsive website that works perfectly on desktop, tablet, and mobile devices.',
        type: 'design',
        difficulty: 'medium',
        startDate: '2024-01-29',
        endDate: '2024-02-05',
        maxPoints: 100,
        isActive: false,
        submissionsCount: 28
      }
    ]

    const mockRankings: Submission[] = [
      { id: '1', studentName: 'Kwame Addo', points: 95, submittedAt: '2024-01-20', status: 'approved' },
      { id: '2', studentName: 'Ama Osei', points: 92, submittedAt: '2024-01-19', status: 'approved' },
      { id: '3', studentName: 'David Kofi', points: 88, submittedAt: '2024-01-21', status: 'approved' },
      { id: '4', studentName: 'Sarah Johnson', points: 85, submittedAt: '2024-01-18', status: 'approved' },
      { id: '5', studentName: 'Michael Chen', points: 82, submittedAt: '2024-01-20', status: 'approved' }
    ]

    setChallenges(mockChallenges)
    setRankings(mockRankings)
  }, [])

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return <Code className="h-5 w-5" />
      case 'robotics':
        return <Zap className="h-5 w-5" />
      case 'design':
        return <Palette className="h-5 w-5" />
      case 'problem-solving':
        return <Brain className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-100'
    }
  }

  const getRankingIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Award className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
          {rank}
        </div>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-6 py-3 text-sm font-medium text-yellow-700 dark:text-yellow-300 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 mb-6"
        >
          <Trophy className="h-4 w-4" />
          <span>Weekly Challenges</span>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Compete & Learn
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Take on weekly challenges, compete with peers, and climb the leaderboard. 
          Show off your skills and win recognition!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Challenges */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Active Challenges
          </h3>
          
          <div className="space-y-4">
            {challenges.filter(c => c.isActive).map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white">
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {challenge.maxPoints} points
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedChallenge(challenge)
                      setShowSubmissionForm(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Upload className="h-4 w-4" />
                    Submit
                  </motion.button>
                </div>
                
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{challenge.submissionsCount} submissions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            This Week's Leaderboard
          </h3>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/50">
            <div className="space-y-4">
              {rankings.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800' 
                      : index === 1 
                      ? 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-200 dark:border-gray-800'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-200 dark:border-amber-800'
                      : 'bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankingIcon(index + 1)}
                    <div>
                      <div className="font-semibold text-foreground">{submission.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {submission.points}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  View Full Leaderboard
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmissionForm && selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmissionForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white">
                  {getChallengeIcon(selectedChallenge.type)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedChallenge.title}</h3>
                  <p className="text-muted-foreground">{selectedChallenge.maxPoints} points</p>
                </div>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-foreground resize-none"
                    placeholder="Describe your solution, approach, and what you learned..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project URL (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-foreground"
                    placeholder="https://your-project.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Upload Files</label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drag and drop your files here, or click to browse</p>
                    <p className="text-sm text-muted-foreground">Supports: ZIP, PDF, Images, Videos (max 50MB)</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-foreground hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Submit Challenge
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
