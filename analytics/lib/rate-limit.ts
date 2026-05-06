const store = new Map<string, number[]>()

const WINDOW_MS = 60_000
const LIMIT = 100

export function rateLimit(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const timestamps = (store.get(ip) ?? []).filter((t) => t > cutoff)

  if (timestamps.length >= LIMIT) return false

  timestamps.push(now)
  store.set(ip, timestamps)
  return true
}
