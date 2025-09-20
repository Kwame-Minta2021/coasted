'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '@/contexts/StudentAuthContext';

interface StudentProtectedRouteProps {
  children: React.ReactNode;
}

export default function StudentProtectedRoute({ children }: StudentProtectedRouteProps) {
  const { student, isLoading } = useStudentAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !student) {
      router.push('/login');
    }
  }, [student, isLoading, router]);

  // Show loading only briefly if needed
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
