import { PLAN, getTodayPlanDay, isCompleted, dayTypeLabel } from '../data/plan'

const TYPE_COLOR = {
  upper: 'var(--amber)', lower: 'var(--green)', run: 'var(--blue)',
  ruck: 'var(--ruck)', se_upper: 'var(--amber)', se_lower: 'var(--green)',
  rest: 'var(--border-hi)', deload: 'var(--border-hi)',
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function WeeklySummary({ state }) {
  const todayDay = getTodayPlanDay(state)
  const todayEntry = PLAN[todayDay - 1]
  if (!todayEntry) return null

  const weekStart = todayDay - todayEntry.weekDay + 1
  const weekDays = PLAN.slice(Math.max(0, weekStart - 1), weekStart + 6).filter(Boolean)

  const trainDays = weekDays.filter(d => d.session.type !== 'rest' && d.session.type !== 'deload')
  const done = trainDays.filter(d => isCompleted(state, d.dayNum)).length

  return (
    <div className="card">
      <div className="card-hdr">
        <div className="label">This Week — Week {todayEntry.phaseWeek}</div>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-dim)' }}>
          {done}/{trainDays.length} sessions
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {weekDays.map(d => {
          const isToday = d.dayNum === todayDay
          const isDone = isCompleted(state, d.dayNum)
          const isRest = d.session.type === 'rest' || d.session.type === 'deload'
          const color = TYPE_COLOR[d.session.type]
          const isFuture = d.dayNum > todayDay

          return (
            <div key={d.dayNum} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                height: 28,
                background: isDone ? color : isRest ? 'var(--border)' : isFuture ? 'var(--surface)' : 'rgba(200,60,60,.15)',
                border: isToday ? '1px solid var(--amber)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isDone && !isRest && (
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--bg)', fontWeight: 700 }}>✓</span>
                )}
                {isRest && (
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 7, color: 'var(--text-muted)' }}>REST</span>
                )}
                {!isDone && !isRest && !isFuture && (
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 7, color: 'rgba(200,100,100,.7)' }}>✕</span>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-m)',
                fontSize: 8,
                color: isToday ? 'var(--amber)' : 'var(--text-muted)',
                letterSpacing: '.05em',
              }}>
                {DAY_LETTERS[d.weekDay - 1]}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {weekDays
          .filter(d => d.session.type !== 'rest' && d.session.type !== 'deload')
          .map(d => {
            const isDone = isCompleted(state, d.dayNum)
            const isToday = d.dayNum === todayDay
            return (
              <div key={d.dayNum} style={{
                fontFamily: 'var(--font-m)',
                fontSize: 9,
                color: isDone ? 'var(--green)' : isToday ? 'var(--amber)' : 'var(--text-muted)',
                letterSpacing: '.06em',
              }}>
                {isToday ? '→ ' : isDone ? '✓ ' : '○ '}{dayTypeLabel(d)}
              </div>
            )
          })}
      </div>
    </div>
  )
}
