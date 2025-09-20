import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const setupGuide = {
      title: 'Firebase Authentication Setup Guide',
      steps: [
        {
          step: 1,
          title: 'Enable Email/Password Authentication',
          description: 'Go to Firebase Console > Authentication > Sign-in method',
          action: 'Enable Email/Password provider',
          url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/authentication/providers'
        },
        {
          step: 2,
          title: 'Add Authorized Domains',
          description: 'Go to Firebase Console > Authentication > Settings > Authorized domains',
          action: 'Add these domains:',
          domains: [
            'coasted-code-test.vercel.app',
            'localhost',
            '127.0.0.1'
          ],
          url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/authentication/settings'
        },
        {
          step: 3,
          title: 'Verify Project Configuration',
          description: 'Check that your Firebase project is properly set up',
          action: 'Verify project settings match your configuration',
          url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/settings/general'
        },
        {
          step: 4,
          title: 'Check Vercel Environment Variables',
          description: 'Ensure all environment variables are set in Vercel',
          action: 'Verify these variables are set:',
          variables: [
            'PAYSTACK_SECRET_KEY',
            'NEXT_PUBLIC_SITE_URL',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_CLIENT_EMAIL',
            'FIREBASE_PRIVATE_KEY'
          ],
          url: 'https://vercel.com/dashboard'
        },
        {
          step: 5,
          title: 'Test Authentication',
          description: 'Use the test page to verify everything works',
          action: 'Visit /test-auth to test authentication',
          url: '/test-auth'
        }
      ],
      firebaseConfig: {
        projectId: 'coasted-code-e4ae6',
        authDomain: 'coasted-code-e4ae6.firebaseapp.com',
        apiKey: 'AIzaSyBGVJrH3UxYh8UOdwv6VWMeg7Alu3tpYAE'
      },
      troubleshooting: [
        'If login fails, check browser console for error messages',
        'Ensure Firebase Authentication is enabled in Firebase Console',
        'Verify your domain is in the authorized domains list',
        'Check that environment variables are properly set in Vercel',
        'Try clearing browser cache and cookies'
      ]
    };

    return NextResponse.json({
      success: true,
      message: 'Setup guide generated',
      setupGuide,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Setup guide error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Setup guide failed' 
    }, { status: 500 });
  }
}
