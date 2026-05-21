import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/auth/login']
const protectedRoutes = ['/dashboard', '/admin', '/agent']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Verify token is still valid
  if (token) {
    try {
      // Token validation can be added here
      // For now, we just allow the request
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
  }

  return NextResponse.next()
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
