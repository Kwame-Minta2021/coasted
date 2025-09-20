import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email, childName, parentName, ageBand, paymentReference } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Creating user manually for:', email)

    const defaultPassword = 'coastedcode2024'

    // Check if Supabase Auth user exists
    let authUser = null
    try {
      const { data: existingAuthUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
      if (getUserError && getUserError.message.includes('User not found')) {
        // Create new Supabase Auth user
        const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: defaultPassword,
          user_metadata: {
            display_name: childName || parentName,
            age_band: ageBand
          },
          email_confirm: false
        })
        if (createError) {
          console.error('Error creating Supabase Auth user:', createError)
          return NextResponse.json(
            { success: false, error: 'Failed to create Supabase Auth user: ' + createError.message },
            { status: 500 }
          )
        } else {
          authUser = newAuthUser
          console.log('Supabase Auth user created:', authUser.user.id)
        }
      } else if (getUserError) {
        console.error('Error checking existing Supabase Auth user:', getUserError)
        return NextResponse.json(
          { success: false, error: 'Error checking existing user: ' + getUserError.message },
          { status: 500 }
        )
      } else {
        authUser = existingAuthUser
        console.log('Supabase Auth user already exists:', authUser.user.id)
      }
    } catch (authError) {
      console.error('Error with Supabase Auth user creation:', authError)
      return NextResponse.json(
        { success: false, error: 'Auth error: ' + authError.message },
        { status: 500 }
      )
    }

    // Create user record in users table
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    let userRecord = null
    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create new one
      const userData = {
        id: authUser.user.id,
        email: email,
        display_name: childName || parentName,
        age_band: ageBand,
        role: 'student',
        enrollment_date: new Date().toISOString(),
        course_enrolled: 'Coasted Code Course',
        payment_reference: paymentReference,
        status: 'active'
      }

      const { data: newUser, error: userCreationError } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (userCreationError) {
        console.error('Error creating user record:', userCreationError)
        return NextResponse.json(
          { success: false, error: 'Failed to create user record: ' + userCreationError.message },
          { status: 500 }
        )
      } else {
        userRecord = newUser
        console.log('User record created in users table:', userRecord.id)
      }
    } else if (userCheckError) {
      console.error('Error checking user record:', userCheckError)
      return NextResponse.json(
        { success: false, error: 'Error checking user record: ' + userCheckError.message },
        { status: 500 }
      )
    } else {
      userRecord = existingUser
      console.log('User record already exists in users table:', userRecord.id)
    }

    // Create enrollment record if it doesn't exist
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', email)
      .single()

    let enrollmentRecord = null
    if (enrollmentCheckError && enrollmentCheckError.code === 'PGRST116') {
      // Enrollment doesn't exist, create new one
      const enrollmentData = {
        email: email,
        child_name: childName,
        parent_name: parentName,
        parent_email: email,
        age_band: ageBand,
        course_enrolled: 'Coasted Code Course',
        payment_reference: paymentReference,
        amount: 800, // Default amount
        currency: 'GHS',
        status: 'completed',
        enrollment_date: new Date().toISOString(),
        user_id: authUser.user.id
      }

      const { data: newEnrollment, error: enrollmentCreationError } = await supabaseAdmin
        .from('enrollments')
        .insert(enrollmentData)
        .select()
        .single()

      if (enrollmentCreationError) {
        console.error('Error creating enrollment record:', enrollmentCreationError)
        return NextResponse.json(
          { success: false, error: 'Failed to create enrollment record: ' + enrollmentCreationError.message },
          { status: 500 }
        )
      } else {
        enrollmentRecord = newEnrollment
        console.log('Enrollment record created:', enrollmentRecord.id)
      }
    } else if (enrollmentCheckError) {
      console.error('Error checking enrollment record:', enrollmentCheckError)
      return NextResponse.json(
        { success: false, error: 'Error checking enrollment record: ' + enrollmentCheckError.message },
        { status: 500 }
      )
    } else {
      enrollmentRecord = existingEnrollment
      console.log('Enrollment record already exists:', enrollmentRecord.id)
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        authUser: {
          id: authUser.user.id,
          email: authUser.user.email
        },
        userRecord: {
          id: userRecord.id,
          email: userRecord.email,
          display_name: userRecord.display_name
        },
        enrollmentRecord: {
          id: enrollmentRecord.id,
          email: enrollmentRecord.email,
          status: enrollmentRecord.status
        },
        defaultPassword: defaultPassword
      }
    })

  } catch (error) {
    console.error('Manual user creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
