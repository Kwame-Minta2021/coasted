'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

interface StudentData {
  childName: string;
  parentName: string;
  ageBand: string;
  courseEnrolled: string;
}

export function useStudentName() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: enrollment, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('child_name, parent_name, age_band, course_enrolled')
          .eq('email', user.email)
          .single();

        if (enrollmentError) {
          console.error('Error fetching enrollment data:', enrollmentError);
          setError('Failed to fetch student data');
          setStudentData(null);
        } else if (enrollment) {
          setStudentData({
            childName: enrollment.child_name || '',
            parentName: enrollment.parent_name || '',
            ageBand: enrollment.age_band || '',
            courseEnrolled: enrollment.course_enrolled || ''
          });
        } else {
          setStudentData(null);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setStudentData(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a user email
    if (user?.email) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  // Return the child's name, falling back to user display name or email if not available
  const studentName = studentData?.childName || user?.displayName || user?.email?.split('@')[0] || 'Student';

  return {
    studentName,
    studentData,
    loading,
    error
  };
}
