import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/services/userService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enroll the user
    const result = await userService.enrollUser(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
