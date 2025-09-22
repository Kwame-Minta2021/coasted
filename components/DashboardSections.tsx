'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { 
  Play, 
  Clock, 
  Award, 
  BookOpen, 
  Target, 
  Calendar, 
  Star,
  CheckCircle,
  Lock,
  Zap,
  Users,
  Trophy,
  BarChart3,
  Bookmark,
  Download,
  Share2,
  MessageCircle,
  Heart,
  Eye,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  BookOpen as BookOpenIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Star as StarIcon,
  PlayCircle,
  Pause,
  SkipForward,
  Volume2,
  Settings,
  Bell,
  Search,
  Filter,
  Grid,
  List,
  Shield,
  EyeOff,
  Timer,
  GraduationCap,
  Book,
  Video,
  FileText,
  Code,
  Bot,
  Brain,
  Palette
} from 'lucide-react';

// Course-specific lesson data
const courseLessons = {
  'junior-makers': [
    { id: 1, title: "Creative Thinking & Imagination Lab", duration: "45 min", status: "completed", type: "interactive", description: "Spark creativity through fun activities and games" },
    { id: 2, title: "Critical Thinking through Storytelling", duration: "60 min", status: "completed", type: "story", description: "Learn problem-solving through engaging stories" },
    { id: 3, title: "Introduction to Coding with Blocks", duration: "50 min", status: "in-progress", type: "coding", description: "Start coding with visual block programming" },
    { id: 4, title: "Digital Play & Simple Robotics", duration: "55 min", status: "locked", type: "robotics", description: "Assemble and play with your robotics kit" },
    { id: 5, title: "Math Adventures with Games", duration: "40 min", status: "locked", type: "math", description: "Learn math through interactive games" },
    { id: 6, title: "Introduction to AI Concepts", duration: "45 min", status: "locked", type: "ai", description: "Discover what AI is through fun examples" }
  ],
  'cc-ai-lab': [
    { id: 1, title: "Problem Solving & Logical Reasoning", duration: "50 min", status: "completed", type: "logic", description: "Develop critical thinking skills" },
    { id: 2, title: "Introduction to Python Programming", duration: "65 min", status: "completed", type: "coding", description: "Learn Python basics with fun projects" },
    { id: 3, title: "Robotics Fundamentals", duration: "70 min", status: "in-progress", type: "robotics", description: "Build and program your first robot" },
    { id: 4, title: "Creative Projects in AI", duration: "60 min", status: "locked", type: "ai", description: "Create chatbots and AI demos" },
    { id: 5, title: "STEM in Real Life", duration: "55 min", status: "locked", type: "project", description: "Apply STEM to real-world problems" },
    { id: 6, title: "Teamwork & Presentation Skills", duration: "45 min", status: "locked", type: "soft-skills", description: "Learn to work in teams and present ideas" }
  ],
  'robotics-lab': [
    { id: 1, title: "Advanced Robotics Assembly", duration: "55 min", status: "completed", type: "robotics", description: "Build complex robotic systems" },
    { id: 2, title: "Sensor Programming & Control", duration: "75 min", status: "completed", type: "coding", description: "Program sensors and control systems" },
    { id: 3, title: "Automation Projects", duration: "65 min", status: "in-progress", type: "project", description: "Create automated solutions" },
    { id: 4, title: "Real-world Applications", duration: "80 min", status: "locked", type: "application", description: "Apply robotics to real problems" },
    { id: 5, title: "Engineering Principles", duration: "70 min", status: "locked", type: "engineering", description: "Learn fundamental engineering concepts" },
    { id: 6, title: "Project-based Learning", duration: "90 min", status: "locked", type: "capstone", description: "Complete your robotics portfolio" }
  ],
  'python-programming': [
    { id: 1, title: "Programming & Cybersecurity (Python, JavaScript)", duration: "60 min", status: "completed", type: "coding", description: "Master programming and cybersecurity concepts" },
    { id: 2, title: "Applied Robotics & AI", duration: "50 min", status: "completed", type: "ai", description: "Apply AI to robotics projects" },
    { id: 3, title: "Entrepreneurship in Tech", duration: "70 min", status: "in-progress", type: "business", description: "Learn to turn ideas into businesses" },
    { id: 4, title: "Research & Problem Identification", duration: "65 min", status: "locked", type: "research", description: "Identify real-world problems to solve" },
    { id: 5, title: "Design Thinking & Prototyping", duration: "80 min", status: "locked", type: "design", description: "Design and prototype solutions" },
    { id: 6, title: "Capstone Project", duration: "120 min", status: "locked", type: "capstone", description: "Present your final innovation project" }
  ]
};

