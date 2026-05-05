import { useState } from 'react'
import { fmtTime, SN } from '../data/plan'

function GymEntry({ entry }) {
  const [expanded, setExpanded] = useState(false)
  const exNames = Object.keys(entry.exercises || {})

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`chip ${entry.sessionType}`} style={{ marginBottom: 0 }}>
            {entry.sessionType.replace('_', ' ').toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)' }}>
            Day {entry.planDay} · {exNames.length} exercises
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)' }}>{entry.date}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 8 }}>
          {exNames.map(name => {
            const d = entry.exercises[name]
            return (
              <div key={name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 0', borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--font-m)', fontSize: 11,
              }}>
                <span style={{ color: 'var(--text-dim)' }}>{name}</span>
                <span style={{ color: 'var(--text)' }}>
                  {d.weight > 0 ? `${d.weight}kg` : 'BW'} × {d.reps}r × {d.sets}s
                </span>
              </div>
            )
          })}
          {entry.notes && (
            <div style={{ marginTop: 6, fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {entry.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RunEntry({ entry }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span className="chip run" style={{ marginBottom: 0 }}>RUN</span>
          {entry.distance && (
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 13, color: 'var(--text)' }}>{entry.distance} mi</span>
          )}
          {entry.timeSeconds && (
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)' }}>{fmtTime(entry.timeSeconds)}</span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)' }}>
          {entry.pace ? `${fmtTime(entry.pace)}/mi` : ''}
          {entry.effort ? ` · RPE ${entry.effort}` : ''}
          {entry.notes ? ` · ${entry.notes}` : ''}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)' }}>{entry.date}</span>
    </div>
  )
}

export default function HistoryFeed({ state }) {
  const [showAll, setShowAll] = useState(false)

  const gymEntries = (state.workoutHistory || []).map(h => ({
    kind: 'gym', date: h.date, sessionType: h.type,
    planDay: h.planDay, exercises: h.exercises, notes: h.notes,
  }))

  const runEntries = (state.runSessionLogs || []).map(r => ({
    kind: 'run', date: r.date, planDay: r.planDay,
    distance: r.distance, timeSeconds: r.timeSeconds,
    pace: r.pace, effort: r.effort, notes: r.notes,
  }))

  const all = [...gymEntries, ...runEntries].sort((a, b) => b.date.localeCompare(a.date))
  const displayed = showAll ? all : all.slice(0, 8)

  if (all.length === 0) {
    return (
      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-muted)', padding: '12px 0' }}>
        No sessions logged yet. Complete and log a session to see your history here.
      </div>
    )
  }

  return (
    <div>
      {displayed.map((entry, i) =>
        entry.kind === 'gym'
          ? <GymEntry key={i} entry={entry} />
          : <RunEntry key={i} entry={entry} />
      )}
      {!showAll && all.length > 8 && (
        <button className="btn sec" style={{ marginTop: 8 }} onClick={() => setShowAll(true)}>
          SHOW ALL {all.length} SESSIONS
        </button>
      )}
    </div>
  )
}
