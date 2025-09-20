import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../../../lib/services/paymentService';
import { authService } from '../../../../../lib/services/authService';
import { handleError, formatErrorResponse } from '../../../../../lib/errors';

export async function GET(
  request: NextRequest,
  { params }: Promise<{ params: { paymentId: string } }>
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { uid } = await authService.verifyToken(token);
    
    const { paymentId } = params;
    
    // Get payment details
    const payment = await paymentService.getPaymentById(paymentId);
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Ensure user can only access their own payments
    if (payment.userId !== uid) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
