import { useEffect, useRef } from 'react'
import { PLAN, PN, getTodayPlanDay, isCompleted, getPhaseTotal, getPhaseStart } from '../data/plan'

const TYPE_BG = {
  upper:    'rgba(90,150,200,.18)',
  se_upper: 'rgba(90,150,200,.10)',
  lower:    'rgba(61,158,114,.18)',
  se_lower: 'rgba(61,158,114,.10)',
  run:      'rgba(200,168,75,.18)',
  ruck:     'rgba(180,112,60,.18)',
  rest:     'rgba(255,255,255,.02)',
  deload:   'rgba(255,255,255,.02)',
}
const TYPE_BORDER = {
  upper:    'rgba(90,150,200,.4)',
  se_upper: 'rgba(90,150,200,.22)',
  lower:    'rgba(61,158,114,.4)',
  se_lower: 'rgba(61,158,114,.22)',
  run:      'rgba(200,168,75,.4)',
  ruck:     'rgba(180,112,60,.4)',
  rest:     'var(--border)',
  deload:   'var(--border)',
}
const TYPE_TEXT = {
  upper:    '#5a96c8',
  se_upper: 'rgba(90,150,200,.65)',
  lower:    '#3d9e72',
  se_lower: 'rgba(61,158,114,.65)',
  run:      '#c8a84b',
  ruck:     '#b4703c',
  rest:     '#334050',
  deload:   '#334050',
}
const PHASE_COLOR = {
  capacity: 'var(--amber)',
  velocity: 'var(--green)',
  outcome:  'var(--ruck)',
}
const LEGEND = [
  { label: 'Upper',  color: '#5a96c8' },
  { label: 'Lower',  color: '#3d9e72' },
  { label: 'Run',    color: '#c8a84b' },
  { label: 'Ruck',   color: '#b4703c' },
  { label: 'Rest',   color: '#334050' },
]

function tileAbbr(d) {
  const s = d.session
  if (s.type === 'run') {
    return { lss: 'LSS', tempo: 'TPO', hill: 'HILL', '800s': '800s', long: 'LONG', fartlek: 'FK' }[s.runType] || 'RUN'
  }
  return { upper: 'UPPER', lower: 'LOWER', se_upper: 'SE-U', se_lower: 'SE-L', ruck: 'RUCK', rest: 'REST', deload: 'REST' }[s.type] || s.type
}

export default function Plan({ state, onViewDay }) {
  const todayRef = useRef(null)
  const tdp = getTodayPlanDay(state)

  useEffect(() => {
    const el = todayRef.current
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  // Group PLAN into phase → week → days
  const grouped = {}
  PLAN.forEach(d => {
    if (!grouped[d.phase]) grouped[d.phase] = {}
    if (!grouped[d.phase][d.phaseWeek]) grouped[d.phase][d.phaseWeek] = []
    grouped[d.phase][d.phaseWeek].push(d)
  })

  return (
    <div>
      <div style={{ paddingTop: 8, marginBottom: 16 }}>
        <h1>FULL PLAN</h1>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
          {PLAN.length} DAYS · CAPACITY → VELOCITY → OUTCOME
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          {LEGEND.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, background: l.color, opacity: 0.7, borderRadius: 1 }} />
              <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.04em' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {['capacity', 'velocity', 'outcome'].map(phase => {
        const weeks = grouped[phase]
        if (!weeks) return null
        const phaseColor = PHASE_COLOR[phase]
        const pt = getPhaseTotal(phase)
        const ps = getPhaseStart(phase)
        const pDone = PLAN.slice(ps - 1, ps + pt - 1).filter(d => isCompleted(state, d.dayNum)).length
        const pPct = Math.round(pDone / pt * 100)

        return (
          <div key={phase} style={{ marginBottom: 24 }}>
            {/* Phase header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 10,
              marginBottom: 12,
              borderBottom: `1px solid ${phaseColor}33`,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-c)',
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: '.14em',
                  color: phaseColor,
                }}>
                  {PN[phase]}
                </div>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                  {pt} days · 8 weeks · {pDone} done
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 20, color: phaseColor, lineHeight: 1 }}>
                  {pPct}<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>%</span>
                </div>
                <div style={{ width: 56, marginTop: 5 }}>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${pPct}%`, background: phaseColor }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Weeks */}
            {Object.entries(weeks).map(([wk, days]) => {
              const weekNum = parseInt(wk)
              const isDeload = days.some(d => d.isDeload)
              const weekDone = days.filter(d => isCompleted(state, d.dayNum)).length
              const hasToday = days.some(d => d.dayNum === tdp)

              return (
                <div key={wk} style={{ marginBottom: 14 }}>
                  {/* Week label row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{
                        fontFamily: 'var(--font-m)',
                        fontSize: 9,
                        letterSpacing: '.08em',
                        color: hasToday ? 'var(--amber)' : 'var(--text-dim)',
                      }}>
                        WEEK {weekNum}
                      </span>
                      {isDeload && (
                        <span style={{
                          fontFamily: 'var(--font-m)',
                          fontSize: 7,
                          color: 'var(--amber)',
                          border: '1px solid var(--amber-dim)',
                          padding: '1px 4px',
                          letterSpacing: '.06em',
                        }}>
                          DELOAD
                        </span>
                      )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)' }}>
                      {weekDone}/{days.length}
                    </span>
                  </div>

                  {/* 7-tile row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {days.map(d => {
                      const done = isCompleted(state, d.dayNum)
                      const isToday = d.dayNum === tdp
                      const t = d.session.type
                      const abbr = tileAbbr(d)
                      const isRest = t === 'rest' || t === 'deload'

                      return (
                        <div
                          key={d.dayNum}
                          ref={isToday ? todayRef : null}
                          onClick={() => onViewDay(d.dayNum)}
                          style={{
                            background: isRest ? TYPE_BG.rest : TYPE_BG[t],
                            border: `1px solid ${isToday ? 'var(--amber)' : done ? TYPE_BORDER[t] : 'var(--border)'}`,
                            borderRadius: 2,
                            padding: '5px 2px 4px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: 52,
                            opacity: done && !isToday ? 0.55 : 1,
                            transition: 'opacity .15s',
                            boxSizing: 'border-box',
                          }}
                        >
                          {/* Day number */}
                          <div style={{
                            fontFamily: 'var(--font-m)',
                            fontSize: 7,
                            color: 'var(--text-muted)',
                            lineHeight: 1,
                          }}>
                            {d.dayNum}
                          </div>

                          {/* Session abbreviation */}
                          <div style={{
                            fontFamily: 'var(--font-m)',
                            fontSize: 7,
                            color: isRest ? TYPE_TEXT.rest : TYPE_TEXT[t],
                            letterSpacing: '.02em',
                            textAlign: 'center',
                            lineHeight: 1.25,
                            fontWeight: isToday ? 700 : 400,
                          }}>
                            {abbr}
                          </div>

                          {/* Status indicator */}
                          <div style={{ height: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isToday ? (
                              <div style={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                background: 'var(--amber)',
                              }} />
                            ) : done ? (
                              <span style={{ color: TYPE_TEXT[t], fontSize: 8, lineHeight: 1 }}>✓</span>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <div style={{ height: 8 }} />
    </div>
  )
}
