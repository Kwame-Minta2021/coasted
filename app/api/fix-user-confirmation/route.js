export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get the user from Supabase Auth
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email)

    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found in Supabase Auth' },
        { status: 404 }
      )
    }

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
        { error: 'Failed to confirm user email', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User email confirmed successfully',
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Fix user confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
