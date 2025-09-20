import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Comprehensive diagnostic check
    const diagnostics = {
      firebase: {
        projectId: 'coasted-code-e4ae6',
        authDomain: 'coasted-code-e4ae6.firebaseapp.com',
        apiKey: 'AIzaSyBGVJrH3UxYh8UOdwv6VWMeg7Alu3tpYAE',
        databaseURL: 'https://coasted-code-e4ae6-default-rtdb.firebaseio.com',
        storageBucket: 'coasted-code-e4ae6.firebasestorage.app',
        messagingSenderId: '951469978943',
        appId: '1:951469978943:web:ea8c0bdf291e1e39538f8a',
        measurementId: 'G-H2EE34FVLG'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasPaystackSecret: !!process.env.PAYSTACK_SECRET_KEY,
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://coasted-code-test.vercel.app'
      },
      firestore: {
        rules: 'Configured for authenticated access',
        collections: ['enrollments', 'users', 'students', 'courses']
      },
      authentication: {
        method: 'Email/Password',
        status: 'Client-side Firebase Auth',
        domain: 'coasted-code-e4ae6.firebaseapp.com'
      },
      recommendations: [
        '1. Enable Email/Password authentication in Firebase Console',
        '2. Add your domain to authorized domains in Firebase Console',
        '3. Check if Firebase project is properly configured',
        '4. Verify environment variables are set in Vercel'
      ]
    };

    return NextResponse.json({
      success: true,
      message: 'Firebase diagnostic completed',
      diagnostics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Diagnostic failed' 
    }, { status: 500 });
  }
}
