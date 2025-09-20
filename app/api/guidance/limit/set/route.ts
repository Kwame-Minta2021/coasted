import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { studentId, dailyLimitSeconds } = await request.json()

    if (!studentId || !dailyLimitSeconds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock setting screen time limit
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true,
      message: 'Screen time limit set successfully (Demo Mode)'
    })
  } catch (error) {
    console.error('Error setting screen time limit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
