import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId, status, paymentReference, paymentStatus } = body

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { error: 'Enrollment ID and status are required' },
        { status: 400 }
      )
    }

    console.log('Updating enrollment status:', { enrollmentId, status, paymentReference, paymentStatus })

    // Update enrollment in Supabase Database
    try {
      const { data: enrollments, error: queryError } = await supabaseAdmin
        .from('enrollments')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .limit(1);

      if (queryError) {
        console.error('Supabase query error:', queryError);
        return NextResponse.json(
          { error: 'Failed to update enrollment status' },
          { status: 500 }
        )
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('Enrollment not found:', enrollmentId)
        return NextResponse.json(
          { error: 'Enrollment not found' },
          { status: 404 }
        )
      }

      const { error: updateError } = await supabaseAdmin
        .from('enrollments')
        .update({
          status: status,
          payment_status: paymentStatus || 'completed',
          payment_reference: paymentReference,
          updated_at: new Date().toISOString()
        })
        .eq('enrollment_id', enrollmentId);

      if (updateError) {
        throw updateError;
      }

      console.log('Enrollment status updated successfully in Supabase')
      return NextResponse.json({
        success: true,
        message: 'Enrollment status updated successfully'
      })
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError)
      return NextResponse.json(
        { error: 'Failed to update enrollment status' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating enrollment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
