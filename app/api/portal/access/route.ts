import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '../../../../lib/services/portalService';
import { authService } from '../../../../lib/services/authService';
import { handleError, formatErrorResponse } from '../../../../lib/errors';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { uid } = await authService.verifyToken(token);
    
    // Check portal access
    const access = await portalService.checkPortalAccess(uid);
    
    return NextResponse.json({ success: true, access }, { status: 200 });
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}
