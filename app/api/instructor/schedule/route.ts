import { NextRequest, NextResponse } from 'next/server'
import { verifyInstructorToken } from '@/lib/instructor-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { loadEvents, addEvent, getEventsByInstructor, ScheduleEvent } from '@/lib/schedule-storage'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    console.log('Schedule API: Verifying instructor token...')
    const instructor = await verifyInstructorToken(request)
    console.log('Schedule API: Instructor verification result:', instructor ? 'Success' : 'Failed')
    
    if (!instructor) {
      console.log('Schedule API: No valid instructor token found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get events for this instructor from persistent storage
    const instructorEvents = getEventsByInstructor(instructor.instructorId)

    console.log(`Loaded ${instructorEvents.length} events for instructor ${instructor.instructorId}`)

    return NextResponse.json({ success: true, schedule: instructorEvents })

  } catch (error) {
    console.error('Schedule fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scheduleData = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      event_type,
      age_group,
      max_students,
      meeting_link,
      is_recurring,
      recurrence_pattern
    } = scheduleData

    // Create the event and save it to persistent storage
    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      instructor_id: instructor.instructorId,
      title,
      description,
      start_time,
      end_time,
      event_type,
      age_group,
      max_students,
      meeting_link,
      is_recurring,
      recurrence_pattern,
      status: 'scheduled',
      created_at: new Date().toISOString()
    }

    // Add the new event to persistent storage
    addEvent(newEvent)

    console.log('Event created and saved to persistent storage:', newEvent)
    
    // Get updated count
    const allEvents = loadEvents()
    console.log('Total events now:', allEvents.length)

    return NextResponse.json({ success: true, event: newEvent })

  } catch (error) {
    console.error('Schedule creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
