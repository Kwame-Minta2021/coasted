export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || 'frederickminta@gmail.com'
    const newPassword = 'coastedcode2024'

    // Get the user from Supabase Auth
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email)

    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found in Supabase Auth' },
        { status: 404 }
      )
    }

    console.log('Resetting password for user:', authUser.id)

    // Update the user's password
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        password: newPassword,
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('Error updating user password:', updateError)
      return NextResponse.json(
        { 
          error: 'Failed to update user password', 
          details: updateError.message
        },
        { status: 500 }
      )
    }

    // Test the login immediately
    const { data: loginData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: newPassword
    })

    if (loginError) {
      console.error('Login test failed:', loginError)
      return NextResponse.json({
        success: true,
        message: 'Password updated but login test failed',
        user: {
          id: updatedUser.user.id,
          email: updatedUser.user.email,
          email_confirmed_at: updatedUser.user.email_confirmed_at
        },
        loginError: loginError.message
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated and login test successful',
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at
      },
      loginTest: {
        success: true,
        userId: loginData.user.id
      }
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
