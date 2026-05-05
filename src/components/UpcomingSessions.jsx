import { PLAN, SN, PN, getTodayPlanDay, isCompleted, dayTypeLabel } from '../data/plan'

const TYPE_COLOR = {
  upper: 'var(--blue)',
  lower: 'var(--green)',
  se_upper: 'var(--blue)',
  se_lower: 'var(--green)',
  run: 'var(--amber)',
  ruck: 'var(--ruck)',
  rest: 'var(--text-muted)',
  deload: 'var(--text-muted)',
}

export default function UpcomingSessions({ state, onViewSession }) {
  const todayPD = getTodayPlanDay(state)
  const upcoming = []

  for (let i = todayPD - 1; i < PLAN.length && upcoming.length < 5; i++) {
    const d = PLAN[i]
    if (!d) break
    upcoming.push(d)
  }

  if (upcoming.length === 0) return null

  return (
    <div className="card">
      <div className="label" style={{ marginBottom: 10 }}>Upcoming Sessions</div>
      {upcoming.map((d, idx) => {
        const done = isCompleted(state, d.dayNum)
        const isToday = idx === 0
        const color = TYPE_COLOR[d.session.type] || 'var(--text-dim)'
        return (
          <div
            key={d.dayNum}
            onClick={() => onViewSession?.(d.dayNum)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              borderBottom: idx < upcoming.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: onViewSession ? 'pointer' : 'default',
              opacity: done ? 0.5 : 1,
            }}
          >
            {/* Day number indicator */}
            <div style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isToday ? color : 'var(--surface)',
              border: `1px solid ${isToday ? color : 'var(--border)'}`,
              fontFamily: 'var(--font-m)',
              fontSize: 11,
              color: isToday ? '#0a1218' : 'var(--text-dim)',
              flexShrink: 0,
            }}>
              {d.dayNum}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: 12,
                  color: isToday ? color : 'var(--text-dim)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {dayTypeLabel(d)}
                </span>
                {isToday && (
                  <span style={{
                    fontFamily: 'var(--font-m)',
                    fontSize: 8,
                    letterSpacing: '.1em',
                    color: color,
                    border: `1px solid ${color}`,
                    padding: '1px 5px',
                  }}>TODAY</span>
                )}
                {done && (
                  <span style={{ color: 'var(--green)', fontSize: 10 }}>✓</span>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-m)',
                fontSize: 10,
                color: 'var(--text-muted)',
                marginTop: 2,
              }}>
                {PN[d.phase]} · Week {d.phaseWeek}
                {d.session.duration ? ` · ${d.session.duration}min` : ''}
                {d.session.distance ? ` · ${d.session.distance}mi` : ''}
              </div>
            </div>

            {onViewSession && (
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>›</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
