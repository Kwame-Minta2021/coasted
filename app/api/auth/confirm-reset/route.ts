import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/services/authService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Confirm password reset
    const result = await authService.confirmPasswordReset(body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
