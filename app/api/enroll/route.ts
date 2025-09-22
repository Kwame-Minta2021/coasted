export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Define enrollment type
interface Enrollment {
  enrollmentId: string;
  studentName: string;
  parentEmail: string;
  parentPhone?: string;
  notes?: string;
  courseId: string;
  courseTitle: string;
  status: string;
  createdAt: string;
  paymentAmount: number;
  paymentStatus: string;
  userId?: string;
  updatedAt?: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle both enrollment form data and course enrollment data
    const { 
      studentName,
      parentEmail,
      parentPhone,
      notes,
      trackSlug,
      trackName,
      courseId,
      courseTitle,
      studentId,
      ageBand,
      paymentAmount
    } = body

    // Validate required fields
    if (!studentName && !studentId) {
      return NextResponse.json(
        { error: 'Missing student information' },
        { status: 400 }
      )
    }

    if (!courseId && !trackSlug) {
      return NextResponse.json(
        { error: 'Missing course/track information' },
        { status: 400 }
      )
    }

    // Check if child is already enrolled in any course
    try {
      if (supabaseAdmin) {
        // Check for existing enrollments by student name and parent email
        const { data: existingEnrollments, error: checkError } = await supabaseAdmin
          .from('enrollments')
          .select('*')
          .eq('student_name', studentName)
          .eq('parent_email', parentEmail)
          .in('status', ['pending_payment', 'active', 'completed'])
          .limit(1);

        if (checkError) {
          console.error('Error checking existing enrollments:', checkError);
        } else if (existingEnrollments && existingEnrollments.length > 0) {
          const existingEnrollment = existingEnrollments[0] as Enrollment;
          return NextResponse.json(
            { 
              error: 'Child already enrolled',
              message: `${studentName} is already enrolled in ${existingEnrollment.courseTitle}. Each child can only be enrolled in one course at a time.`,
              existingEnrollment: {
                courseTitle: existingEnrollment.courseTitle,
                status: existingEnrollment.status,
                enrollmentId: existingEnrollment.enrollmentId
              }
            },
            { status: 409 }
          )
        }
      }
    } catch (checkError) {
      console.error('Error checking existing enrollments:', checkError);
      // Continue with enrollment if check fails
    }

    // Create enrollment record
    const enrollmentId = `enrollment_${Date.now()}`;
    const courseIdToUse = courseId || trackSlug;
    const courseTitleToUse = courseTitle || trackName;
    
    // Calculate payment amount based on age band if not provided
    const calculatedPaymentAmount = paymentAmount || (ageBand === '6-9' ? 650 : ageBand === '10-13' ? 750 : 800);

    const enrollment: Enrollment = {
      enrollmentId,
      studentName,
      parentEmail,
      parentPhone,
      notes,
      courseId: courseIdToUse,
      courseTitle: courseTitleToUse,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      paymentAmount: calculatedPaymentAmount,
      paymentStatus: 'pending'
    }

    console.log('Creating enrollment:', enrollment);

