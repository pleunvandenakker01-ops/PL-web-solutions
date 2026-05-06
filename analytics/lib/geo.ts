type GeoResult = { country: string | null; city: string | null }

const cache = new Map<string, GeoResult>()

export async function getGeo(ip: string): Promise<GeoResult> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return { country: null, city: null }
  }

  const cached = cache.get(ip)
  if (cached) return cached

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'PLAnalytics/1.0' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    const data = await res.json()
    const result: GeoResult = {
      country: data.country_name ?? null,
      city: data.city ?? null,
    }
    cache.set(ip, result)
    return result
  } catch {
    return { country: null, city: null }
  }
}
