'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [pathname, setPathname] = useState('')
  
  // Ensure consistent href for student login - always use /student-login to avoid hydration mismatch
  // This must be consistent between server and client to prevent hydration errors
  // Never change this based on pathname or user state to prevent hydration mismatches
  const studentLoginHref = '/student-login'

  useEffect(() => {
    setIsClient(true)
    // Set pathname only on client side to prevent hydration mismatch
    const currentPath = window.location.pathname
    setPathname(currentPath)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 bg-white/60 cc-glass dark:bg-slate-900/60 rounded-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          aria-label="Coasted Code Home" 
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105 flex-shrink-0"
          onClick={closeMobileMenu}
        >
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                isActive('/courses')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Courses
            </Link>
            <Link 
              href="/schools" 
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                isActive('/schools')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              For Schools
            </Link>
            <Link 
              href="/team" 
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                isActive('/team')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Team
            </Link>
            <Link 
              href="/contact" 
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                isActive('/contact')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              key="student-login-desktop"
              href={studentLoginHref} 
              className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 text-foreground hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
            >
              Student Login
            </Link>
            <Link 
              href="/courses" 
              className="cc-btn-primary cc-cta-ring whitespace-nowrap"
            >
              Browse Courses
            </Link>
          </div>
          
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isClient && isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isClient && isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl mt-4 border border-slate-200/50 dark:border-slate-700/50">
            <Link 
              href="/" 
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive('/courses')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobileMenu}
            >
              Courses
            </Link>
            <Link 
              href="/schools" 
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive('/schools')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobileMenu}
            >
              For Schools
            </Link>
            <Link 
              href="/team" 
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive('/team')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobileMenu}
            >
              Team
            </Link>
            <Link 
              href="/contact" 
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive('/contact')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800'
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            
            {/* Mobile Actions */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <Link 
                key="student-login-mobile"
                href={studentLoginHref} 
                className="block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Student Login
              </Link>
              <Link 
                href="/courses" 
                className="block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={closeMobileMenu}
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
