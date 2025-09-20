import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Test the exact hash from the database
    const dbHash = '$2b$10$qDypLE1QnExXXp.Nl7LY9.ag7/0VFu9RaIRsn1SdatfloV8vtlR0K'
    
    // Test bcrypt comparison
    const isValid = await bcrypt.compare(password, dbHash)
    
    // Also test creating a new hash
    const newHash = await bcrypt.hash(password, 10)
    const newHashValid = await bcrypt.compare(password, newHash)

    return NextResponse.json({
      success: true,
      data: {
        inputPassword: password,
        dbHash: dbHash,
        dbHashValid: isValid,
        newHash: newHash,
        newHashValid: newHashValid,
        hashLength: dbHash.length
      }
    })

  } catch (error) {
    console.error('Bcrypt test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Bcrypt test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
