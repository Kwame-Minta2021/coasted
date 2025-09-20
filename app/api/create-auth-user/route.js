import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email, password, displayName } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Creating Supabase Auth user for:', email)

    const defaultPassword = password || 'coastedcode2024'

    // Check if Supabase Auth user exists
    try {
      const { data: existingAuthUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
      if (getUserError && getUserError.message.includes('User not found')) {
        // Create new Supabase Auth user
        const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: defaultPassword,
          user_metadata: {
            display_name: displayName || 'Student'
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
          console.log('Supabase Auth user created:', newAuthUser.user.id)
          return NextResponse.json({
            success: true,
            message: 'Supabase Auth user created successfully',
            data: {
              userId: newAuthUser.user.id,
              email: newAuthUser.user.email,
              password: defaultPassword
            }
          })
        }
      } else if (getUserError) {
        console.error('Error checking existing Supabase Auth user:', getUserError)
        return NextResponse.json(
          { success: false, error: 'Error checking existing user: ' + getUserError.message },
          { status: 500 }
        )
      } else {
        console.log('Supabase Auth user already exists:', existingAuthUser.user.id)
        return NextResponse.json({
          success: true,
          message: 'Supabase Auth user already exists',
          data: {
            userId: existingAuthUser.user.id,
            email: existingAuthUser.user.email,
            password: defaultPassword
          }
        })
      }
    } catch (authError) {
      console.error('Error with Supabase Auth user creation:', authError)
      return NextResponse.json(
        { success: false, error: 'Auth error: ' + authError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Create auth user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
