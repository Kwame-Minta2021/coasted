'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  Gift,
  Clock,
  Users,
  Award,
  CheckCircle,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import MultiStepEnrollmentForm from '@/components/MultiStepEnrollmentForm';

function EnrollContent() {
  const sp = useSearchParams();
  const defaultAge = sp.get('age') ?? '10-13';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/courses"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Courses</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Complete Enrollment</h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">Secure payment via Mobile Money, Bank Transfer, or Card</p>
            </div>
            <div className="w-16 sm:w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="w-full">
            {/* Multi-Step Form */}
            <MultiStepEnrollmentForm />
          </div>



          {/* What's Included */}
          <div className="mt-6 sm:mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-white/20 dark:border-slate-700/20">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              What's Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">Robotics Starter Kit</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Delivered within 5-7 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">Weekly Online Meetups</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Interactive sessions with peers</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">Course Access</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Unlimited access to all lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">30-Day Trial</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No monthly charge for first 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Trusted by Parents</h4>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>500+ Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading enrollment form...</div>}>
      <EnrollContent />
    </Suspense>
  );
}
