import { useState } from 'react'
import { getMilestoneInfo, MILESTONES } from '../hooks/useStrava'

export default function StravaPanel({ strava }) {
  const { connected, stats, loading, error, hasSecret, connect, disconnect, refresh } = strava

  if (!connected) {
    return (
      <div className="strava-panel">
        <div className="strava-logo">
          <div className="strava-logo-icon">S</div>
          <div className="strava-logo-text">Strava</div>
        </div>
        <div className="label" style={{ marginBottom: 6 }}>Running — {new Date().getFullYear()}</div>
        {!hasSecret && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
            Deploy via GitHub Actions to enable live Strava data
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>
          Connect Strava to track your distance run this year and see milestone comparisons.
        </div>
        {error && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'rgba(220,100,100,.8)', marginBottom: 8 }}>
            {error}
          </div>
        )}
        <button className="btn-strava" onClick={connect}>Connect Strava</button>
      </div>
    )
  }

  const milestone = stats ? getMilestoneInfo(stats.ytdKm) : null
  const year = new Date().getFullYear()

  return (
    <div className="strava-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="strava-logo">
          <div className="strava-logo-icon">S</div>
          <div className="strava-logo-text">Strava</div>
        </div>
        <button className="btn-strava disconnect" onClick={disconnect}>Disconnect</button>
      </div>

      {loading && !stats && (
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-muted)', padding: '8px 0' }}>
          Loading activity data...
        </div>
      )}

      {error && (
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'rgba(220,100,100,.8)', marginBottom: 6 }}>
          {error}
        </div>
      )}

      {stats && (
        <>
          <div style={{ marginTop: 8 }}>
            <div className="label">{year} distance run</div>
            <div className="strava-total-km">
              {stats.ytdKm.toLocaleString()}<span> km</span>
            </div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              {stats.runCount} run{stats.runCount !== 1 ? 's' : ''} this year
            </div>
          </div>

          {milestone?.last && (
            <div className="strava-milestone-past">
              ✓ You've covered {milestone.last.label} ({milestone.last.km} km)
            </div>
          )}

          {milestone?.next && (
            <div className="strava-milestone-next">
              <div className="strava-milestone-label">Next milestone</div>
              <div className="strava-milestone-text">
                {milestone.next.label} — {milestone.next.km} km
              </div>
              <div className="prog-bar">
                <div
                  className="prog-fill"
                  style={{
                    width: `${Math.min(100, Math.round((stats.ytdKm / milestone.next.km) * 100))}%`,
                    background: '#fc4c02',
                  }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
                {(milestone.next.km - stats.ytdKm).toFixed(1)} km to go ·{' '}
                {Math.round((stats.ytdKm / milestone.next.km) * 100)}%
              </div>
            </div>
          )}

          {stats.lastRun && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="label" style={{ marginBottom: 3 }}>Last run</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text)' }}>{stats.lastRun.name}</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                {stats.lastRun.km} km ·{' '}
                {new Date(stats.lastRun.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
              <div className="label">Last 4 weeks</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>
                {stats.recentKm} <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>km</span>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
              <div className="label">Per week avg</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>
                {(stats.recentKm / 4).toFixed(1)} <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>km</span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', marginTop: 8 }}>
            Updated {new Date(stats.lastFetched).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            {' · '}
            <button
              onClick={refresh}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-m)', fontSize: 9, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              {loading ? 'refreshing...' : 'refresh'}
            </button>
          </div>
        </>
      )}

      <MilestoneList totalKm={stats?.ytdKm || 0} year={year} />
    </div>
  )
}

function MilestoneList({ totalKm, year }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-m)', fontSize: 9, cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase', padding: 0 }}
      >
        {expanded ? '▲' : '▼'} {year} milestones
      </button>
      {expanded && (
        <div style={{ marginTop: 6 }}>
          {MILESTONES.map(m => {
            const done = totalKm >= m.km
            return (
              <div key={m.km} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-m)', fontSize: 10 }}>
                <span style={{ color: done ? 'var(--green)' : 'var(--text-muted)' }}>
                  {done ? '✓ ' : '○ '}{m.label}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{m.km} km</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
