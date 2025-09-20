import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST() {
  try {
    // Test enrollment creation
    const testEnrollment = {
      email: 'test@example.com',
      child_name: 'Test Child',
      parent_name: 'Test Parent',
      parent_email: 'test@example.com',
      age_band: '10-13',
      course_enrolled: 'Coasted Code Course',
      payment_reference: `test_${Date.now()}`,
      amount: 500,
      currency: 'GHS',
      status: 'completed'
    }

    const { data: enrollment, error } = await supabaseAdmin
      .from('enrollments')
      .insert(testEnrollment)
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test enrollment',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test enrollment created successfully',
      enrollment
    })

  } catch (error) {
    console.error('Test enrollment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error.message
    }, { status: 500 })
  }
}
