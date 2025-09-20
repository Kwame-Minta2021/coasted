import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    const email = 'frederickminta@gmail.com';
    const displayName = 'Frederick Minta';
    
    console.log('Creating user account for:', email);
    
    // Create user with Supabase Admin
    const { data: userRecord, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'coastedcode2024', // Use provided password or default
      user_metadata: {
        display_name: displayName
      },
      email_confirm: true
    });
    
    if (error) {
      throw error;
    }
    
    console.log('User created successfully:', userRecord.user.id);
    
    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.user.id,
        email: userRecord.user.email,
        displayName: userRecord.user.user_metadata?.display_name,
        emailVerified: userRecord.user.email_confirmed_at ? true : false
      },
      message: `User account created successfully for ${email}. You can now sign in with these credentials.`,
      credentials: {
        email,
        password: password || 'coastedcode2024'
      }
    });
    
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists. You can try signing in instead.',
        message: 'The user account already exists. Try signing in with the correct password.'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create user'
    }, { status: 500 });
  }
}
