import { useState, useEffect, useCallback } from 'react'

const CLIENT_ID = '235259'
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET
const REDIRECT_URI = 'https://drtudor.github.io/operator_app/'

export const MILESTONES = [
  { km: 42.195, label: 'a marathon' },
  { km: 100, label: '100km' },
  { km: 175, label: 'Edinburgh to Newcastle' },
  { km: 340, label: 'Edinburgh to Stoke' },
  { km: 420, label: '10 marathons' },
  { km: 500, label: 'Edinburgh to Bristol' },
  { km: 650, label: 'Edinburgh to London' },
  { km: 1000, label: '1,000km total' },
  { km: 1407, label: "Land's End to John o'Groats" },
  { km: 2000, label: 'Edinburgh to Rome' },
  { km: 4200, label: '100 marathons' },
]

export function getMilestoneInfo(totalKm) {
  const beaten = MILESTONES.filter(m => totalKm >= m.km)
  const next = MILESTONES.find(m => totalKm < m.km)
  const last = beaten[beaten.length - 1] || null
  return { last, next, beaten: beaten.length }
}

function loadTokens() {
  try { return JSON.parse(localStorage.getItem('strava_tokens')) } catch { return null }
}

function loadStats() {
  try { return JSON.parse(localStorage.getItem('strava_stats')) } catch { return null }
}

async function tokenRequest(body) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...body }),
  })
  if (!res.ok) throw new Error(`Strava token error: ${res.status}`)
  return res.json()
}

export function useStrava() {
  const [connected, setConnected] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasSecret = Boolean(CLIENT_SECRET)

  const fetchStats = useCallback(async (accessToken) => {
    setLoading(true)
    setError(null)
    try {
      const athleteRes = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!athleteRes.ok) throw new Error('Failed to fetch athlete')
      const athlete = await athleteRes.json()

      const statsRes = await fetch(`https://www.strava.com/api/v3/athletes/${athlete.id}/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!statsRes.ok) throw new Error('Failed to fetch stats')
      const data = await statsRes.json()

      const stravaStats = {
        totalKm: Math.round((data.all_run_totals?.distance || 0) / 100) / 10,
        ytdKm: Math.round((data.ytd_run_totals?.distance || 0) / 100) / 10,
        recentKm: Math.round((data.recent_run_totals?.distance || 0) / 100) / 10,
        athleteName: athlete.firstname,
        lastFetched: new Date().toISOString(),
      }
      localStorage.setItem('strava_stats', JSON.stringify(stravaStats))
      setStats(stravaStats)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshAndFetch = useCallback(async (tokens) => {
    let { access_token, refresh_token, expires_at } = tokens
    if (Date.now() / 1000 > expires_at - 300) {
      const data = await tokenRequest({ refresh_token, grant_type: 'refresh_token' })
      const newTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      }
      localStorage.setItem('strava_tokens', JSON.stringify(newTokens))
      access_token = data.access_token
    }
    await fetchStats(access_token)
  }, [fetchStats])

  // On mount: check for existing tokens or OAuth callback code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const scope = params.get('scope')

    if (code && scope?.includes('activity:read')) {
      // Clean the URL first
      window.history.replaceState({}, '', window.location.pathname)
      if (!hasSecret) {
        setError('Strava client secret not configured — deploy via GitHub Actions to enable.')
        return
      }
      setLoading(true)
      tokenRequest({ code, grant_type: 'authorization_code' })
        .then(data => {
          const tokens = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at,
          }
          localStorage.setItem('strava_tokens', JSON.stringify(tokens))
          setConnected(true)
          return fetchStats(data.access_token)
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
      return
    }

    const tokens = loadTokens()
    if (tokens) {
      setConnected(true)
      const cached = loadStats()
      if (cached) setStats(cached)
      if (hasSecret) {
        refreshAndFetch(tokens).catch(e => {
          // If refresh fails (e.g. revoked), disconnect
          if (e.message.includes('401') || e.message.includes('token')) {
            localStorage.removeItem('strava_tokens')
            localStorage.removeItem('strava_stats')
            setConnected(false)
            setStats(null)
          }
          setError(e.message)
        })
      }
    }
  }, [fetchStats, refreshAndFetch, hasSecret])

  const connect = () => {
    const url = new URL('https://www.strava.com/oauth/authorize')
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('redirect_uri', REDIRECT_URI)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'activity:read_all')
    url.searchParams.set('approval_prompt', 'auto')
    window.location.href = url.toString()
  }

  const disconnect = () => {
    localStorage.removeItem('strava_tokens')
    localStorage.removeItem('strava_stats')
    setConnected(false)
    setStats(null)
    setError(null)
  }

  const refresh = () => {
    const tokens = loadTokens()
    if (tokens && hasSecret) refreshAndFetch(tokens).catch(e => setError(e.message))
  }

  return { connected, stats, loading, error, hasSecret, connect, disconnect, refresh }
}
