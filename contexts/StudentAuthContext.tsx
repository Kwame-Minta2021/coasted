'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/supabase/auth';

interface Student {
  email: string;
  name: string;
  isLoggedIn: boolean;
  uid: string;
}

interface StudentAuthContextType {
  student: Student | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, signIn, signOut } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);

  // Convert Firebase user to Student format
  useEffect(() => {
    if (user) {
      setStudent({
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Student',
        isLoggedIn: true,
        uid: user.uid
      });
    } else {
      setStudent(null);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      console.log('Student login successful:', email);
    } catch (error: any) {
      console.error('Student login error:', error);
      throw error; // Re-throw the error from the main auth context
    }
  };

  const logout = async () => {
    try {
      await signOut();
      console.log('Student logout successful');
    } catch (error) {
      console.error('Student logout error:', error);
      throw error; // Re-throw the error from the main auth context
    }
  };

  return (
    <StudentAuthContext.Provider value={{ student, login, logout, isLoading: loading }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
