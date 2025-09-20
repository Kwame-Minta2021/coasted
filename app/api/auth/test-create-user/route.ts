import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }

    console.log('🔧 Test: Creating user with email:', email);

    // Create user with Firebase Admin SDK
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: displayName || 'Test Student',
      emailVerified: true
    });

    console.log('✅ Test: User created successfully:', userRecord.uid);

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      },
      message: 'Test user account created successfully'
    });

  } catch (error: any) {
    console.error('❌ Test: Error creating user:', error);

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({
        success: true,
        message: 'User account already exists',
        error: 'User with this email already exists'
      }, { status: 200 });
    }

    return NextResponse.json({
      error: 'Failed to create test user account',
      details: error.message
    }, { status: 500 });
  }
}
