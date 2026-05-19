import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Paths that require standard user authentication.
 */
export const PROTECTED_ROUTE_PREFIXES = ['/dashboard', '/alerts'];

/**
 * Checks if the given pathname requires user authentication (protected page).
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}

/**
 * Redirects the user to the login page, preserving the original page they tried to access.
 */
export function redirectToLogin(request: NextRequest, fromPathname: string): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', fromPathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Redirects the user to the main dashboard.
 */
export function redirectToDashboard(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
