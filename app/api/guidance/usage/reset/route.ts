import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: 'Missing student ID' },
        { status: 400 }
      )
    }

    // Mock resetting usage
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true,
      message: 'Daily usage reset successfully (Demo Mode)'
    })
  } catch (error) {
    console.error('Error resetting usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
