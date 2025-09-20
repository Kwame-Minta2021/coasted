import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }
    
    // Mock screen time data
    const usageData = {
      [studentId]: {
        used: 1800, // 30 minutes
        limit: 3600, // 1 hour
        resetAt: Date.now()
      }
    };

    return NextResponse.json(usageData)
  } catch (error) {
    console.error('Error loading screen time data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
