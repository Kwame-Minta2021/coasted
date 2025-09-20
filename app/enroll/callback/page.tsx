'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  Shield, 
  Gift,
  Users,
  Award,
  Clock,
  Mail,
  Package,
  Calendar,
  BookOpen,
  Headphones,
  Star
} from 'lucide-react';
import Link from 'next/link';

function CallbackContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  useEffect(() => {
    const reference = sp.get('reference');
    const trxref = sp.get('trxref');
    
    if (!reference && !trxref) {
      setStatus('error');
      setMessage('No payment reference found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: reference || trxref })
        });
        
        const data = await res.json();
        
        if (data.success) {
          setStatus('success');
          setEnrollmentData(data.enrollment);
          setMessage('Payment verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [sp]);

  const getAgeBandTitle = (ageBand: string) => {
    switch (ageBand) {
      case '6-9': return 'Ages 6–9 · Spark Curiosity & Creativity';
      case '10-13': return 'Ages 10–13 · Build Skills & Confidence';
      case '14-17': return 'Ages 14–17 · Innovate & Launch';
      default: return 'Selected Course';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verifying Payment</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100 dark:from-slate-900 dark:via-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Payment Failed</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              href="/courses"
              className="block w-full bg-slate-900 dark:bg-slate-700 text-white py-3 px-6 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="block w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900/20 dark:to-emerald-900/20">
      {/* Success Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Welcome to Coasted Code! 🎉
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Your enrollment is complete and payment has been confirmed
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Payment Successful
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Enrollment Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enrollment Confirmation Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-700/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Enrollment Confirmed</h2>
                    <p className="text-slate-600 dark:text-slate-400">Your student account is ready</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Student Name</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{enrollmentData?.childName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Course</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{getAgeBandTitle(enrollmentData?.ageBand)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Login Email</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{enrollmentData?.parentEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Payment Amount</p>
                        <p className="font-bold text-green-600 dark:text-green-400 text-lg">₵800</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* Right Column - Course Access & Benefits */}
            <div className="space-y-8">
              {/* Course Access Card */}
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Course Access</h3>
                    <p className="text-purple-100">Unlimited learning resources</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">
                    {getAgeBandTitle(enrollmentData?.ageBand)}
                  </h4>
                  <p className="text-purple-100 text-sm mb-4">
                    Access to all lessons, projects, and resources for this age group
                  </p>
                </div>
                
                {enrollmentData?.userCreated ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">Your Login Credentials:</h5>
                      <div className="space-y-2 text-sm">
                        <div><strong>Email:</strong> {enrollmentData.email}</div>
                        <div><strong>Password:</strong> {enrollmentData.defaultPassword}</div>
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-medium w-full justify-center"
                    >
                      <span>Login to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-medium w-full justify-center"
                  >
                    <span>Login to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* What's Included */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-700/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">What's Included</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">Robotics Starter Kit</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Complete kit with all necessary components</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">Weekly Online Meetups</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Interactive sessions with instructors & peers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">Unlimited Course Access</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">24/7 access to all lessons and resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">30-Day Trial</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">No monthly charge for first 30 days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Need Help?</h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                    Our support team is here to help you get started
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/contact"
                      className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Contact Support
                    </Link>
                    <Link
                      href="/courses"
                      className="block w-full border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm"
                    >
                      View All Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Processing payment...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
