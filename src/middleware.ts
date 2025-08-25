import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { jwtVerify } from 'jose'

// Define protected and public routes
const protectedRoutes = ['/home'];
const publicRoutes = ['/login', '/register'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === '/',
  );


  // Check if current route is auth route (login/register)
  const isAuthRoute = authRoutes.includes(pathname);

  // If no token and trying to access protected route
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      // Verify JWT token (replace with your secret)
      // const secret = new TextEncoder().encode(
      //   process.env.JWT_SECRET || 'your-secret-key'
      // )

      // const { payload } = await jwtVerify(token, secret)

      // Add user info to request headers (optional)
      const requestHeaders = new Headers(request.headers);
      // requestHeaders.set('x-user-id', payload.userId as string)
      // requestHeaders.set('x-user-role', payload.role as string || 'user')

      // If authenticated user tries to access auth pages, redirect to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Continue with modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token - clear cookie and redirect to login
      console.error('Token verification failed:', error);

      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      // For non-protected routes, just clear the invalid cookie
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Allow access to public routes
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
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
