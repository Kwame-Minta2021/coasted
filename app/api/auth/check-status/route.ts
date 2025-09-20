import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Simple check to see if the API is accessible
    return NextResponse.json({
      success: true,
      message: 'Authentication system is accessible',
      firebase: {
        projectId: 'coasted-code-e4ae6',
        authDomain: 'coasted-code-e4ae6.firebaseapp.com',
        apiKey: 'AIzaSyBGVJrH3UxYh8UOdwv6VWMeg7Alu3tpYAE'
      },
      status: 'operational',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Auth status check failed' 
    }, { status: 500 });
  }
}