// Course information
const courseInfo = {
  'junior-makers': {
    name: "Junior Makers",
    description: "Creative coding and digital making for young innovators (Ages 6-9)",
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    theme: "Spark Curiosity & Creativity"
  },
  'cc-ai-lab': {
    name: "AI Literacy Lab",
    description: "Understanding and creating with artificial intelligence (Ages 10-13)",
    icon: "🤖",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    theme: "Build Skills & Confidence"
  },
  'robotics-lab': {
    name: "Robotics Lab",
    description: "Building and programming robots for the future (Ages 10-13)",
    icon: "⚙️",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    theme: "Build & Program Robots"
  },
  'python-programming': {
    name: "Python Programming",
    description: "Master the fundamentals of Python programming (Ages 14-17)",
    icon: "🚀",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    theme: "Innovate & Launch"
  }
};

// Memoized lesson item component
const LessonItem = memo(({ lesson, index }: { lesson: any; index: number }) => (
  <motion.div
    key={lesson.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 ${
      lesson.status === 'completed' ? 'border-green-500' :
      lesson.status === 'in-progress' ? 'border-blue-500' :
      'border-slate-300 dark:border-slate-600'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          lesson.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
          lesson.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/20' :
          'bg-slate-100 dark:bg-slate-700'
        }`}>
          {lesson.status === 'completed' ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : lesson.status === 'in-progress' ? (
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          ) : (
            <Lock className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{lesson.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{lesson.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 mr-1" />
              {lesson.duration}
            </span>
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <BookOpen className="w-3 h-3 mr-1" />
              {lesson.type}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {lesson.status === 'completed' && (
          <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
            Completed
          </span>
        )}
        {lesson.status === 'in-progress' && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
            In Progress
          </span>
        )}
        {lesson.status === 'locked' && (
          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>
    </div>
  </motion.div>
));

LessonItem.displayName = 'LessonItem';

// Memoized progress bar component
const ProgressBar = memo(({ progress, completedLessons, totalLessons }: { 
  progress: number; 
  completedLessons: number; 
  totalLessons: number; 
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Course Progress</h2>
      <span className="text-sm text-slate-500 dark:text-slate-400">{completedLessons}/{totalLessons} lessons</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
      {Math.round(progress)}% complete • {totalLessons - completedLessons} lessons remaining
    </p>
  </div>
));

ProgressBar.displayName = 'ProgressBar';

export function DashboardContent() {
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/enroll?userId=${(user as any).uid}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            setEnrollmentData(result.data);
            const courseId = result.data.courseId;
            setLessons(courseLessons[courseId as keyof typeof courseLessons] || []);
            setCourseDetails(courseInfo[courseId as keyof typeof courseInfo]);
          } else {
            console.log('No enrollment found for user');
            router.push('/courses');
          }
        } catch (error) {
          console.error('Error fetching enrollment:', error);
          router.push('/courses');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEnrollmentData();
  }, [user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!enrollmentData || !courseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Course Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">You don't have any active course enrollments.</p>
          <button 
            onClick={() => router.push('/courses')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.status === 'completed').length;
  const totalLessons = lessons.length;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${courseDetails.color} opacity-10`}></div>
          <div className="relative container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${courseDetails.color} rounded-2xl flex items-center justify-center text-white text-2xl`}>
                    {courseDetails.icon}
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Welcome, {enrollmentData.studentName}!
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      {courseDetails.name} • {courseDetails.theme}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {Math.round(progress)}% Complete • {completedLessons} of {totalLessons} lessons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-12">
          {/* Progress Section */}
          <div className="mb-8">
            <ProgressBar 
              progress={progress} 
              completedLessons={completedLessons} 
              totalLessons={totalLessons} 
            />
          </div>

          {/* Lessons Section */}
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Lessons</h2>
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <LessonItem key={lesson.id} lesson={lesson} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
