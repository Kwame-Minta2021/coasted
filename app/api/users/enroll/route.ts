import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/services/userService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, profileData } = body;
    
    // Complete user profile
    const result = await userService.completeUserProfile(userId, profileData);
    
    return NextResponse.json({ success: true, user: result }, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
