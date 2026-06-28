import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/analyze',
  '/compare',
  '/history',
  '/cover-letter',
  '/job-match',
  '/linkedin',
  '/resume-builder-v2',
  '/settings',
  '/admin',
];

// Routes that authenticated users should NOT see
const AUTH_ONLY_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token        = request.cookies.get('token')?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname); // Remember where they came from
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/analyze';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};