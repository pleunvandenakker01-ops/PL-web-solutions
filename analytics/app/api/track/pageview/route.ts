import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'
import { corsHeaders, corsOptions } from '@/lib/cors'
import { getGeo } from '@/lib/geo'

export function OPTIONS() {
  return corsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    if (!rateLimit(ip)) {
      return Response.json(
        { error: 'Too many requests' },
        { status: 429, headers: corsHeaders }
      )
    }

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Invalid JSON' },
        { status: 400, headers: corsHeaders }
      )
    }

    const { client_id, url, referrer, session_id } = body as {
      client_id?: string
      url?: string
      referrer?: string
      session_id?: string
    }

    if (!client_id || !url) {
      return Response.json(
        { error: 'client_id and url are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .eq('active', true)
      .single()

    if (!client) {
      return Response.json(
        { error: 'Invalid or inactive client_id' },
        { status: 403, headers: corsHeaders }
      )
    }

    const { country, city } = await getGeo(ip)

    const { error } = await supabase.from('pageviews').insert({
      client_id,
      url,
      referrer: referrer ?? null,
      user_agent: request.headers.get('user-agent'),
      country,
      city,
      session_id: session_id ?? null,
    })

    if (error) {
      return Response.json(
        { error: 'Failed to save pageview' },
        { status: 500, headers: corsHeaders }
      )
    }

    return Response.json({ ok: true }, { headers: corsHeaders })
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
