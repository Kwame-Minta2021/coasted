import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock PIN check - always return false for demo
    return NextResponse.json({ 
      hasPin: false,
      message: 'PIN check completed (Demo Mode)'
    })
  } catch (error) {
    console.error('Error checking PIN:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
