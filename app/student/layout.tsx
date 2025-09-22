'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Gamepad2, 
  Settings, 
  Shield,
  Home,
  FileText,
  Folder,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

const sidebarItems = [
  { href: '/student', label: 'Overview', icon: Home },
  { href: '/student/modules', label: 'Course Modules', icon: BookOpen },
  { href: '/student/projects', label: 'Projects', icon: Folder },
  { href: '/student/assignments', label: 'Assignments', icon: FileText },
  { href: '/student/messages', label: 'Messages', icon: MessageSquare },
  { href: '/student/games', label: 'Games', icon: Gamepad2 },
  { href: '/student/guidance', label: 'Guidance', icon: Shield },
  { href: '/student/account', label: 'Account', icon: Settings },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { user, signOut, authInitialized } = useAuth();
  const [studentName, setStudentName] = useState<string>('Student');

  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch student name from enrollment data
  useEffect(() => {
    const fetchStudentName = async () => {
      if (!user?.email) {
        setStudentName('Student');
        return;
      }

      try {
        const { data: enrollment, error } = await supabase
          .from('enrollments')
          .select('child_name')
          .eq('email', user.email)
          .single();

        if (enrollment && !error) {
          setStudentName(enrollment.child_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
        } else {
          setStudentName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
        }
      } catch (err) {
        console.error('Error fetching student name:', err);
        setStudentName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
      }
    };

    fetchStudentName();
  }, [user?.email, user?.user_metadata?.full_name])

  // Redirect to login if not authenticated (client-side only)
  useEffect(() => {
    if (isClient && authInitialized && !user && !isLoggingOut) {
      router.push('/login')
    }
  }, [isClient, authInitialized, user, isLoggingOut, router])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Define handleSignOut function
  const handleSignOut = async () => {
    try {
      // Ensure we're on the client side
      if (typeof window === 'undefined') return;
      
      // Set logging out flag to prevent automatic redirect
      setIsLoggingOut(true);
      
      // Use Supabase Auth logout
      if (signOut) {
        const result = await signOut();
        
        // Handle sign out result
        if (result.error) {
          console.error('Sign out error:', result.error);
          // Even if there's an error, we should still redirect to home page
        }
      }
      
      // Always redirect to home page, regardless of sign out result
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to home page
      router.push('/');
    }
  }

  // Show loading while checking authentication or during hydration
  if (!isClient || !authInitialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Student Portal Layout with Sidebar */}
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl transition-all duration-300 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`border-b border-white/20 dark:border-slate-700/20 ${isSidebarCollapsed ? 'p-3' : 'p-4 lg:p-6'}`}>
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="min-w-0">
                      <h1 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base truncate">Student Portal</h1>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">Learning Dashboard</p>
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                )}
              </div>
              {isSidebarCollapsed && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Expand sidebar"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Student Info */}
            {user && (
              <div className={`border-b border-white/20 dark:border-slate-700/20 ${isSidebarCollapsed ? 'p-3' : 'p-4 lg:p-6'}`}>
                {!isSidebarCollapsed ? (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Welcome back</div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{studentName}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {studentName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <nav className={`flex-1 space-y-2 overflow-y-auto ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-xl font-medium transition-all duration-200 group ${
                      isSidebarCollapsed 
                        ? 'justify-center px-2 py-3' 
                        : 'gap-3 px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'
                    }`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className={`border-t border-white/20 dark:border-slate-700/20 ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
              <button
                onClick={handleSignOut}
                className={`flex items-center w-full rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group ${
                  isSidebarCollapsed 
                    ? 'justify-center px-2 py-3' 
                    : 'gap-3 px-4 py-3'
                }`}
                title={isSidebarCollapsed ? "Sign Out" : undefined}
              >
                <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-600 dark:group-hover:text-red-400" />
                {!isSidebarCollapsed && (
                  <span className="truncate">Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl w-72 sm:w-80 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-white/20 dark:border-slate-700/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base truncate">Student Portal</h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">Learning Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Close menu"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Student Info */}
            {user && (
              <div className="p-4 lg:p-6 border-b border-white/20 dark:border-slate-700/20">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Welcome back</div>
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{studentName}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20 dark:border-slate-700/20">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="truncate">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>

          {/* Mobile Header */}
          <div className="lg:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 p-3 sm:p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Student Portal</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Open menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