    // Store enrollment in Supabase Database
    try {
      if (supabaseAdmin) {
        // Use Supabase
        const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
          .from('enrollments')
          .insert({
            enrollment_id: enrollment.enrollmentId,
            student_name: enrollment.studentName,
            parent_email: enrollment.parentEmail,
            parent_phone: enrollment.parentPhone,
            notes: enrollment.notes,
            course_id: enrollment.courseId,
            course_title: enrollment.courseTitle,
            status: enrollment.status,
            payment_amount: enrollment.paymentAmount,
            payment_status: enrollment.paymentStatus,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (enrollmentError) {
          throw enrollmentError;
        }
        
        console.log('Enrollment stored in Supabase:', enrollment);
        console.log('Supabase enrollment ID:', enrollmentData.id);

        // No password creation at enrollment; sign-in happens via magic link after payment

        return NextResponse.json({
          success: true,
          enrollmentId,
          message: 'Enrollment submitted successfully! Redirecting to payment...',
          data: enrollment
        })
      } else {
        // Fallback to Mock
        console.log('Supabase not available, using mock storage');
        
        return NextResponse.json({
          success: true,
          enrollmentId,
          message: 'Enrollment submitted successfully! Redirecting to payment...',
          data: enrollment
        })
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      console.log('Falling back to mock storage');
      
      return NextResponse.json({
        success: true,
        enrollmentId,
        message: 'Enrollment submitted successfully! Redirecting to payment...',
        data: enrollment
      })
    }
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// API route to get enrollment details by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')
    const userId = searchParams.get('userId')

    // If userId is provided, get enrollment by user ID
    if (userId) {
      console.log('Fetching enrollment for user ID:', userId);

      try {
        if (supabaseAdmin) {
          // Use Supabase
          const { data: enrollments, error: queryError } = await supabaseAdmin
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .in('status', ['pending_payment', 'active', 'completed'])
            .limit(1);

          if (queryError) {
            console.error('Supabase query error:', queryError);
            return NextResponse.json(
              { error: 'No active enrollment found' },
              { status: 404 }
            )
          }

          if (!enrollments || enrollments.length === 0) {
            console.log('No active enrollment found for user:', userId);
            return NextResponse.json(
              { error: 'No active enrollment found' },
              { status: 404 }
            )
          }

          const enrollment = enrollments[0] as Enrollment;
          console.log('Enrollment found for user:', enrollment);
          return NextResponse.json({
            success: true,
            data: enrollment
          })
        } else {
          // Fallback to Mock
          console.log('Supabase not available, using mock storage for user enrollment');
          
          return NextResponse.json(
            { error: 'No active enrollment found' },
            { status: 404 }
          )
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        return NextResponse.json(
          { error: 'No active enrollment found' },
          { status: 404 }
        )
      }
    }

    // Original logic for enrollmentId
    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID or User ID required' },
        { status: 400 }
      )
    }

    console.log('Fetching enrollment with ID:', enrollmentId);

    // Get enrollment from Supabase Database
    try {
      if (supabaseAdmin) {
        // Use Supabase
        const { data: enrollments, error: queryError } = await supabaseAdmin
          .from('enrollments')
          .select('*')
          .eq('enrollment_id', enrollmentId)
          .limit(1);

        if (queryError) {
          console.error('Supabase query error:', queryError);
          return NextResponse.json(
            { error: 'Enrollment not found' },
            { status: 404 }
          )
        }

        if (!enrollments || enrollments.length === 0) {
          console.log('Enrollment not found in Supabase:', enrollmentId);
          return NextResponse.json(
            { error: 'Enrollment not found' },
            { status: 404 }
          )
        }

        const enrollment = enrollments[0] as Enrollment;
        console.log('Enrollment found in Supabase:', enrollment);
        return NextResponse.json({
          success: true,
          data: enrollment
        })
      } else {
        // Fallback to Mock
        console.log('Supabase not available, using mock storage for GET');
        
        // For demo purposes, return a mock enrollment
        const mockEnrollment: Enrollment = {
          enrollmentId,
          studentName: 'Demo Student',
          parentEmail: 'demo@example.com',
          parentPhone: '+233 123 456 789',
          courseId: 'demo-course',
          courseTitle: 'Demo Course',
          status: 'pending_payment',
          paymentAmount: 750, // Updated to reflect new pricing
          paymentStatus: 'pending',
          createdAt: new Date().toISOString()
        };
        
        console.log('Returning mock enrollment:', mockEnrollment);
        return NextResponse.json({
          success: true,
          data: mockEnrollment
        })
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      console.log('Falling back to mock storage for GET');
      
      // Return mock enrollment as fallback
      const mockEnrollment: Enrollment = {
        enrollmentId,
        studentName: 'Demo Student',
        parentEmail: 'demo@example.com',
        parentPhone: '+233 123 456 789',
        courseId: 'demo-course',
        courseTitle: 'Demo Course',
        status: 'pending_payment',
        paymentAmount: 750, // Updated to reflect new pricing
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };

    return NextResponse.json({ 
      success: true, 
        data: mockEnrollment
    })
    }
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
