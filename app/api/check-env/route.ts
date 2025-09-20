import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY ? '✔️ Loaded' : '❌ Missing',
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? '✔️ Loaded' : '❌ Missing',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ? '✔️ Loaded' : '❌ Missing',
  });
}
