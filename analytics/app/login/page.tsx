'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next = '/dashboard' } = use(searchParams)
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, next }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Inloggen mislukt')
        return
      }

      router.push(data.redirect ?? '/dashboard')
    } catch {
      setError('Er ging iets mis. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">

      {/* Subtle radial glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Logo / branding */}
        <div className="text-center mb-10">
          <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] mb-2">
            PL Web Solutions
          </p>
          <h1 className="text-white text-3xl font-bold tracking-[0.12em] uppercase">
            Analytics
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-8">
          <p className="text-[#888] text-sm mb-6 text-center">
            Voer het dashboardwachtwoord in
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mb-2"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#C9A84C] hover:bg-[#F0C060] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-4 py-3 transition-colors tracking-wide"
            >
              {loading ? 'Bezig…' : 'Inloggen →'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
