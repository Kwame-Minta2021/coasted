import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasPaystackSecret: !!process.env.PAYSTACK_SECRET_KEY,
      hasPaystackPublic: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      supabaseServiceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
      paystackSecretPrefix: process.env.PAYSTACK_SECRET_KEY?.substring(0, 20) + '...',
      paystackPublicPrefix: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.substring(0, 20) + '...'
    }

    return NextResponse.json({
      success: true,
      environment: envVars
    })
  } catch (error) {
    console.error('Debug env error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
