import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    console.log('=== STUDENT FORGOT PASSWORD REQUEST ===');
    console.log('Email:', email);

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase Admin not initialized' 
      }, { status: 500 });
    }

    try {
      // Use Supabase to send password reset email
      const { error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/reset-password`
        }
      });

      if (error) {
        throw error;
      }
      
      console.log('Password reset link generated for:', email);

      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.'
      });

    } catch (authError: any) {
      console.error('Supabase auth error:', authError);
      
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a reset link has been sent.' 
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process request. Please try again.' 
    }, { status: 500 });
  }
}
