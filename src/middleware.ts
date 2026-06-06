import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_123';
const COOKIE_NAME = 'auth-token';

const protectedRoutes = ['/dashboard', '/admin', '/agent']

// Helper to decode Base64Url to UTF-8 string
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return '';
  }
}

// Helper to convert Base64Url directly to Uint8Array bytes (prevents UTF-8 lossy decoding corruption)
function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    return new Uint8Array(0);
  }
}

// Helper to verify HMAC-SHA256 signature using Web Crypto API
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Decode payload and check expiry
    const payloadStr = base64UrlDecode(payloadB64);
    if (!payloadStr) return { valid: false };
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false };
    }

    // 2. Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const secretData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
      'raw',
      secretData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToBytes(signatureB64);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as any, data);
    return { valid: isValid, payload };
  } catch (err) {
    console.error('JWT verify error in Edge middleware:', err);
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  let payload: any = null;

  // Verify JWT if present
  if (token) {
    const secret = process.env.JWT_SECRET || 'default_secret_key_123';
    console.log(`[Middleware] Using secret length: ${secret.length}, prefix: ${secret.slice(0, 5)}...`);
    const result = await verifyJWT(token, secret);
    isValid = result.valid;
    payload = result.payload;
    console.log(`[Middleware] Token verified for path ${pathname}. Valid: ${isValid}, payload user: ${payload?.userId || payload?.sub}, role: ${payload?.role || payload?.accountType}`);
    if (!isValid) {
      console.log(`[Middleware] Token verification failed for path ${pathname}`);
    }
  } else {
    console.log(`[Middleware] No token found in cookies for path ${pathname}`);
  }

  // Route requires authentication checks
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!isValid || !payload) {
      // Invalid token or no token -> clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Role-based routing checks
    const userRole = payload.role || payload.accountType;
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/agent') && userRole !== 'agent' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Pass user info downstream to API routes via request headers
  const requestHeaders = new Headers(request.headers);
  if (isValid && payload) {
    requestHeaders.set('x-user-id', payload.sub || payload.userId);
    requestHeaders.set('x-user-role', payload.role || payload.accountType);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

