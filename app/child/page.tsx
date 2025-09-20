"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Star,
  ChevronRight,
  CheckCircle,
  Settings,
  Bell,
  Search,
  Filter,
  Sparkles,
  Rocket,
  Gamepad2,
  Music,
  Video,
  Palette,
  Code
} from 'lucide-react';

// Mock data for child learning dashboard
const mockChildData = {
  displayName: "Alex",
  avatar: "👦",
  level: "Explorer",
  streak: 5,
  totalLessons: 18,
  completedLessons: 12,
  totalHours: 8.5,
  certificates: 2,
  currentCourse: "Fun with Python Programming",
  nextLesson: "Creating Your First Game",
  achievements: [
    { id: 1, name: "First Steps", icon: "🎯", description: "Complete your first lesson", earned: true },
    { id: 2, name: "Week Warrior", icon: "🔥", description: "5-day learning streak", earned: true },
    { id: 3, name: "Quick Learner", icon: "⚡", description: "Complete 3 lessons in a day", earned: false },
    { id: 4, name: "Code Master", icon: "💻", description: "Complete 10 programming lessons", earned: false }
  ],
  recentActivity: [
    { id: 1, type: "lesson", title: "Variables and Data Types", time: "2 hours ago", status: "completed", icon: "📝" },
    { id: 2, type: "quiz", title: "Python Basics Quiz", time: "1 day ago", status: "passed", icon: "🧠" },
    { id: 3, type: "project", title: "Calculator App", time: "3 days ago", status: "submitted", icon: "🎨" }
  ],
  recommendedCourses: [
    { id: 1, title: "Art & Creativity Workshop", instructor: "Ms. Sarah", rating: 4.9, students: 1245, difficulty: "Beginner", image: "🎨", color: "from-pink-400 to-purple-500" },
    { id: 2, title: "Music & Rhythm", instructor: "Ms. Emma", rating: 4.7, students: 1568, difficulty: "Beginner", image: "🎵", color: "from-green-400 to-emerald-500" },
    { id: 3, title: "Digital Storytelling", instructor: "Mr. Tom", rating: 4.9, students: 2341, difficulty: "Intermediate", image: "📖", color: "from-orange-400 to-red-500" }
  ],
  learningCategories: [
    { id: 1, name: "Programming", icon: Code, color: "from-blue-500 to-purple-600", lessons: 8, completed: 6 },
    { id: 2, name: "Art & Design", icon: Palette, color: "from-pink-500 to-rose-600", lessons: 6, completed: 3 },
    { id: 3, name: "Digital Media", icon: Video, color: "from-green-500 to-emerald-600", lessons: 5, completed: 2 }
  ]
};

export default function ChildPortalPage() {
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const startFocusSession = () => {
    setIsFocusActive(true);
  };

  const stopFocusSession = () => {
    setIsFocusActive(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-30"></div>
        
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
                    {mockChildData.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Hi, {mockChildData.displayName}!
          </h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold">
                      {mockChildData.level} Level
                    </span>
                    <span className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">{mockChildData.streak} day streak</span>
                    </span>
                  </div>
                </div>
              </div>
        </div>

            {/* Modern Quick Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Overview */}
      <div className="container mx-auto px-6 -mt-4 mb-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} className="group">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Learning Progress</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">
                    {Math.round((mockChildData.completedLessons / mockChildData.totalLessons) * 100)}%
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  style={{ width: `${(mockChildData.completedLessons / mockChildData.totalLessons) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Learning Time</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">{mockChildData.totalHours}h</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total fun time learning!</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Achievements</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">{mockChildData.certificates}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Badges earned!</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Screen Time</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">75m</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Left today</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        {/* Modern Tab Navigation */}
        <div className="flex space-x-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-3 mb-12 border border-white/20 shadow-xl">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('play')}
            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'play'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Play
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'home' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Current Course Progress */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                    Current Adventure
          </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    {mockChildData.currentCourse}
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Next Lesson */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-800/30 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Next Lesson</h3>
                    <Play className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {mockChildData.nextLesson}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                    Ready for your next exciting adventure? Let's learn something amazing!
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <Play className="w-7 h-7 inline mr-3" />
                    Start Learning!
                  </button>
            </div>
            
                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/30 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Adventures</h3>
                    <Sparkles className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-4">
                    {mockChildData.recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/60 dark:bg-slate-700/60 rounded-2xl backdrop-blur-sm">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                          {activity.icon}
              </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white text-lg">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {activity.time}
                  </p>
                </div>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-7 h-7 text-green-500" />
                        ) : (
                          <Clock className="w-7 h-7 text-blue-500" />
              )}
                      </div>
                    ))}
            </div>
          </div>
              </div>
            </motion.div>

            {/* Learning Categories */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
                Learning Categories
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockChildData.learningCategories.map((category) => (
                  <div key={category.id} className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="w-10 h-10 text-white" />
        </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                      {category.name}
            </h3>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {category.completed}/{category.lessons}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 mb-3 overflow-hidden">
                        <div 
                          className={`h-4 rounded-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                          style={{ width: `${(category.completed / category.lessons) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        lessons completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Recommended for You
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-bold text-lg flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <span>View All</span>
                  <ChevronRight className="w-6 h-6" />
            </button>
          </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockChildData.recommendedCourses.map((course) => (
                  <div key={course.id} className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3">
                    <div className={`w-20 h-20 bg-gradient-to-br ${course.color} rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {course.image}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-center text-xl">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
                      by {course.instructor}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {course.students} students
                      </span>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <span className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold">
                        {course.difficulty}
                      </span>
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Start Learning!
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-800/30 rounded-3xl p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Focus Mode
            </h3>
            {!isFocusActive ? (
              <button
                onClick={startFocusSession}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                    <Play className="w-7 h-7 inline mr-3" />
                Start Focus Session
              </button>
            ) : (
              <button
                onClick={stopFocusSession}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Stop Focus Session
              </button>
            )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-800/30 rounded-3xl p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  All Lessons
                </h3>
                <button
                  onClick={() => window.location.href = '/dashboard/lessons'}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <BookOpen className="w-7 h-7 inline mr-3" />
                  Explore Lessons
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">My Courses</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg w-80"
                    />
                  </div>
                  <button className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Filter className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </button>
          </div>
        </div>

              <div className="text-center py-16">
                <BookOpen className="w-24 h-24 text-slate-400 mx-auto mb-6" />
                <p className="text-slate-600 dark:text-slate-400 text-xl">Course management features coming soon...</p>
            </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">Achievements & Badges</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockChildData.achievements.map((achievement) => (
                  <div key={achievement.id} className={`rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-800/30 shadow-xl' 
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 opacity-60'
                  }`}>
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                        : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      {achievement.icon}
            </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {achievement.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <div className="mt-4">
                        <span className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-2xl text-sm font-bold">
                          Earned!
                        </span>
              </div>
            )}
          </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'play' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">Learning Games</h2>
              
              <div className="text-center py-16">
                <Gamepad2 className="w-24 h-24 text-slate-400 mx-auto mb-6" />
                <p className="text-slate-600 dark:text-slate-400 text-xl">Educational games coming soon...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
        </div>
      </div>
  );
}
