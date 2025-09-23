'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Section from '@/components/Section';
import { PaystackConfig, PaystackResponse } from '@/types/paystack';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_b3d51d00d4f05527cc380d0c09de96e9e5ead8a1';

function PaymentContent() {
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'error'>('loading');
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate the correct amount based on age band
  const getAmountByAgeBand = (ageBand: string): number => {
    switch (ageBand) {
      case '6-9': return 650;
      case '10-13': return 750;
      case '14-17': return 800;
      default: return 800;
    }
  };

  const getCorrectAmount = () => {
    return enrollmentData?.paymentAmount || getAmountByAgeBand(enrollmentData?.ageBand || '14-17');
  };

  useEffect(() => {
    const enrollmentId = searchParams.get('enrollmentId');
    
    if (!enrollmentId) {
      setStatus('error');
      return;
    }

    // Load Paystack script
    const loadPaystackScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (window.PaystackPop) {
          setPaystackLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Paystack script loaded successfully');
          setPaystackLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          console.error('Failed to load Paystack script');
          reject(new Error('Failed to load Paystack script'));
        };

        document.head.appendChild(script);
      });
    };

    // Fetch enrollment data and load Paystack
    const fetchEnrollment = async () => {
      try {
        const response = await fetch(`/api/enroll?enrollmentId=${enrollmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch enrollment data');
        }
        
        const data = await response.json();
        setEnrollmentData(data);
        
        // Load Paystack script after enrollment data is fetched
        await loadPaystackScript();
        
        setStatus('loading');
      } catch (error) {
        console.error('Error fetching enrollment:', error);
        setStatus('error');
      }
    };

    fetchEnrollment();

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [searchParams]);

  const handlePayment = async () => {
    console.log('Payment button clicked');
    console.log('Enrollment data:', enrollmentData);
    console.log('Paystack loaded:', !!window.PaystackPop);
    console.log('Paystack key:', PAYSTACK_PUBLIC_KEY);

    if (!enrollmentData) {
      console.error('Enrollment data missing');
      setStatus('error');
      return;
    }

    if (!window.PaystackPop) {
      console.error('Paystack not loaded');
      setStatus('error');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('your_')) {
      console.error('Invalid Paystack public key');
      setStatus('error');
      return;
    }

    setStatus('processing');

    try {
      // Initialize Paystack payment
      const config: PaystackConfig = {
        key: PAYSTACK_PUBLIC_KEY,
        email: enrollmentData.parentEmail || enrollmentData.data?.parentEmail,
        amount: getCorrectAmount() * 100, // Convert to kobo (smallest currency unit)
        currency: 'GHS',
        ref: enrollmentData.enrollmentId || enrollmentData.data?.enrollmentId,
        callback: function(response: PaystackResponse) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Update enrollment status to active
          fetch('/api/enroll/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              enrollmentId: enrollmentData.enrollmentId || enrollmentData.data?.enrollmentId,
              status: 'active',
              paymentReference: response.reference,
              paymentStatus: 'completed'
            })
          })
          .then(updateResponse => {
            if (updateResponse.ok) {
              setStatus('success');
              
              // Redirect to dashboard after successful payment
              setTimeout(() => {
                const params = new URLSearchParams({
                  enrollmentId: enrollmentData?.enrollmentId || enrollmentData?.data?.enrollmentId || '',
                  studentName: enrollmentData?.studentName || enrollmentData?.data?.studentName || '',
                  courseTitle: enrollmentData?.courseTitle || enrollmentData?.data?.courseTitle || '',
                  courseId: enrollmentData?.courseId || enrollmentData?.data?.courseId || '',
                  parentEmail: enrollmentData?.parentEmail || enrollmentData?.data?.parentEmail || '',
                  paymentComplete: 'true',
                  newEnrollment: 'true'
                });
                router.push(`/dashboard?${params.toString()}`);
              }, 2000);
            } else {
              throw new Error('Failed to update enrollment status');
            }
          })
          .catch(error => {
            console.error('Error updating enrollment status:', error);
            setStatus('error');
          });
        },
        onClose: function() {
          // Payment cancelled
          console.log('Payment cancelled');
          setStatus('loading');
        }
      };

      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('error');
    }
  };

  if (status === 'loading' && !enrollmentData) {
    return (
      <main className="min-h-screen">
        <Section>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading payment details...</p>
          </div>
        </Section>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen">
        <Section>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Payment Error</h1>
            <p className="text-muted-foreground mb-4">Unable to load enrollment details or process payment.</p>
            <button onClick={() => router.push('/enroll')} className="cc-btn-primary">
              Return to Enrollment
            </button>
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="cc-card p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Complete Payment</h1>
            
            <div className="mb-8 p-6 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Enrollment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <span className="font-medium">{enrollmentData?.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parent Email:</span>
                  <span className="font-medium">{enrollmentData?.parentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-medium">{enrollmentData?.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrollment ID:</span>
                  <span className="font-mono text-sm">{enrollmentData?.enrollmentId}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">GHS {getCorrectAmount()}</span>
                  </div>
                </div>
              </div>
            </div>

            {status === 'processing' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Processing payment...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-4">Redirecting to dashboard...</p>
              </div>
            )}
            
            {status !== 'processing' && status !== 'success' && (
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={!paystackLoaded}
                  className="w-full cc-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!paystackLoaded ? 'Loading Payment Gateway...' : 'Pay Now'}
                </button>
                
                <button
                  onClick={() => router.push('/enroll')}
                  className="w-full cc-btn-secondary"
                >
                  Cancel Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
