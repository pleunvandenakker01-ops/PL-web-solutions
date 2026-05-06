import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_COOKIE = 'pl_session'

function expectedToken(): Buffer {
  const secret = process.env.SESSION_SECRET ?? ''
  return createHmac('sha256', secret).update('pl-dashboard-session').digest()
}

function isValidSession(token: string): boolean {
  try {
    const given    = Buffer.from(token, 'hex')
    const expected = expectedToken()
    if (given.length !== expected.length) return false
    return timingSafeEqual(given, expected)
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? ''

  if (!isValidSession(token)) {
    const url = new URL('/login', request.url)
    const dest = request.nextUrl.pathname + request.nextUrl.search
    if (dest !== '/') url.searchParams.set('next', dest)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
