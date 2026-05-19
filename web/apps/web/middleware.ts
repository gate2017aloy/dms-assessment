import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/alerts');
  const isProtectedApiRoute =
    pathname.startsWith('/api') &&
    !pathname.startsWith('/api/login') &&
    !pathname.startsWith('/api/logout');

  if (isProtectedRoute || isProtectedApiRoute) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/login') {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
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
    '/api/:path*',
    '/login',
  ],
};
