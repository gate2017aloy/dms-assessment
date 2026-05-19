import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import {
  isProtectedRoute,
  redirectToLogin,
  redirectToDashboard,
} from '@/lib/middleware-utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // 1. Auth Guard for Protected Pages (API routes are now handled by Express)
  if (isProtectedRoute(pathname)) {
    const payload = token ? await verifyJWT(token) : null;

    if (!payload) {
      return redirectToLogin(request, pathname);
    }
  }

  // 2. Redirect authenticated users away from the login page
  if (pathname === '/login' && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return redirectToDashboard(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/alerts',
    '/alerts/:path*',
    '/login',
  ],
};
