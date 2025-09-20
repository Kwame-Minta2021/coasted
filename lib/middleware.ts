import { NextRequest, NextResponse } from 'next/server';
import { authService } from './services/authService';
import { handleError, formatErrorResponse } from './errors';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  // Get current rate limit data
  const rateLimitData = rateLimitStore.get(ip);
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Reset rate limit
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return null;
  }
  
  // Check if rate limit exceeded
  if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
  
  // Increment count
  rateLimitData.count++;
  rateLimitStore.set(ip, rateLimitData);
  
  return null;
}

/**
 * Authentication middleware
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    );
  }
  
  try {
    const token = authHeader.substring(7);
    const { uid } = await authService.verifyToken(token);
    
    // Add user ID to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', uid);
    
    // Create new request with user ID
    const newRequest = new NextRequest(request, {
      headers: requestHeaders,
    });
    
    return null;
  } catch (error) {
    const appError = handleError(error);
    const errorResponse = formatErrorResponse(appError);
    
    return NextResponse.json(errorResponse, { status: appError.statusCode });
  }
}

/**
 * CORS middleware
 */
export function corsMiddleware(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'https://coasted-code.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }
  
  return null;
}

/**
 * Request validation middleware
 */
export function validationMiddleware(request: NextRequest): NextResponse | null {
  const contentType = request.headers.get('content-type');
  
  // Check content type for POST/PUT requests
  if ((request.method === 'POST' || request.method === 'PUT') && 
      contentType !== 'application/json') {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 400 }
    );
  }
  
  return null;
}

/**
 * Logging middleware
 */
export function loggingMiddleware(request: NextRequest): void {
  const startTime = Date.now();
  const { method, url } = request;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  // Log response time when request completes
  request.headers.set('x-start-time', startTime.toString());
}

/**
 * Combined middleware function
 */
export async function combinedMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Log request
  loggingMiddleware(request);
  
  // Handle CORS
  const corsResponse = corsMiddleware(request);
  if (corsResponse) return corsResponse;
  
  // Validate request
  const validationResponse = validationMiddleware(request);
  if (validationResponse) return validationResponse;
  
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Apply authentication for protected routes
  const protectedRoutes = [
    '/api/users/profile',
    '/api/payments/process',
    '/api/payments/status',
    '/api/portal/access',
    '/api/portal/dashboard',
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;
  }
  
  return null;
}

/**
 * Clean up rate limit store periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

/**
 * Get user ID from request headers (set by auth middleware)
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

/**
 * Get request start time for performance monitoring
 */
export function getRequestStartTime(request: NextRequest): number | null {
  const startTime = request.headers.get('x-start-time');
  return startTime ? parseInt(startTime, 10) : null;
}
