'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLoginRedirect() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect once using useRef to track
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      
      // Use setTimeout to ensure this happens after render
      const timeoutId = setTimeout(() => {
        router.replace('/login');
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
