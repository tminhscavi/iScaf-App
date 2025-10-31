import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, protectedRoutes } from './constants/route';
// import { jwtVerify } from 'jose'

// Define protected and public routes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Define protected routes
  const isProtectedPath = protectedRoutes.some((path) =>
    pathname.startsWith(path),
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (token) {
    try {
      // const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      // const { payload } = await jwtVerify(token, secret);

      // Add member data to request headers for use in API routes/pages
      const requestHeaders = new Headers(request.headers);
      // requestHeaders.set('x-member-data', JSON.stringify(payload.member));

      // If authenticated user tries to access login page, redirect to dashboard
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token - clear cookie and redirect to login if on protected path
      console.error('JWT verification failed:', error);

      const response = isProtectedPath
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next();

      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};

// Helper function to get user from request headers in server components
export function getUserFromHeaders(headers: Headers) {
  const userId = headers.get('x-user-id');
  const userRole = headers.get('x-user-role');

  if (!userId) return null;

  return {
    id: userId,
    role: userRole || 'user',
  };
}
