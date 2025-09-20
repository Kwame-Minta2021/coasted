import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('Failed to fetch enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
