import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    console.log('Testing payment verification for reference:', reference)

    // Check Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    console.log('Paystack secret key available:', !!paystackSecret)
    console.log('Paystack secret key prefix:', paystackSecret?.substring(0, 20) + '...')

    if (!paystackSecret) {
      return NextResponse.json(
        { success: false, error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json'
      }
    })

    if (!paystackResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to verify payment with Paystack' },
        { status: 400 }
      )
    }

    const paystackData = await paystackResponse.json()
    console.log('Paystack verification response:', paystackData)

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const { data: transactionData } = paystackData
    const { customer, metadata, amount, currency, paid_at, channel } = transactionData

    console.log('Transaction data:', {
      email: customer.email,
      metadata,
      amount,
      currency
    })

    // Check if enrollment already exists
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (existingEnrollment) {
      console.log('Enrollment already exists:', existingEnrollment.id)
    }

    // Check if user already exists in users table
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', customer.email)
      .single()

    if (existingUser) {
      console.log('User already exists in users table:', existingUser.id)
    }

    // Check if Supabase Auth user exists
    try {
      const { data: existingAuthUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserByEmail(customer.email)
      if (authUserError && authUserError.message.includes('User not found')) {
        console.log('No Supabase Auth user found for:', customer.email)
      } else if (authUserError) {
        console.error('Error checking Supabase Auth user:', authUserError)
      } else {
        console.log('Supabase Auth user exists:', existingAuthUser.user.id)
      }
    } catch (authError) {
      console.error('Error checking Supabase Auth user:', authError)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verification test completed',
      data: {
        paystackData: paystackData.data,
        existingEnrollment: !!existingEnrollment,
        existingUser: !!existingUser,
        customerEmail: customer.email
      }
    })

  } catch (error) {
    console.error('Payment verification test error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
