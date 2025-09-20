import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // For now, just return success - the actual signup will be handled client-side
    // This is just to test if the API route is working
    return NextResponse.json({
      success: true,
      message: 'Signup endpoint is working. Use client-side Firebase Auth for actual signup.',
      data: { email, displayName }
    });

  } catch (error: any) {
    console.error('Simple signup error:', error);
    return NextResponse.json({
      error: 'Failed to process signup request'
    }, { status: 500 });
  }
}
