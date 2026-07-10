import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  // Update the session if it exists (refreshes expiration)
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Exclude login paths
  if (pathname === '/admin/login' || pathname === '/login') {
    return response;
  }

  // Define protected routes and their required roles
  const protectedRoutes = [
    { prefix: '/buyer', roles: ['BUYER'] },
    { prefix: '/seller', roles: ['OWNER', 'SELLER'] }, // OWNER mapped to SELLER in Seller model
    { prefix: '/agent', roles: ['AGENT'] },
    { prefix: '/builder', roles: ['BUILDER'] },
    { prefix: '/corporate', roles: ['CORPORATE'] },
    { prefix: '/admin', roles: ['ADMIN', 'SUPER_ADMIN'] },
    { prefix: '/profile', roles: ['BUYER', 'OWNER', 'SELLER', 'AGENT', 'BUILDER', 'CORPORATE', 'ADMIN', 'SUPER_ADMIN'] }
  ];

  // Check if current path requires protection
  const routeMatch = protectedRoutes.find(route => pathname.startsWith(route.prefix));

  if (routeMatch) {
    const sessionCookie = request.cookies.get('session')?.value;
    
    // Redirect to login if not authenticated
    if (!sessionCookie) {
      const loginUrl = new URL(pathname.startsWith('/admin') ? '/admin/login' : '/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session
    const payload = await decrypt(sessionCookie);
    if (!payload) {
      const loginUrl = new URL(pathname.startsWith('/admin') ? '/admin/login' : '/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check authorization (roles)
    const userRole = payload.role as string;
    
    // Allow SUPER_ADMIN everywhere except profile maybe? Actually SUPER_ADMIN unrestricted.
    if (userRole === 'SUPER_ADMIN') {
      return response;
    }

    // Specifically block access if not in roles
    if (!routeMatch.roles.includes(userRole)) {
      return NextResponse.rewrite(new URL('/403', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/buyer/:path*',
    '/seller/:path*',
    '/agent/:path*',
    '/builder/:path*',
    '/corporate/:path*',
    '/admin/:path*',
    '/profile/:path*',
  ],
};
