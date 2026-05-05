import {
  PLAN, MUSCLES, PN, SN, RTN,
  getCurrentDay, getTodayPlanDay, isCompleted, isTodayMissed,
  getPhaseTotal, getPhaseStart, dayTypeLabel, calculateStreak, isDeloadWeek,
} from '../data/plan'
import StravaPanel from './StravaPanel'
import WeeklySummary from './WeeklySummary'
import UpcomingSessions from './UpcomingSessions'

export default function Dashboard({ state, strava, onViewSession }) {
  const cd = getCurrentDay(state)
  const ph = cd.phase
  const phT = getPhaseTotal(ph)
  const phS = getPhaseStart(ph)
  const phPct = Math.round(((cd.dayNum - phS + 1) / phT) * 100)
  const ovPct = Math.round((state.completed.length / PLAN.length) * 100)

  const lw = state.weights.length ? state.weights[state.weights.length - 1] : null
  const cw = lw ? parseFloat(lw.value) : 96.8
  const lost = (96.8 - cw).toFixed(1)

  const recM = [
    ...new Set(
      state.completed
        .slice(-4)
        .map(n => PLAN[n - 1])
        .filter(Boolean)
        .flatMap(d => MUSCLES[d.session.type] || [])
    ),
  ]
  const allM = ['Chest', 'Back', 'Shoulders', 'Quads', 'Hamstrings', 'Glutes', 'Traps', 'Core', 'Cardiovascular']

  const capRuns = PLAN.filter(d => d.phase === 'capacity' && d.session.type === 'run')
  const crDone = capRuns.filter(d => isCompleted(state, d.dayNum)).length
  const streak = calculateStreak(state)
  const deload = isDeloadWeek(state)

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const missed = isTodayMissed(state)
  const tdpDone = isCompleted(state, getTodayPlanDay(state))

  return (
    <div style={{ paddingTop: 0 }}>
      <div style={{ paddingTop: 8, marginBottom: 16 }}>
        <div className="phase-badge">{PN[ph]} — WEEK {cd.phaseWeek}</div>
        <h1>DAN'S<br />OPERATOR<br />SYSTEM</h1>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
          DAY {cd.dayNum} / {PLAN.length} &nbsp;·&nbsp; {dateStr}
          {missed && <span style={{ color: 'rgba(220,100,100,.8)' }}> &nbsp;·&nbsp; MISSED</span>}
        </div>
      </div>

      <div className="sg">
        <div className="sc">
          <div className="label">Overall</div>
          <div className="sv">{ovPct}<span className="su">%</span></div>
          <div className="prog-bar" style={{ marginTop: 5 }}>
            <div className="prog-fill" style={{ width: `${ovPct}%` }} />
          </div>
        </div>
        <div className="sc">
          <div className="label">Phase</div>
          <div className="sv">{phPct}<span className="su">%</span></div>
          <div className="prog-bar" style={{ marginTop: 5 }}>
            <div className="prog-fill g" style={{ width: `${phPct}%` }} />
          </div>
        </div>
        <div className="sc">
          <div className="label">Weight</div>
          <div className="sv">{cw}<span className="su">kg</span></div>
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: parseFloat(lost) > 0 ? 'var(--green)' : 'var(--text-dim)' }}>
            {parseFloat(lost) > 0 ? `↓ ${lost}kg` : 'Goal: 88kg'}
          </div>
        </div>
        <div className="sc">
          <div className="label">Cap Runs</div>
          <div className="sv">{crDone}<span className="su">/24</span></div>
          <div className="prog-bar" style={{ marginTop: 5 }}>
            <div className="prog-fill" style={{ width: `${Math.round(crDone / 24 * 100)}%` }} />
          </div>
        </div>
        <div className="sc">
          <div className="label">Streak</div>
          <div className="sv">{streak}<span className="su">d</span></div>
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: streak >= 7 ? 'var(--green)' : 'var(--text-dim)' }}>
            {streak >= 30 ? 'Month of pain' : streak >= 14 ? 'Fortnight strong' : streak >= 7 ? 'Week warrior' : streak >= 3 ? 'Getting going' : 'Keep it up'}
          </div>
        </div>
        <div className="sc">
          <div className="label">Sessions</div>
          <div className="sv">{state.completed.length}<span className="su">/{PLAN.length}</span></div>
          <div className="prog-bar" style={{ marginTop: 5 }}>
            <div className="prog-fill" style={{ width: `${Math.round(state.completed.length / PLAN.length * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          <div className="label">Today — {dayTypeLabel(cd)}</div>
          {tdpDone
            ? <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--green)' }}>✓ DONE</span>
            : missed
              ? <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'rgba(200,100,100,.8)' }}>MISSED</span>
              : null}
        </div>
        <span className={`chip ${cd.session.type}`}>{cd.session.type.replace('_', ' ').toUpperCase()}</span>
        <div style={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>{dayTypeLabel(cd)}</div>
        {cd.session.duration && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>
            {cd.session.duration} MIN · 120-150 BPM
          </div>
        )}
        {cd.session.distance && (
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>
            {cd.session.distance} MILES
          </div>
        )}
        <button className="btn sec" style={{ marginTop: 10 }} onClick={onViewSession}>
          VIEW SESSION DETAILS →
        </button>
      </div>

      {deload && (
        <div style={{
          background: 'rgba(200,168,75,.06)',
          border: '1px solid var(--amber-dim)',
          borderLeft: '3px solid var(--amber)',
          padding: '12px 14px',
          marginBottom: 10,
        }}>
          <div style={{ fontFamily: 'var(--font-c)', fontSize: 13, fontWeight: 700, letterSpacing: '.15em', color: 'var(--amber)', marginBottom: 6 }}>
            DELOAD WEEK — WEEK {cd.phaseWeek}
          </div>
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Volume and intensity are reduced this week — intentionally. Your body is consolidating the adaptations from the last training block. Resist the urge to add more. The gains happen here.
          </div>
        </div>
      )}

      <WeeklySummary state={state} />

      <UpcomingSessions state={state} onViewSession={onViewSession} />

      <StravaPanel strava={strava} />

      <div className="card">
        <div className="label">Recently Trained</div>
        <div className="badges">
          {allM.map(m => (
            <div key={m} className={`badge${recM.includes(m) ? ' active' : ''}`}>{m}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="label">Phase Roadmap</div>
        <div style={{ marginTop: 8 }}>
          {['capacity', 'velocity', 'outcome'].map(p => {
            const ps = getPhaseStart(p)
            const pt = getPhaseTotal(p)
            const pd = PLAN.slice(ps - 1, ps + pt - 1).filter(d => isCompleted(state, d.dayNum)).length
            const pct = Math.round(pd / pt * 100)
            const isCurr = ph === p
            const clr = p === 'capacity' ? 'var(--amber)' : p === 'velocity' ? 'var(--green)' : 'var(--ruck)'
            return (
              <div key={p} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-c)', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: isCurr ? clr : 'var(--text-dim)' }}>
                    {PN[p]}
                  </span>
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)' }}>{pd}/{pt}</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${pct}%`, background: clr }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ height: 6 }} />
    </div>
  )
}
