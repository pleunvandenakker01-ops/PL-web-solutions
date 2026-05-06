/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase'
import FilterBar from './components/FilterBar'
import LogoutButton from './components/LogoutButton'

type SP = Promise<{ [key: string]: string | string[] | undefined }>

// ── Helpers ───────────────────────────────────────────────────────────────────

function sinceIso(period: string): string | null {
  if (period === 'all') return null
  const d = new Date()
  if (period === '1') d.setDate(d.getDate() - 1)
  else if (period === '7') d.setDate(d.getDate() - 7)
  else d.setDate(d.getDate() - 30)
  return d.toISOString()
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function pathOf(url: string) {
  try {
    const u = new URL(url)
    return (u.pathname === '/' ? '/' : u.pathname) + u.search
  } catch {
    return url
  }
}

function shortHost(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams
  const clientId = typeof sp.client === 'string' ? sp.client : 'all'
  const period   = typeof sp.period === 'string' ? sp.period : '30'
  const since    = sinceIso(period)

  function f(q: any): any {
    if (clientId !== 'all') q = q.eq('client_id', clientId)
    if (since)              q = q.gte('created_at', since)
    return q
  }

  // All queries in one round-trip
  const [
    pvCountRes,
    evCountRes,
    ldCountRes,
    fsCountRes,
    clientsRes,
    pvDataRes,
    evDataRes,
    ldDataRes,
    fsDataRes,
  ] = await Promise.all([
    f(supabase.from('pageviews').select('*',        { count: 'exact', head: true })),
    f(supabase.from('events').select('*',           { count: 'exact', head: true })),
    f(supabase.from('leads').select('*',            { count: 'exact', head: true })),
    f(supabase.from('form_submissions').select('*', { count: 'exact', head: true })),
    supabase.from('clients').select('id, name, domain').eq('active', true).order('name'),
    f(supabase.from('pageviews').select('id, url, country, city, referrer, created_at'))
      .order('created_at', { ascending: false })
      .limit(50),
    f(supabase.from('events').select('event_name')),
    f(supabase.from('leads').select('id, name, email, phone, form_name, source_url, created_at'))
      .order('created_at', { ascending: false })
      .limit(30),
    f(supabase.from('form_submissions').select('id, form_name, data, created_at'))
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  const pvCount = pvCountRes.count as number
  const evCount = evCountRes.count as number
  const ldCount = ldCountRes.count as number
  const fsCount = fsCountRes.count as number
  const clients  = (clientsRes.data   ?? []) as { id: string; name: string; domain: string }[]
  const pageviews = (pvDataRes.data   ?? []) as any[]
  const leads     = (ldDataRes.data   ?? []) as any[]
  const formSubs  = (fsDataRes.data   ?? []) as any[]

  // Event breakdown — group by event_name
  const eventMap: Record<string, number> = {}
  for (const e of (evDataRes.data ?? []) as any[]) {
    eventMap[e.event_name] = (eventMap[e.event_name] ?? 0) + 1
  }
  const eventRows = Object.entries(eventMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
  const maxEv = eventRows[0]?.[1] ?? 1

  const stats = [
    { label: 'Pageviews',   value: pvCount ?? 0 },
    { label: 'Events',      value: evCount ?? 0 },
    { label: 'Leads',       value: ldCount ?? 0 },
    { label: 'Formulieren', value: fsCount ?? 0 },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#cccccc]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.25em] mb-0.5">
              PL Web Solutions
            </p>
            <h1 className="text-white text-lg font-bold tracking-[0.1em] uppercase">
              Analytics
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <FilterBar
              clients={clients}
              currentClient={clientId}
              currentPeriod={period}
            />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#111] border border-[#C9A84C]/20 rounded-xl p-6 hover:border-[#C9A84C]/40 transition-colors"
            >
              <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mb-3">
                {s.label}
              </p>
              <p className="text-4xl font-bold text-white tabular-nums">
                {s.value.toLocaleString('nl-NL')}
              </p>
            </div>
          ))}
        </div>

        {/* ── Pageviews + Events ── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Pageviews table */}
          <section className="lg:col-span-3 bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">
                Recente Pageviews
              </h2>
              <span className="text-[#555] text-xs">laatste 50</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <Th>Pagina</Th>
                    <Th>Land / Stad</Th>
                    <Th cls="hidden md:table-cell">Referrer</Th>
                    <Th right>Tijd</Th>
                  </tr>
                </thead>
                <tbody>
                  {pageviews.length === 0 ? (
                    <Empty cols={4} />
                  ) : pageviews.map((pv) => (
                    <tr
                      key={pv.id}
                      className="border-b border-white/5 hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-6 py-3 max-w-[200px]">
                        <span className="text-[#cccccc] truncate block" title={pv.url}>
                          {pathOf(pv.url)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#888] whitespace-nowrap text-xs">
                        {[pv.city, pv.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#888] max-w-[160px] hidden md:table-cell">
                        <span className="truncate block text-xs" title={pv.referrer ?? ''}>
                          {pv.referrer ? shortHost(pv.referrer) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-[#666] text-xs tabular-nums whitespace-nowrap">
                        {fmt(pv.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Events breakdown */}
          <section className="lg:col-span-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">
                Events
              </h2>
              <span className="text-[#555] text-xs">top 15</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              {eventRows.length === 0 ? (
                <p className="text-[#555] text-sm text-center py-6">Geen events</p>
              ) : eventRows.map(([name, count]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#cccccc] text-sm truncate mr-3">{name}</span>
                    <span className="text-white font-bold text-sm tabular-nums shrink-0">
                      {count.toLocaleString('nl-NL')}
                    </span>
                  </div>
                  <div className="h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full"
                      style={{ width: `${(count / maxEv) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Leads ── */}
        <section className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">
              Leads
            </h2>
            <span className="text-[#555] text-xs">laatste 30</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <Th>Naam</Th>
                  <Th>E-mail</Th>
                  <Th cls="hidden md:table-cell">Telefoon</Th>
                  <Th cls="hidden lg:table-cell">Formulier</Th>
                  <Th cls="hidden xl:table-cell">Bron</Th>
                  <Th right>Datum</Th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <Empty cols={6} />
                ) : leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-white/5 hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="px-6 py-3 text-[#cccccc]">{l.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      {l.email ? (
                        <a
                          href={`mailto:${l.email}`}
                          className="text-[#C9A84C] hover:text-[#F0C060] transition-colors"
                        >
                          {l.email}
                        </a>
                      ) : (
                        <span className="text-[#555]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#888] hidden md:table-cell">
                      {l.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-[#888] hidden lg:table-cell">
                      {l.form_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-[#888] text-xs hidden xl:table-cell max-w-[180px]">
                      <span className="truncate block" title={l.source_url ?? ''}>
                        {l.source_url ? pathOf(l.source_url) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-[#666] text-xs tabular-nums whitespace-nowrap">
                      {fmt(l.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Form submissions ── */}
        <section className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">
              Formulier Submissions
            </h2>
            <span className="text-[#555] text-xs">laatste 30</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <Th>Formulier</Th>
                  <Th cls="hidden lg:table-cell">Data</Th>
                  <Th right>Datum</Th>
                </tr>
              </thead>
              <tbody>
                {formSubs.length === 0 ? (
                  <Empty cols={3} />
                ) : formSubs.map((fs) => (
                  <tr
                    key={fs.id}
                    className="border-b border-white/5 hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="px-6 py-3 text-[#cccccc] font-medium">{fs.form_name}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {fs.data ? (
                        <code className="text-[#888] text-xs bg-[#181818] rounded px-2 py-0.5 block truncate max-w-sm">
                          {JSON.stringify(fs.data).slice(0, 100)}
                        </code>
                      ) : (
                        <span className="text-[#555]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right text-[#666] text-xs tabular-nums whitespace-nowrap">
                      {fmt(fs.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

// ── Small shared render helpers ───────────────────────────────────────────────

function Th({
  children,
  right,
  cls,
}: {
  children?: React.ReactNode
  right?: boolean
  cls?: string
}) {
  return (
    <th
      className={`py-3 px-4 text-[#C9A84C] text-[10px] font-medium uppercase tracking-[0.15em] ${
        right ? 'text-right px-6' : 'text-left first:px-6'
      } ${cls ?? ''}`}
    >
      {children}
    </th>
  )
}

function Empty({ cols }: { cols: number }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="px-6 py-10 text-center text-[#444] text-sm"
      >
        Geen data voor deze periode
      </td>
    </tr>
  )
}
