export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPaymentConfirmationEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Check if enrollment already exists
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        enrollment: {
          reference: existingEnrollment.payment_reference,
          status: existingEnrollment.status,
          email: existingEnrollment.email,
          amount: existingEnrollment.amount,
          currency: existingEnrollment.currency,
          ageBand: existingEnrollment.age_band,
          childName: existingEnrollment.child_name,
          parentName: existingEnrollment.parent_name,
          userCreated: true
        }
      })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const { data: transactionData } = paystackData
    const { customer, metadata, amount, currency, paid_at, channel } = transactionData

    // Create enrollment record
    const enrollmentData = {
      email: customer.email,
      child_name: metadata?.childName || metadata?.child_name,
      parent_name: metadata?.parentName || metadata?.parent_name,
      parent_email: customer.email,
      age_band: metadata?.ageBand || metadata?.age_band,
      course_enrolled: 'Coasted Code Course',
      payment_reference: reference,
      amount: Math.floor(amount / 100),
      currency: currency,
      status: 'completed',
      enrollment_date: new Date(paid_at).toISOString()
    }

    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert(enrollmentData)
      .select()
      .single()

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      return NextResponse.json(
        { success: false, error: 'Failed to create enrollment record' },
        { status: 500 }
      )
    }

    // Create user account
    let userCreated = false
    const defaultPassword = 'coastedcode2024'

    // First, check if Supabase Auth user exists
    let authUser = null
    try {
      // List users to find by email (since getUserByEmail might not be available)
      const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = usersList?.users?.find(user => user.email === customer.email)
      
      if (!existingUser) {
         // Create new Supabase Auth user
         const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
           email: customer.email,
           password: defaultPassword,
           user_metadata: {
             display_name: metadata?.childName || metadata?.child_name,
             age_band: metadata?.ageBand || metadata?.age_band
           },
           email_confirm: true // Set to true to skip email confirmation requirement
         })
         
         // If user creation was successful, also update to ensure email is confirmed
         if (newAuthUser && !createError) {
           await supabaseAdmin.auth.admin.updateUserById(newAuthUser.user.id, {
             email_confirm: true
           })
         }
        if (createError) {
          console.error('Error creating Supabase Auth user:', createError)
        } else {
          authUser = newAuthUser
          console.log('Supabase Auth user created:', authUser.user.id)
        }
      } else {
        authUser = { user: existingUser }
        console.log('Supabase Auth user already exists:', existingUser.id)
        
        // Update existing user to ensure correct password and email confirmation
        try {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: defaultPassword, // Set the correct password
            email_confirm: true // Ensure email is confirmed
          })
          console.log('Existing user password and email confirmation updated')
        } catch (updateError) {
          console.error('Failed to update existing user:', updateError)
        }
      }
    } catch (authError) {
      console.error('Error with Supabase Auth user creation:', authError)
    }

    // Create user record in users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', customer.email)
      .single()

    if (!existingUser) {
      // Generate a UUID for the user record if no auth user ID is available
      const userId = authUser?.user?.id || crypto.randomUUID()
      
      const userData = {
        id: userId, // Use auth user ID or generated UUID
        email: customer.email,
        display_name: metadata?.childName || metadata?.child_name,
        age_band: metadata?.ageBand || metadata?.age_band,
        role: 'student',
        enrollment_date: new Date(paid_at).toISOString(),
        course_enrolled: 'Coasted Code Course',
        payment_reference: reference,
        status: 'active'
      }

      const { data: newUser, error: userCreationError } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (!userCreationError && newUser) {
        userCreated = true
        console.log('User record created in users table:', newUser.id)
      } else {
        console.error('Error creating user record:', userCreationError)
      }
    } else {
      console.log('User record already exists in users table:', existingUser.id)
      userCreated = true
    }

    // Update enrollment with user ID if we have one
    if (authUser?.user?.id) {
      await supabaseAdmin
        .from('enrollments')
        .update({
          user_id: authUser.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollment.id)
      console.log('Enrollment linked to user ID:', authUser.user.id)
    }

    // Generate magic link for one-click login
    const redirectTo = `${process.env.SITE_URL}/auth/callback`
    let magicLink = ''
    try {
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customer.email,
        options: { redirectTo }
      })
      if (linkError) {
        console.error('Magic link generation failed:', linkError)
      } else {
        magicLink = linkData?.properties?.action_link || ''
      }
    } catch (e) {
      console.error('Magic link error:', e)
    }

    // Send consolidated receipt + login email
    try {
      await sendPaymentConfirmationEmail(
        customer.email,
        metadata?.parentName || metadata?.parent_name || 'Student',
        {
          reference,
          amount: Math.floor(amount / 100),
          currency,
          paidAt: paid_at,
          course: 'Coasted Code Course',
        },
        magicLink
      )
      console.log('Payment confirmation email sent successfully')
    } catch (mailErr) {
      console.error('Payment email send failed:', mailErr)
      console.warn('Continuing with payment verification despite email failure')
    }

    return NextResponse.json({
      success: true,
      enrollment: {
        reference: enrollment.payment_reference,
        status: enrollment.status,
        email: enrollment.email,
        amount: enrollment.amount,
        currency: enrollment.currency,
        channel: channel,
        paidAt: paid_at,
        ageBand: enrollment.age_band,
        childName: enrollment.child_name,
        parentName: enrollment.parent_name,
        userCreated: userCreated,
        defaultPassword: userCreated ? defaultPassword : undefined
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Check if enrollment already exists
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        enrollment: {
          reference: existingEnrollment.payment_reference,
          status: existingEnrollment.status,
          email: existingEnrollment.email,
          amount: existingEnrollment.amount,
          currency: existingEnrollment.currency,
          ageBand: existingEnrollment.age_band,
          childName: existingEnrollment.child_name,
          parentName: existingEnrollment.parent_name,
          userCreated: true
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Enrollment not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
