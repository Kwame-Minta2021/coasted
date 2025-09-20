import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { loadEvents, ScheduleEvent } from '@/lib/schedule-storage'

export const runtime = 'nodejs'

// GET - Fetch scheduled programs for students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentEmail = searchParams.get('student_email')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Get student's age group from enrollment data
    let studentAgeGroup = null
    if (studentEmail) {
      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .select('age_band')
        .eq('email', studentEmail)
        .single()

      if (enrollment && !enrollmentError) {
        studentAgeGroup = enrollment.age_band
      }
    }

        // Get all scheduled events from file storage
        const allEvents = loadEvents()
    
    // Filter events
    let filteredEvents = allEvents.filter(event => {
      // Only show scheduled events
      if (event.status !== 'scheduled') return false
      
      // Only show future events
      if (new Date(event.start_time) < new Date()) return false
      
      // Filter by student's age group if available
      if (studentAgeGroup && event.age_group !== studentAgeGroup) return false
      
      // Filter by date range if specified
      if (startDate && new Date(event.start_time) < new Date(startDate)) return false
      if (endDate && new Date(event.start_time) > new Date(endDate)) return false
      
      return true
    })

    // Sort by start time
    filteredEvents.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    // Get instructor details for each event
    const formattedSchedule = await Promise.all(
      filteredEvents.map(async (event) => {
        let instructor = null
        if (event.instructor_id) {
          const { data: instructorData } = await supabaseAdmin
            .from('instructors')
            .select('id, name, bio, specialization')
            .eq('id', event.instructor_id)
            .single()
          
          if (instructorData) {
            instructor = {
              name: instructorData.name,
              bio: instructorData.bio,
              specialization: instructorData.specialization
            }
          }
        }

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.start_time,
          endTime: event.end_time,
          eventType: event.event_type,
          ageGroup: event.age_group,
          maxStudents: event.max_students,
          meetingLink: event.meeting_link,
          isRecurring: event.is_recurring,
          instructor
        }
      })
    )

    return NextResponse.json({ success: true, schedule: formattedSchedule })

  } catch (error) {
    console.error('Schedule fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
