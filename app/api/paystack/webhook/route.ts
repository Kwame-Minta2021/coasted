import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const raw = await req.text();
    const sig = req.headers.get('x-paystack-signature') || '';
    const hash = crypto.createHmac('sha512', secret).update(raw).digest('hex');
    
    if (hash !== sig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const evt = JSON.parse(raw);

    // One-time payment (enrollment)
    if (evt.event === 'charge.success' && evt.data?.status === 'success') {
      const ref = evt.data?.reference;
      if (ref) {
        await supabaseAdmin
          .from('payments')
          .insert({
            type: 'enrollment',
            reference: ref,
            status: 'success',
            email: evt.data?.customer?.email,
            amount: evt.data?.amount,
            currency: evt.data?.currency,
            channel: evt.data?.authorization?.channel || 'unknown',
            paid_at: new Date(evt.data?.paid_at || Date.now()).toISOString(),
            meta: evt.data,
            enrollment_ref: ref
          });
        
        await supabaseAdmin
          .from('enrollments')
          .update({ status: 'paid' })
          .eq('enrollment_id', ref);
      }
    }

    // First subscription created
    if (evt.event === 'subscription.create') {
      const sub = evt.data;
      await supabaseAdmin
        .from('subscriptions')
        .upsert({
          subscription_code: sub.subscription_code,
          email: sub.customer?.email,
          plan_code: sub.plan?.plan_code,
          status: sub.status,
          created_at: new Date().toISOString(),
          next_billing_date: sub.next_payment_date ? new Date(sub.next_payment_date).toISOString() : null,
          enrollment_ref: null
        });
    }

    // Recurring invoice paid
    if (evt.event === 'invoice.payment_success') {
      const inv = evt.data;
      await supabaseAdmin
        .from('payments')
        .insert({
          type: 'invoice',
          reference: inv?.reference || inv?.subscription?.subscription_code,
          status: 'success',
          email: inv?.customer?.email,
          amount: inv?.amount,
          currency: inv?.currency,
          channel: 'subscription',
          paid_at: new Date(inv?.paidAt || Date.now()).toISOString(),
          meta: inv,
          enrollment_ref: inv?.metadata?.enrollmentRef || null
        });

      // Update subscription & linked enrollment
      const subCode = inv?.subscription?.subscription_code;
      if (subCode) {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            next_billing_date: inv?.next_payment_date ? new Date(inv.next_payment_date).toISOString() : null
          })
          .eq('subscription_code', subCode);
      }
    }

    // Subscription failed/disabled
    if (evt.event === 'invoice.payment_failed' || evt.event === 'subscription.disable') {
      const subCode = evt.data?.subscription_code || evt.data?.subscription?.subscription_code;
      if (subCode) {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'non_renewing'
          })
          .eq('subscription_code', subCode);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
