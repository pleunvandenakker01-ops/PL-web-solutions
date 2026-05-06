'use client'

import { useRouter } from 'next/navigation'

type Client = { id: string; name: string; domain: string }

type Props = {
  clients: Client[]
  currentClient: string
  currentPeriod: string
}

const PERIODS = [
  { label: 'Vandaag', value: '1' },
  { label: '7 dagen', value: '7' },
  { label: '30 dagen', value: '30' },
  { label: 'Alles', value: 'all' },
]

export default function FilterBar({ clients, currentClient, currentPeriod }: Props) {
  const router = useRouter()

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    params.set(key, value)
    router.push('/dashboard?' + params.toString())
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={currentClient}
        onChange={(e) => navigate('client', e.target.value)}
        className="bg-[#1a1a1a] border border-[#C9A84C]/30 text-[#cccccc] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A84C] cursor-pointer"
      >
        <option value="all">Alle klanten</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.domain}
          </option>
        ))}
      </select>

      <div className="flex gap-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => navigate('period', p.value)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              currentPeriod === p.value
                ? 'bg-[#C9A84C] text-black font-semibold'
                : 'text-[#888] hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
