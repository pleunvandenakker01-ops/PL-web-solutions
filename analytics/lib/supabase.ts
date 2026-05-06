import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-side code should use private env vars (no NEXT_PUBLIC_ prefix) so
// the values are read from the runtime environment on every cold start.
// NEXT_PUBLIC_ variants are kept as fallbacks for existing local setups.
let _client: SupabaseClient | null = null

function init(): SupabaseClient {
  if (_client) return _client

  const url =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      `[supabase] env vars missing — ` +
        `SUPABASE_URL=${url ? 'ok' : 'MISSING'}, ` +
        `SUPABASE_SERVICE_ROLE_KEY/ANON_KEY=${key ? 'ok' : 'MISSING'}`
    )
  }

  _client = createClient(url, key)
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (init() as any)[prop]
  },
})
