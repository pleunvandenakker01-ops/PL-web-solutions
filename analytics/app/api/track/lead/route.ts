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

  const { client_id, name, email, phone, source_url, form_name } = body as {
    client_id?: string
    name?: string
    email?: string
    phone?: string
    source_url?: string
    form_name?: string
  }

  if (!client_id) {
    return Response.json(
      { error: 'client_id is required' },
      { status: 400, headers: corsHeaders }
    )
  }

  if (!email && !phone) {
    return Response.json(
      { error: 'At least email or phone is required' },
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

  const { error } = await supabase.from('leads').insert({
    client_id,
    name: name ?? null,
    email: email ?? null,
    phone: phone ?? null,
    source_url: source_url ?? null,
    form_name: form_name ?? null,
  })

  if (error) {
    return Response.json(
      { error: 'Failed to save lead' },
      { status: 500, headers: corsHeaders }
    )
  }

  return Response.json({ ok: true }, { headers: corsHeaders })
}
