import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('=== PAYSTACK INITIALIZE REQUEST ===');
    const body = await req.json()
    const { email, phone, ageBand, parentName, childName, amountGhs } = body
    
    console.log('Request body:', { email, phone, ageBand, parentName, childName, amountGhs });

    // Validate required fields (make names optional so we can initialize with just payer info)
    if (!email || !phone || !amountGhs) {
      console.error('Missing required fields:', { email, phone, amountGhs });
      return NextResponse.json({ 
        error: 'Missing required fields: email, phone, and amountGhs are required' 
      }, { status: 400 })
    }

    const secret = process.env.PAYSTACK_SECRET_KEY
    let site = process.env.SITE_URL

    // Fallback to determine site URL if not set in environment
    if (!site) {
      const host = req.headers.get('host')
      const protocol = req.headers.get('x-forwarded-proto') || 'https'
      site = `${protocol}://${host}`
      console.log('Using fallback site URL:', site)
    }

    console.log('Environment check:', {
      hasSecret: !!secret,
      secretPrefix: secret?.substring(0, 10) + '...',
      hasSite: !!site,
      site: site
    });

    if (!secret || secret.startsWith('sk_test')) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return NextResponse.json({ 
        error: 'PAYSTACK_SECRET_KEY is missing or using test key',
        details: 'Set PAYSTACK_SECRET_KEY to your LIVE secret key in environment variables'
      }, { status: 500 })
    }

    // Convert amount to pesewas (subunits)
    const amountPesewas = Math.round(Number(amountGhs) * 100)

    console.log('Initializing Paystack transaction...');
    
    // Initialize Paystack transaction
    const initResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amountPesewas, // in pesewas
        currency: 'GHS',
        // Ghana payment channels: Mobile Money + GHIPSS + Card fallback
        channels: ['mobile_money', 'ghipps', 'card'],
        callback_url: `${site}/enroll/callback`,
        metadata: {
          phone,
          ageBand,
          parentName,
          childName,
          purpose: 'CoastedCode Enrollment Fee',
          amountGhs: amountGhs.toString()
        }
      })
    })

    console.log('Paystack response status:', initResponse.status);
    
    if (!initResponse.ok) {
      console.error('Paystack API error:', initResponse.status, initResponse.statusText);
      const errorText = await initResponse.text();
      console.error('Paystack error response:', errorText);
      return NextResponse.json({ 
        error: `Paystack API error: ${initResponse.status}` 
      }, { status: 400 })
    }

    const json = await initResponse.json()
    console.log('Paystack response:', json);

    if (!json.status) {
      console.error('Paystack initialization failed:', json)
      return NextResponse.json({ 
        error: json.message ?? 'Payment initialization failed' 
      }, { status: 400 })
    }

    // Return payment URL without Firestore dependency
    return NextResponse.json({
      authorization_url: json.data.authorization_url,
      reference: json.data.reference,
      access_code: json.data.access_code,
      message: 'Payment initialized successfully'
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
