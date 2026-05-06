import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'
import { corsHeaders, corsOptions } from '@/lib/cors'

export function OPTIONS() {
  return corsOptions()
}

export async function POST(request: NextRequest) {
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

  const { client_id, form_name, data } = body as {
    client_id?: string
    form_name?: string
    data?: Record<string, unknown>
  }

  if (!client_id || !form_name) {
    return Response.json(
      { error: 'client_id and form_name are required' },
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

  const { error } = await supabase.from('form_submissions').insert({
    client_id,
    form_name,
    data: data ?? null,
  })

  if (error) {
    return Response.json(
      { error: 'Failed to save form submission' },
      { status: 500, headers: corsHeaders }
    )
  }

  return Response.json({ ok: true }, { headers: corsHeaders })
}
