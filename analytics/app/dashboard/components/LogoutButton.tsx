'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[#888] hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
    >
      Uitloggen
    </button>
  )
}
