import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/services/paymentService';
import { authService } from '../../../../lib/services/authService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { uid } = await authService.verifyToken(token);
    
    const body = await request.json();
    
    // Ensure the payment is for the authenticated user
    const paymentData = {
      ...body,
      userId: uid,
    };
    
    // Process payment
    const result = await paymentService.processPayment(paymentData);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
