'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/auth';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  Lock,
  Search,
  Filter,
  Brain,
  Cpu,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  category: string;
  totalDuration: string;
  rating: number;
  totalTopics: number;
  completedTopics: number;
  progress: number;
  isEnrolled: boolean;
  isCompleted: boolean;
}

export default function ModulesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [instructorModules, setInstructorModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentAgeGroup, setStudentAgeGroup] = useState<string>('');

  // Fetch instructor-created modules and student age group
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch modules filtered by student's age group
        const response = await fetch(`/api/student/modules?student_email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        
        if (data.success) {
          setInstructorModules(data.modules || []);
          // Extract age group from the first module if available
          if (data.modules && data.modules.length > 0) {
            setStudentAgeGroup(data.modules[0].age_group || '');
          }
        } else {
          setError('Failed to fetch instructor modules');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.email]);

  // Modules will be populated from database when student enrolls
  const modules: Module[] = [];

  // Combine hardcoded modules with instructor modules
  const allModules = [
    ...modules,
    ...instructorModules.map(instructorModule => ({
      id: instructorModule.id,
      title: instructorModule.title,
      description: instructorModule.description,
      instructor: instructorModule.courses?.instructor || 'Instructor',
      level: instructorModule.age_group || 'All Ages',
      category: instructorModule.courses?.category || 'Programming',
      totalDuration: `${instructorModule.estimated_duration || 60} minutes`,
      rating: 4.5,
      totalTopics: instructorModule.course_lessons?.length || 0,
      completedTopics: 0,
      progress: 0,
      isEnrolled: false,
      isCompleted: false,
      lessons: instructorModule.course_lessons || []
    }))
  ];

  const filteredModules = allModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || module.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = ['all', ...Array.from(new Set(allModules.map(m => m.category)))];
  const levels = ['all', ...Array.from(new Set(allModules.map(m => m.level)))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning': return <Brain className="h-5 w-5" />;
      case 'Robotics': return <Cpu className="h-5 w-5" />;
      case 'Problem Solving': return <Lightbulb className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Modules</h1>
             <p className="text-gray-600 dark:text-gray-400 mt-2">
               Explore and enroll in courses to start your learning journey
             </p>
             {studentAgeGroup && (
               <div className="mt-2 flex items-center gap-2">
                 <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                   Age Group: {studentAgeGroup}
                 </span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">
                   (Showing modules for your age group)
                 </span>
               </div>
             )}
             {instructorModules.length > 0 && (
               <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                 {instructorModules.length} instructor-created modules available for your age group
               </p>
             )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <div key={module.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(module.category)}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {module.category}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(module.level)}`}>
                    {module.level}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {module.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{module.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{module.totalDuration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{module.totalTopics} topics</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{module.rating}</span>
                    </div>
                  </div>
                  
                  {module.isEnrolled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-gray-900 dark:text-white font-medium">{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {module.completedTopics} of {module.totalTopics} topics completed
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {module.isEnrolled ? (
                    <Link
                      href={`/student/portal/${module.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Play className="h-4 w-4" />
                      Continue Learning
                    </Link>
                  ) : (
                    <Link
                      href={`/enroll?course=${module.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <BookOpen className="h-4 w-4" />
                      Enroll Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No modules found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
  );
}

