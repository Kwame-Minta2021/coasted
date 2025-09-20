'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, loading, authInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Wait for auth to be initialized
    if (!authInitialized || loading) return;

    // Prevent multiple redirects
    if (hasRedirected) return;

    // If auth is required and no user, redirect to login
    if (requireAuth && !user) {
      console.log(`AuthGuard: No user, redirecting to ${redirectTo}`);
      setHasRedirected(true);
      setIsRedirecting(true);
      router.push(redirectTo);
      return;
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (user && pathname === '/login') {
      console.log('AuthGuard: User authenticated, redirecting to dashboard');
      setHasRedirected(true);
      setIsRedirecting(true);
      router.push('/dashboard');
      return;
    }

    // If no auth required and user is authenticated, redirect to dashboard
    if (!requireAuth && user) {
      console.log('AuthGuard: User authenticated, redirecting to dashboard');
      setHasRedirected(true);
      setIsRedirecting(true);
      router.push('/dashboard');
      return;
    }
  }, [user, loading, authInitialized, requireAuth, redirectTo, router, pathname, hasRedirected]);

  // Show loading while auth is initializing or redirecting
  if (loading || !authInitialized || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isRedirecting ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // If auth is required and no user, show loading (will redirect)
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If no auth required and user exists, show loading (will redirect)
  if (!requireAuth && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
