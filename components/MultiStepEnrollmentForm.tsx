'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Shield, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { initializePayment } from '@/app/enroll/actions';

interface FormData {
  parentName: string;
  parentEmail: string;
  phone: string;
  childName: string;
  ageBand: string;
}

const steps = [
  { id: 1, title: 'Parent Information', icon: User },
  { id: 2, title: 'Child Information', icon: GraduationCap },
  { id: 3, title: 'Review & Payment', icon: CreditCard },
];

const ageBands = [
  { value: '6-9', label: 'Ages 6–9 · Spark Curiosity & Creativity' },
  { value: '10-13', label: 'Ages 10–13 · Build Skills & Confidence' },
  { value: '14-17', label: 'Ages 14–17 · Innovate & Launch' },
];

export default function MultiStepEnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    parentName: '',
    parentEmail: '',
    phone: '',
    childName: '',
    ageBand: '6-9'
  });

  const updateForm = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!form.parentName || !form.parentEmail || !form.phone) {
          setError('Please fill in all parent information fields.');
          return false;
        }
        if (!form.parentEmail.includes('@')) {
          setError('Please enter a valid email address.');
          return false;
        }
        break;
      case 2:
        if (!form.childName || !form.ageBand) {
          setError('Please fill in all child information fields.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', form.parentEmail);
      formData.append('phone', form.phone);
      formData.append('ageBand', form.ageBand);
      formData.append('parentName', form.parentName);
      formData.append('childName', form.childName);
      
      const result = await initializePayment(formData);
      
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error ?? 'Failed to start payment.');
      }
    } catch (error) {
      setError('Failed to start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Parent Information
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Let's start with your details
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Parent Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-300 text-sm sm:text-base"
                  placeholder="Enter parent's full name"
                  value={form.parentName}
                  onChange={(e) => updateForm('parentName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Parent Email *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-300"
                  placeholder="parent@example.com"
                  value={form.parentEmail}
                  onChange={(e) => updateForm('parentEmail', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mobile Money Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-300"
                  placeholder="0241234567"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your Mobile Money number for payment
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Child Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tell us about your child
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Child Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-300"
                  placeholder="Enter child's full name"
                  value={form.childName}
                  onChange={(e) => updateForm('childName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Age Group *
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={form.ageBand}
                  onChange={(e) => updateForm('ageBand', e.target.value)}
                >
                  {ageBands.map((band) => (
                    <option key={band.value} value={band.value}>
                      {band.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Review & Payment
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Review your information and complete payment
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Enrollment Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Parent Name:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Parent Email:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.parentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Child Name:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.childName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Age Group:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {ageBands.find(b => b.value === form.ageBand)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Enrollment Fee:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₵800</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Review & Payment
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Review your information and complete payment
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Enrollment Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Parent Name:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Parent Email:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.parentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Child Name:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{form.childName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Age Group:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {ageBands.find(b => b.value === form.ageBand)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Enrollment Fee:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₵800</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    Your payment will be processed securely via Paystack. You can pay using Mobile Money, Bank Transfer, or Card.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 sm:mt-2 font-medium text-center ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.id}</span>
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-sm font-bold">!</span>
            </div>
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-slate-700/20">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₵800 & Complete
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
