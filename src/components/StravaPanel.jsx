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
        <div className="label" style={{ marginBottom: 6 }}>Running Total</div>
        {!hasSecret && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
            Deploy via GitHub Actions to enable live Strava data
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>
          Connect Strava to track your total distance run and see fun milestone comparisons.
        </div>
        {error && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'rgba(220,100,100,.8)', marginBottom: 8 }}>
            {error}
          </div>
        )}
        <button className="btn-strava" onClick={connect}>
          Connect Strava
        </button>
      </div>
    )
  }

  const milestone = stats ? getMilestoneInfo(stats.totalKm) : null

  return (
    <div className="strava-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="strava-logo">
          <div className="strava-logo-icon">S</div>
          <div className="strava-logo-text">Strava{stats?.athleteName ? ` — ${stats.athleteName}` : ''}</div>
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
            <div className="label">All-time distance run</div>
            <div className="strava-total-km">
              {stats.totalKm.toLocaleString()}<span> km</span>
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
                    width: `${Math.min(100, Math.round((stats.totalKm / milestone.next.km) * 100))}%`,
                    background: '#fc4c02',
                  }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
                {(milestone.next.km - stats.totalKm).toFixed(1)} km to go ·{' '}
                {Math.round((stats.totalKm / milestone.next.km) * 100)}%
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
              <div className="label">This year</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>
                {stats.ytdKm} <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>km</span>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
              <div className="label">Recent (4 wk)</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>
                {stats.recentKm} <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>km</span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', marginTop: 8 }}>
            Updated {stats.lastFetched ? new Date(stats.lastFetched).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
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

      <MilestoneList totalKm={stats?.totalKm || 0} />
    </div>
  )
}

function MilestoneList({ totalKm }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-m)', fontSize: 9, cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase', padding: 0 }}
      >
        {expanded ? '▲' : '▼'} All milestones
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

// useState needs to be imported — add it here
import { useState } from 'react'
