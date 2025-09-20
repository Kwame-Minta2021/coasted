import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      hasFirebaseApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasFirebaseAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasPaystackSecret: !!process.env.PAYSTACK_SECRET_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
      firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    };

    return NextResponse.json({
      success: true,
      message: 'Firebase configuration test',
      envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Auth test failed' 
    }, { status: 500 });
  }
}
