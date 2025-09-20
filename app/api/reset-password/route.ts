import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin not initialized' },
        { status: 500 }
      )
    }

    try {
      // Get user by email
      const { data: userRecord, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
      
      if (getUserError) {
        if (getUserError.message.includes('User not found')) {
          return NextResponse.json(
            { error: 'User not found with this email' },
            { status: 404 }
          )
        }
        throw getUserError;
      }
      
      // Update user password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userRecord.user.id, {
        password: newPassword
      })

      if (updateError) {
        throw updateError;
      }

      console.log('Password updated for user:', userRecord.user.id)

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully'
      })
    } catch (authError: any) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
