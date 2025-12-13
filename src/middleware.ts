import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip auth check for auth page itself
  if (request.nextUrl.pathname === '/auth') {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('demo-auth');
  
  if (!authCookie || authCookie.value !== 'obelysk-verified') {
    // Redirect to auth page if not authenticated
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - /auth (the auth page itself)
     */
    '/((?!_next/static|_next/image|favicon|brand|auth).*)',
  ],
};
