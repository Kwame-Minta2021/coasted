'use server'

export async function initializePayment(formData: FormData) {
  try {
    console.log('=== ENROLLMENT ACTION STARTED ===');
    
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const ageBand = formData.get('ageBand') as string
    const parentName = formData.get('parentName') as string
    const childName = formData.get('childName') as string
    // Determine enrollment amount by age band
    const amountGhs = ageBand === '6-9' ? 650 : ageBand === '10-13' ? 750 : 800

    console.log('Form data:', { email, phone, ageBand, parentName, childName, amountGhs });

    // Validate required fields
    if (!email || !phone || !ageBand || !parentName || !childName || !amountGhs) {
      console.error('Missing required fields:', { email, phone, ageBand, parentName, childName, amountGhs });
      return { 
        success: false, 
        error: 'Missing required fields' 
      }
    }

    const secret = process.env.PAYSTACK_SECRET_KEY
    const site = process.env.SITE_URL

    console.log('Environment check:', {
      hasSecret: !!secret,
      secretPrefix: secret?.substring(0, 10) + '...',
      hasSite: !!site,
      site: site
    });

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return { 
        success: false, 
        error: 'PAYSTACK_SECRET_KEY is missing in environment variables'
      }
    }

    // Convert amount to pesewas (subunits)
    const amountPesewas = Math.round(Number(amountGhs) * 100)

    console.log('Initializing Paystack transaction...');
    
    // Initialize Paystack transaction directly
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
      return { 
        success: false, 
        error: `Paystack API error: ${initResponse.status}` 
      }
    }

    const json = await initResponse.json()
    console.log('Paystack response:', json);

    if (!json.status) {
      console.error('Paystack initialization failed:', json)
      return { 
        success: false, 
        error: json.message ?? 'Payment initialization failed' 
      }
    }

    console.log('Payment initialized successfully, redirecting to:', json.data.authorization_url);
    return { 
      success: true, 
      url: json.data.authorization_url 
    }

  } catch (error) {
    console.error('Enrollment action error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { success: false, error: `Failed to start payment: ${error.message}` }
  }
}
