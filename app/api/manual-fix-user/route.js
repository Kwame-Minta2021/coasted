export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || 'frederickminta@gmail.com'

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
      email_confirmed_at: authUser.email_confirmed_at,
      created_at: authUser.created_at
    })

    // Update the user to confirm their email
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('Error updating user confirmation:', updateError)
      return NextResponse.json(
        { 
          error: 'Failed to confirm user email', 
          details: updateError.message,
          currentUser: {
            id: authUser.id,
            email: authUser.email,
            email_confirmed_at: authUser.email_confirmed_at
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User email confirmed successfully',
      before: {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at
      },
      after: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Manual fix user error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
