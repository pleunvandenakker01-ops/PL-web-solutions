import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_COOKIE = 'pl_session'

function makeToken(): string {
  const secret = process.env.SESSION_SECRET ?? ''
  return createHmac('sha256', secret).update('pl-dashboard-session').digest('hex')
}

function passwordsMatch(input: string, expected: string): boolean {
  // Hash both sides to equalise length before constant-time comparison,
  // preventing length-based timing leaks.
  const h1 = createHmac('sha256', 'pw-compare').update(input).digest()
  const h2 = createHmac('sha256', 'pw-compare').update(expected).digest()
  return timingSafeEqual(h1, h2)
}

export async function POST(request: NextRequest) {
  let body: { password?: string; next?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Ongeldig verzoek' }, { status: 400 })
  }

  const { password = '', next = '/dashboard' } = body
  const expected = process.env.DASHBOARD_PASSWORD ?? ''

  if (!expected) {
    return Response.json(
      { error: 'DASHBOARD_PASSWORD is niet ingesteld' },
      { status: 500 }
    )
  }

  if (!passwordsMatch(password, expected)) {
    return Response.json({ error: 'Ongeldig wachtwoord' }, { status: 401 })
  }

  // Sanitise redirect target — only allow relative paths
  const redirect =
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
      ? next
      : '/dashboard'

  const response = NextResponse.json({ ok: true, redirect })
  response.cookies.set(SESSION_COOKIE, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
