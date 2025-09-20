'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { 
  BookOpen, 
  Folder, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  Gamepad2, 
  Shield, 
  Settings,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  Users,
  Star
} from 'lucide-react'

export default function StudentOverview() {
  const { user } = useAuth()
  const [studentName, setStudentName] = useState<string>('Student')
  const [scheduledPrograms, setScheduledPrograms] = useState<any[]>([])
  const [studentAgeGroup, setStudentAgeGroup] = useState<string>('')
  const [stats, setStats] = useState({
    completedModules: 0,
    totalModules: 0,
    completedProjects: 0,
    totalProjects: 0,
    completedTasks: 0,
    totalTasks: 0,
    pendingAssignments: 0,
    unreadMessages: 0,
    currentStreak: 0,
    totalPoints: 0
  })

  // Fetch student name and age group from enrollment data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.email) {
        setStudentName('Student');
        return;
      }

      try {
        const { data: enrollment, error } = await supabase
          .from('enrollments')
          .select('child_name, age_band')
          .eq('email', user.email)
          .single();

        if (enrollment && !error) {
          setStudentName(enrollment.child_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
          setStudentAgeGroup(enrollment.age_band || '');
        } else {
          setStudentName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setStudentName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
      }
    };

    fetchStudentData();
  }, [user?.email, user?.user_metadata?.full_name])

  // Fetch scheduled programs
  useEffect(() => {
    const fetchScheduledPrograms = async () => {
      if (!user?.email) {
        return;
      }

      try {
        const response = await fetch(`/api/student/schedule?student_email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        
        if (data.success) {
          setScheduledPrograms(data.schedule || []);
        }
      } catch (err) {
        console.error('Error fetching scheduled programs:', err);
      }
    };

    fetchScheduledPrograms();
  }, [user?.email])

  const [recentActivity, setRecentActivity] = useState([])

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current module',
      icon: BookOpen,
      href: '/student/modules',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Projects',
      description: 'Check your project progress',
      icon: Folder,
      href: '/student/projects',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Messages',
      description: 'Read instructor messages',
      icon: MessageSquare,
      href: '/student/messages',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module': return BookOpen
      case 'project': return Folder
      default: return Star
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-blue-100">
              Ready to continue your coding journey? Let's make today productive!
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm text-blue-100">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <div className="text-sm text-blue-100">Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Modules</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.completedModules}/{stats.totalModules}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(stats.completedModules / stats.totalModules) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Projects</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.completedProjects}/{stats.totalProjects}
              </p>
            </div>
            <Folder className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.completedProjects / stats.totalProjects) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </div>
            <CheckSquare className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Assignments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.pendingAssignments}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <a
                key={index}
                href={action.href}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
              </a>
            )
          })}
        </div>
      </div>

       {/* Scheduled Programs */}
       {scheduledPrograms.length > 0 && (
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Programs</h2>
             {studentAgeGroup && (
               <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                 Age Group: {studentAgeGroup}
               </span>
             )}
           </div>
          <div className="space-y-4">
            {scheduledPrograms.slice(0, 3).map((program) => (
              <div key={program.id} className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{program.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(program.startTime).toLocaleDateString()} at {new Date(program.startTime).toLocaleTimeString()}
                  </p>
                  {program.instructor && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">with {program.instructor.name}</p>
                  )}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {program.eventType}
                </div>
              </div>
            ))}
          </div>
          {scheduledPrograms.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                View all {scheduledPrograms.length} programs
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">+{activity.points}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">points</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{deadline.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Due: {new Date(deadline.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}