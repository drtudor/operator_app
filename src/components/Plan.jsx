import { useEffect, useRef } from 'react'
import { PLAN, PN, getPhaseTotal, getTodayPlanDay, isCompleted, dayTypeLabel } from '../data/plan'

export default function Plan({ state, onViewDay }) {
  const todayRef = useRef(null)
  const tdp = getTodayPlanDay(state)

  useEffect(() => {
    const el = todayRef.current
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  let currentPhase = ''
  let currentWeek = 0
  const rows = []

  PLAN.forEach(d => {
    if (d.phase !== currentPhase) {
      const pt = getPhaseTotal(d.phase)
      const clr = d.phase === 'capacity' ? 'var(--amber)' : d.phase === 'velocity' ? 'var(--green)' : 'var(--ruck)'
      rows.push(
        <div key={`ph-${d.phase}`} className="phase-hdr">
          <span className="phase-hdr-label" style={{ color: clr }}>{PN[d.phase]}</span>
          <span className="phase-hdr-sub">{pt} days · 8 weeks</span>
        </div>
      )
      currentPhase = d.phase
      currentWeek = 0
    }

    if (d.phaseWeek !== currentWeek) {
      currentWeek = d.phaseWeek
      rows.push(
        <div key={`wk-${d.phase}-${d.phaseWeek}`} className="week-hdr">
          Week {d.phaseWeek}{d.isDeload ? ' — DELOAD' : ''}
        </div>
      )
    }

    const done = isCompleted(state, d.dayNum)
    const isT = d.dayNum === tdp
    const det = d.session.duration
      ? `${d.session.duration} min`
      : d.session.distance
        ? `${d.session.distance} mi`
        : ''

    rows.push(
      <div
        key={d.dayNum}
        ref={isT ? todayRef : null}
        className={`day-row${isT ? ' today' : ''}${done ? ' done' : ''}`}
        onClick={() => onViewDay(d.dayNum)}
      >
        <span className="day-num">{d.dayNum}</span>
        <span className={`day-dot dot-${d.session.type}`} />
        <div className="day-info">
          <div className="day-name">{dayTypeLabel(d)}</div>
          {det && <div className="day-det">{det}</div>}
        </div>
        {done
          ? <span className="day-check">✓</span>
          : isT
            ? <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--amber)' }}>TODAY</span>
            : null}
      </div>
    )
  })

  return (
    <div>
      <div style={{ paddingTop: 8, marginBottom: 14 }}>
        <h1>FULL PLAN</h1>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
          {PLAN.length} DAYS · CAPACITY → VELOCITY → OUTCOME
        </div>
      </div>
      {rows}
      <div style={{ height: 8 }} />
    </div>
  )
}
