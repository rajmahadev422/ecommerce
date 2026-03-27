import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth-token')?.value

  // Redirect unauthenticated users away from profile
  if (pathname === '/profile' && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile',
    // Match /orders and all subroutes but skip static/api
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
