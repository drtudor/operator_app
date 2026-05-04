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
  { km: 1000, label: '1,000km in a year' },
  { km: 1407, label: "Land's End to John o'Groats" },
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
      // Fetch all runs since Jan 1 of this year
      const startOfYear = Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000)
      let page = 1
      let allActivities = []

      while (true) {
        const res = await fetch(
          `https://www.strava.com/api/v3/athlete/activities?after=${startOfYear}&per_page=200&page=${page}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        if (!res.ok) throw new Error(`Strava API error: ${res.status}`)
        const batch = await res.json()
        if (!batch.length) break
        allActivities = [...allActivities, ...batch]
        if (batch.length < 200) break
        page++
      }

      const runs = allActivities.filter(a => a.type === 'Run' || a.sport_type === 'Run')

      const ytdKm = Math.round(runs.reduce((sum, a) => sum + a.distance, 0) / 100) / 10

      const recentCutoff = Date.now() - 28 * 24 * 60 * 60 * 1000
      const recentKm = Math.round(
        runs
          .filter(a => new Date(a.start_date).getTime() > recentCutoff)
          .reduce((sum, a) => sum + a.distance, 0) / 100
      ) / 10

      const lastRun = runs[0]
        ? {
            name: runs[0].name,
            date: runs[0].start_date,
            km: Math.round(runs[0].distance / 100) / 10,
          }
        : null

      const stravaStats = {
        ytdKm,
        recentKm,
        runCount: runs.length,
        lastRun,
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const scope = params.get('scope')

    if (code && scope?.includes('activity:read')) {
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
