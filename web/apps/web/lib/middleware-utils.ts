import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Paths that require standard user authentication.
 */
export const PROTECTED_ROUTE_PREFIXES = ['/dashboard', '/alerts'];

/**
 * Prefix for all API routes.
 */
export const API_ROUTE_PREFIX = '/api';

/**
 * Publicly accessible API routes that do not require authentication.
 */
export const PUBLIC_API_ROUTES = ['/api/login', '/api/logout'];

/**
 * Checks if the given pathname requires user authentication (protected page).
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}

/**
 * Checks if the given pathname requires API token verification (protected API).
 */
export function isProtectedApiRoute(pathname: string): boolean {
  if (!pathname.startsWith(API_ROUTE_PREFIX)) {
    return false;
  }
  return !PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
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

/**
 * Returns a standard 401 Unauthorized JSON response.
 */
export function unauthorizedApiResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
