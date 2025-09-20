export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || 'frederickminta@gmail.com'
    const password = 'coastedcode2024'

    // Get the user from Supabase Auth
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email)

    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found in Supabase Auth' },
        { status: 404 }
      )
    }

    console.log('Current user status:', {
      id: authUser.id,
      email: authUser.email,
      email_confirmed_at: authUser.email_confirmed_at
    })

    // Update the user's password and ensure email is confirmed
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        password: password,
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json(
        { 
          error: 'Failed to update user', 
          details: updateError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User password and email confirmation updated successfully',
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Fix user password error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
