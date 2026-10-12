import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting (Note: in serverless this is per-instance, 
// for production use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute for normal APIs
const MAX_AUTH_REQUESTS = 10; // 10 requests per minute for auth/login APIs

export function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  const path = request.nextUrl.pathname;

  // 1. Basic Rate Limiting for APIs
  if (path.startsWith('/api/')) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Clean up old entries occasionally (rough garbage collection)
    if (Math.random() < 0.05) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (value.timestamp < windowStart) {
          rateLimitMap.delete(key);
        }
      }
    }

    const key = `${ip}:${path.startsWith('/api/auth') ? 'auth' : 'general'}`;
    const limit = path.startsWith('/api/auth') ? MAX_AUTH_REQUESTS : MAX_REQUESTS_PER_WINDOW;
    
    const record = rateLimitMap.get(key) || { count: 0, timestamp: now };
    
    if (record.timestamp < windowStart) {
      // Reset window
      record.count = 1;
      record.timestamp = now;
    } else {
      record.count++;
    }
    
    rateLimitMap.set(key, record);

    if (record.count > limit) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests, please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. CSRF Origin Validation for mutations (POST, PUT, DELETE, PATCH)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
      
      // If origin is present, it must match our host
      if (origin && host) {
        try {
          const originUrl = new URL(origin);
          if (originUrl.host !== host) {
            return new NextResponse(
              JSON.stringify({ error: 'Invalid origin (CSRF protection)' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
          }
        } catch {
          // ignore malformed origin URL
        }
      }
    }
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
