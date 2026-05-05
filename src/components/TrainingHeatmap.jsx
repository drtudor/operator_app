import { todayISO } from '../data/plan'

const TYPE_COLOR = {
  upper:    'rgba(90,150,200,.75)',
  se_upper: 'rgba(90,150,200,.45)',
  lower:    'rgba(61,158,114,.75)',
  se_lower: 'rgba(61,158,114,.45)',
  run:      'rgba(200,168,75,.8)',
  ruck:     'rgba(180,112,60,.8)',
}
const LEGEND = [
  ['Upper',  TYPE_COLOR.upper],
  ['Lower',  TYPE_COLOR.lower],
  ['Run',    TYPE_COLOR.run],
  ['Ruck',   TYPE_COLOR.ruck],
  ['Missed', 'rgba(200,80,80,.5)'],
]
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function isoFromDate(d) {
  return d.toISOString().slice(0, 10)
}

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export default function TrainingHeatmap({ state }) {
  const today = todayISO()
  const startDate = state.startDate

  // Build lookup maps from logged sessions
  const dateType = {}
  ;(state.workoutHistory || []).forEach(h => { dateType[h.date] = h.type })
  ;(state.runSessionLogs || []).forEach(r => { if (!dateType[r.date]) dateType[r.date] = 'run' })
  ;(state.ruckLogs || []).forEach(r => { if (!dateType[r.date]) dateType[r.date] = 'ruck' })
  const missed = new Set(state.missedDates || [])

  // Align grid start to Monday on or before startDate
  const progStart = new Date(startDate + 'T00:00:00')
  const dow = progStart.getDay() // 0=Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const gridStart = addDays(progStart, mondayOffset)

  // Align grid end to Sunday on or after today
  const todayDate = new Date(today + 'T00:00:00')
  const edow = todayDate.getDay()
  const gridEnd = addDays(todayDate, edow === 0 ? 0 : 7 - edow)

  // Build week columns (each = 7 ISO date strings, Mon → Sun)
  const weeks = []
  let cur = new Date(gridStart)
  while (cur <= gridEnd) {
    const week = []
    for (let d = 0; d < 7; d++) {
      week.push(isoFromDate(cur))
      cur = addDays(cur, 1)
    }
    weeks.push(week)
  }
  const displayWeeks = weeks.slice(-24) // cap at 24 weeks

  const getCellColor = (date) => {
    if (date > today) return 'rgba(255,255,255,.03)'
    if (date < startDate) return 'transparent'
    if (missed.has(date)) return 'rgba(200,80,80,.5)'
    const t = dateType[date]
    if (t) return TYPE_COLOR[t] || 'rgba(255,255,255,.2)'
    return 'rgba(26,40,48,.8)' // within programme, nothing logged
  }

  // Month labels: find where months start in the week columns
  const monthLabels = []
  displayWeeks.forEach((week, wi) => {
    const firstOfWeek = week[0]
    const d = new Date(firstOfWeek + 'T00:00:00')
    if (d.getDate() <= 7) {
      monthLabels.push({ wi, label: d.toLocaleString('en-GB', { month: 'short' }) })
    }
  })

  return (
    <div>
      {/* Month labels */}
      <div style={{ display: 'flex', paddingLeft: 16, marginBottom: 3, minWidth: 'min-content' }}>
        {displayWeeks.map((_, wi) => {
          const ml = monthLabels.find(m => m.wi === wi)
          return (
            <div key={wi} style={{ width: 13, flexShrink: 0, fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--text-muted)' }}>
              {ml ? ml.label : ''}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 2 }}>
          {DAY_LABELS.map((d, i) => (
            <div key={i} style={{ height: 11, width: 8, fontFamily: 'var(--font-m)', fontSize: 7, color: 'var(--text-muted)', lineHeight: '11px' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Grid */}
        {displayWeeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {week.map(date => (
              <div
                key={date}
                title={date}
                style={{
                  width: 11,
                  height: 11,
                  background: getCellColor(date),
                  borderRadius: 2,
                  flexShrink: 0,
                  border: date === today ? '1px solid rgba(200,168,75,.6)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        {LEGEND.map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.04em' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
