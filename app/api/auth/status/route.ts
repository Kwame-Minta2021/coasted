import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Simple status check - no Firebase Admin SDK needed
    return NextResponse.json({
      success: true,
      message: 'Authentication system is ready',
      firebase: {
        projectId: 'coasted-code-e4ae6',
        authDomain: 'coasted-code-e4ae6.firebaseapp.com',
        apiKey: 'AIzaSyBGVJrH3UxYh8UOdwv6VWMeg7Alu3tpYAE'
      },
      status: 'operational',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Auth status check failed' 
    }, { status: 500 });
  }
}
