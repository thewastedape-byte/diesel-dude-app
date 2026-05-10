import { NextRequest, NextResponse } from 'next/server'

// Maintenance mode - only allow admin emails through
// Set to false when ready to launch publicly
const MAINTENANCE_MODE = false

export function middleware(req: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Always allow: maintenance page, static assets, api routes
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/diagrams') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check for admin bypass cookie
  const adminCookie = req.cookies.get('dd_admin_bypass')
  if (adminCookie?.value === 'wastedape2026') {
    return NextResponse.next()
  }

  // Everyone else → maintenance page
  return NextResponse.redirect(new URL('/maintenance', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
