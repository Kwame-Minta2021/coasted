import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    // Look up the enrollment and payment details
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('payment_reference', reference)
      .single();
    
    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }
    
    // TODO: Implement actual email sending using your email provider (Resend/Mailgun/SendGrid)
    // For now, just log the receipt request
    console.log('Receipt request for:', {
      reference,
      parentEmail: enrollment?.parentEmail,
      parentName: enrollment?.parentName,
      childName: enrollment?.childName,
      amount: '₵800',
      paidAt: enrollment?.paidAt
    });

    return NextResponse.json({ 
      ok: true, 
      message: 'Receipt request logged (email service not configured)' 
    });
  } catch (error) {
    console.error('Failed to resend receipt:', error);
    return NextResponse.json({ error: 'Failed to resend receipt' }, { status: 500 });
  }
}
