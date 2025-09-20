import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }
    
    // Create user with Supabase Admin
    const { data: userRecord, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        display_name: displayName || 'Test User'
      },
      email_confirm: true
    });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.user.id,
        email: userRecord.user.email,
        displayName: userRecord.user.user_metadata?.display_name,
        emailVerified: userRecord.user.email_confirmed_at ? true : false
      },
      message: 'Test user created successfully'
    });
    
  } catch (error: any) {
    console.error('Error creating test user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
