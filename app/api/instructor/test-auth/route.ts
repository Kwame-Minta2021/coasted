import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Check if instructor user exists
    const { data: instructor, error: instructorError } = await supabaseAdmin
      .from('instructors')
      .select('id, email, name, bio, specialization, status, created_at, updated_at')
      .eq('email', 'instructor@coastedcode.com')
      .single();

    // Check JWT_SECRET
    const hasJwtSecret = !!process.env.JWT_SECRET;
    const jwtSecretLength = process.env.JWT_SECRET?.length || 0;

    // Check environment variables
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    return NextResponse.json({
      success: true,
      data: {
        instructorExists: !!instructor,
        instructor: instructor,
        hasJwtSecret,
        jwtSecretLength,
        environment,
      },
    });
  } catch (error) {
    console.error('Instructor test auth error:', error);
    return NextResponse.json({ success: false, error: 'Failed to test instructor authentication' }, { status: 500 });
  }
}
