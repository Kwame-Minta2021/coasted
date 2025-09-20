import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { studentId, pin, restrictions } = await request.json()

    if (!studentId || !pin) {
      return NextResponse.json({ error: 'Student ID and PIN are required' }, { status: 400 })
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10)

    // Update or create guidance record with PIN
    const { data, error } = await supabaseAdmin
      .from('guidance')
      .upsert({
        guardian_id: user.id,
        student_id: studentId,
        pin_enabled: true,
        pin_hash: pinHash,
        restrictions: restrictions || {}
      }, {
        onConflict: 'guardian_id,student_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error setting PIN:', error)
      return NextResponse.json({ error: 'Failed to set PIN' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'PIN set successfully',
      data
    })
  } catch (error) {
    console.error('Set PIN error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { studentId, pin } = await request.json()

    if (!studentId || !pin) {
      return NextResponse.json({ error: 'Student ID and PIN are required' }, { status: 400 })
    }

    // Get current guidance record
    const { data: guidanceData, error: fetchError } = await supabaseAdmin
      .from('guidance')
      .select('pin_hash')
      .eq('guardian_id', user.id)
      .eq('student_id', studentId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Guidance record not found' }, { status: 404 })
    }

    // Verify PIN
    const isValidPin = await bcrypt.compare(pin, guidanceData.pin_hash)

    return NextResponse.json({
      success: true,
      valid: isValidPin,
      message: isValidPin ? 'PIN verified successfully' : 'Invalid PIN'
    })
  } catch (error) {
    console.error('Verify PIN error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
