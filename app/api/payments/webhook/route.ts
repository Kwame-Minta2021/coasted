import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/services/paymentService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle payment webhook
    const result = await paymentService.handlePaymentWebhook(body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    // Log webhook error for debugging
    console.error('Payment webhook error:', error);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
