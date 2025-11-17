import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: Object.fromEntries(request.headers) });
  const pathname = request.nextUrl.pathname;

  if (session && pathname === '/cont') {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  if (!session && pathname === '/profile') {
    return NextResponse.redirect(new URL('/cont', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/cont', '/profile'],
};
