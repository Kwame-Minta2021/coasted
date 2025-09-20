import { Metadata } from 'next'
import { COURSES } from '../(data)/courses';
import Link from 'next/link';
import { CheckCircle, Star, Users, Clock, Award, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Courses & Enrollment - Coasted Code',
  description: 'Choose your learning track: Ages 6-17. One-time enrollment ₵800 + ₵299/month. Pay securely via Mobile Money or Bank.',
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Choose Your Learning Journey
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Age-appropriate courses designed to spark curiosity, build confidence, and develop real-world skills
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Robotics Kit Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Weekly Meetups</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Certification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 text-lg">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold">Special Launch Offer:</span>
            <span>₵800 enrollment + ₵299/month after 30-day trial</span>
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {COURSES.map((course, index) => (
            <div
              key={course.id}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-visible transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''
              }`}
            >


              {/* Course Header */}
              <div className="p-8 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold ${
                    index === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                    index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                    'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}>
                    {index === 0 ? '🎨' : index === 1 ? '🤖' : '🚀'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {course.title.split('·')[0]}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {course.title.split('·')[1]}
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-300">Enrollment Fee:</span>
                    <span className="text-2xl font-bold text-green-600">₵{course.oneTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Monthly Fee:</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">₵{course.monthly}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    *30-day trial period included
                  </div>
                </div>

                {/* Course Content */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    What You'll Learn
                  </h3>
                  <div className="space-y-2">
                    {course.content.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                    {course.content.length > 4 && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        +{course.content.length - 4} more topics
                      </div>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    What's Included
                  </h3>
                  <div className="space-y-2">
                    {course.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="p-8 pt-0">
                <Link
                  href={`/enroll?age=${course.id}`}
                  className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    index === 1 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {index === 1 ? 'Start Learning Now' : 'Enroll Today'}
                </Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                  Secure payment via Mobile Money, Bank Transfer, or Card
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Start Your Child's Tech Journey?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Join hundreds of parents who have already enrolled their children in our innovative coding and robotics program.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>500+ Students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
