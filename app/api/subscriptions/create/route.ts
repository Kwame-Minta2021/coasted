import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const plan = process.env.PAYSTACK_PLAN_CODE!;
    const { email, enrollmentRef } = await req.json();

    if (!secret || !plan) {
      return NextResponse.json({ error: 'Missing Paystack config' }, { status: 500 });
    }
    
    if (!email || !enrollmentRef) {
      return NextResponse.json({ error: 'Missing email/enrollmentRef' }, { status: 400 });
    }

    const res = await fetch('https://api.paystack.co/subscription', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${secret}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        customer: email, 
        plan 
      }),
    });
    
    const json = await res.json();
    if (!json?.status) {
      return NextResponse.json({ error: json?.message ?? 'Subscription failed' }, { status: 400 });
    }

    const sub = json.data; // includes subscription_code, email_token, status, etc.

    // Save subscription to Supabase
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        subscription_code: sub.subscription_code,
        email,
        plan_code: plan,
        status: sub.status,
        created_at: new Date().toISOString(),
        next_billing_date: sub.next_payment_date ? new Date(sub.next_payment_date).toISOString() : null,
        enrollment_ref: enrollmentRef
      });

    if (subscriptionError) {
      throw subscriptionError;
    }

    // Update enrollment with subscription details
    const { error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .update({
        subscription_id: sub.subscription_code,
        next_billing_date: sub.next_payment_date ? new Date(sub.next_payment_date).toISOString() : null,
        status: 'active'
      })
      .eq('enrollment_id', enrollmentRef);

    if (enrollmentError) {
      throw enrollmentError;
    }

    return NextResponse.json({ ok: true, data: sub });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
