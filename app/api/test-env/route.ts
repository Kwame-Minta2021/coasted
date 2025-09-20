import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    hasPaystackSecret: !!process.env.PAYSTACK_SECRET_KEY,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    hasFirebase: !!process.env.FIREBASE_PROJECT_ID,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    paystackSecretPrefix: process.env.PAYSTACK_SECRET_KEY ? 
      process.env.PAYSTACK_SECRET_KEY.substring(0, 10) + '...' : 'NOT SET',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
  };

  return NextResponse.json({
    message: 'Environment Variables Check',
    data: envCheck,
    timestamp: new Date().toISOString()
  });
}
