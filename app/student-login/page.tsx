'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified login page
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Redirecting to login...</p>
      </div>
    </div>
  );
}
