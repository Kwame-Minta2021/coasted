import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check if Firebase client config is accessible
    const firebaseConfig = {
      apiKey: "AIzaSyBGVJrH3UxYh8UOdwv6VWMeg7Alu3tpYAE",
      authDomain: "coasted-code-e4ae6.firebaseapp.com",
      databaseURL: "https://coasted-code-e4ae6-default-rtdb.firebaseio.com",
      projectId: "coasted-code-e4ae6",
      storageBucket: "coasted-code-e4ae6.firebasestorage.app",
      messagingSenderId: "951469978943",
      appId: "1:951469978943:web:ea8c0bdf291e1e39538f8a",
      measurementId: "G-H2EE34FVLG"
    };

    return NextResponse.json({
      success: true,
      message: 'Firebase client configuration test',
      config: {
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
        hasProjectId: !!firebaseConfig.projectId,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Client test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Client test failed' 
    }, { status: 500 });
  }
}
