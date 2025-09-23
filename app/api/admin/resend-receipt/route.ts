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
    
    // Calculate the correct amount based on age band if amount is missing or incorrect
    const getAmountByAgeBand = (ageBand: string): number => {
      switch (ageBand) {
        case '6-9': return 650;
        case '10-13': return 750;
        case '14-17': return 800;
        default: return 800;
      }
    };
    
    const correctAmount = enrollment?.amount || getAmountByAgeBand(enrollment?.age_band || '14-17');
    
    // TODO: Implement actual email sending using your email provider (Resend/Mailgun/SendGrid)
    // For now, just log the receipt request
    console.log('Receipt request for:', {
      reference,
      parentEmail: enrollment?.parentEmail,
      parentName: enrollment?.parentName,
      childName: enrollment?.childName,
      amount: `₵${correctAmount}`,
      ageBand: enrollment?.age_band,
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
