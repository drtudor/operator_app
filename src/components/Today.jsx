import { useState } from 'react'
import {
  PLAN, EXERCISES, NO_GYM_EXERCISES, SN, RTN, PN,
  getTodayPlanDay, isTodayMissed, isCompleted,
  getLastLog, getProgression, fmtWt, fmtTime, parseTime, parseRestSeconds,
} from '../data/plan'
import RestTimer, { useRestTimer } from './RestTimer'

const GYM_TYPES = ['upper', 'lower', 'se_upper', 'se_lower']

// ── Exercise table with history + tappable rest cells ──────────────────────
function ExerciseTableWithHistory({ exList, isDeload, state, onStartTimer }) {
  return (
    <div className="ex-list">
      <div className="ex-hdr">
        <span className="ex-hlabel">Exercise</span>
        <span className="ex-hlabel">Sets</span>
        <span className="ex-hlabel">Reps</span>
        <span className="ex-hlabel" style={{ color: onStartTimer ? 'var(--blue)' : undefined }}>
          {onStartTimer ? 'Rest ▶' : 'Rest'}
        </span>
      </div>
      {exList.map(ex => {
        const ll = getLastLog(state, ex.name)
        const prog = ll ? getProgression(ex, ll) : null
        return (
          <div key={ex.name} className="ex-row">
            <div>
              <div className="ex-name">{ex.name}</div>
              {ex.note && <div className="ex-note">{ex.note}</div>}
              {ll && <div className="ex-hist">Last: {fmtWt(ll)} × {ll.reps}r × {ll.sets}s</div>}
              {prog && <div className="ex-prog" style={{ color: prog.color }}>→ {prog.msg}</div>}
            </div>
            <div className="ex-d">{isDeload ? Math.max(2, ex.sets - 1) : ex.sets}<span>sets</span></div>
            <div className="ex-d">{ex.reps}<span>reps</span></div>
            <div
              className="ex-d"
              onClick={() => onStartTimer?.(parseRestSeconds(ex.rest))}
              style={{ cursor: onStartTimer ? 'pointer' : 'default', color: onStartTimer ? 'var(--blue)' : undefined }}
              title={onStartTimer ? 'Tap to start rest timer' : undefined}
            >
              {ex.rest}<span>rest</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Gym log form ────────────────────────────────────────────────────────────
function LogForm({ exList, planDayNum, state, noGym, onSave }) {
  const [show, setShow] = useState(false)
  const [notes, setNotes] = useState('')
  const [inputs, setInputs] = useState(() => {
    const result = {}
    exList.forEach(ex => {
      const ll = getLastLog(state, ex.name)
      result[ex.name] = {
        weight: ll ? String(ll.weight) : '',
        reps: ll ? String(ll.reps) : '',
        sets: ll ? String(ll.sets) : String(ex.sets),
      }
    })
    return result
  })

  const setField = (name, field, val) =>
    setInputs(prev => ({ ...prev, [name]: { ...prev[name], [field]: val } }))

  const handleSave = () => {
    const exercises = {}
    exList.forEach(ex => {
      const inp = inputs[ex.name]
      const w = parseFloat(inp.weight)
      const r = parseInt(inp.reps)
      const s = parseInt(inp.sets)
      if (r && s) exercises[ex.name] = { weight: w || 0, reps: r, sets: s }
    })
    const fullNotes = noGym ? `[Home workout]${notes ? ' — ' + notes : ''}` : notes
    onSave(planDayNum, exercises, fullNotes)
    setShow(false)
  }

  return (
    <>
      {show && (
        <div style={{ marginTop: 6 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
            <div className="label" style={{ marginBottom: 8 }}>Log Session Weights</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 48px 40px', gap: 4, paddingBottom: 6, borderBottom: '1px solid var(--border-hi)', marginBottom: 4 }}>
              <span className="label" style={{ margin: 0, fontSize: 8 }}>Exercise</span>
              <span className="label" style={{ margin: 0, fontSize: 8, textAlign: 'center' }}>Weight</span>
              <span className="label" style={{ margin: 0, fontSize: 8, textAlign: 'center' }}>Reps</span>
              <span className="label" style={{ margin: 0, fontSize: 8, textAlign: 'center' }}>Sets</span>
            </div>
            {exList.map(ex => (
              <div key={ex.name} className="log-session-row">
                <div className="ls-name">{ex.name}</div>
                <input className="ls-input" type="number" step="0.5"
                  value={inputs[ex.name]?.weight || ''} placeholder={noGym ? 'BW' : 'kg'}
                  onChange={e => setField(ex.name, 'weight', e.target.value)} />
                <input className="ls-input" type="number"
                  value={inputs[ex.name]?.reps || ''} placeholder="reps"
                  onChange={e => setField(ex.name, 'reps', e.target.value)} />
                <input className="ls-input" type="number"
                  value={inputs[ex.name]?.sets || ''} placeholder={ex.sets}
                  onChange={e => setField(ex.name, 'sets', e.target.value)} />
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <div className="label" style={{ marginBottom: 4 }}>Session notes</div>
              <textarea className="if" rows={2} placeholder="How did it feel? Any notes..."
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize: 'none', fontFamily: 'var(--font-m)', fontSize: 13, lineHeight: 1.5 }} />
            </div>
            <button className="btn-log" style={{ width: '100%', marginTop: 8 }} onClick={handleSave}>
              SAVE SESSION
            </button>
          </div>
        </div>
      )}
      <button className="btn sec" onClick={() => setShow(s => !s)}>
        {show ? 'HIDE LOG FORM' : 'LOG SESSION WEIGHTS'}
      </button>
    </>
  )
}

// ── Run session log form ────────────────────────────────────────────────────
function LogRunForm({ planDayNum, session, state, onSave }) {
  const [show, setShow] = useState(false)
  const [distance, setDistance] = useState(session.distance ? String(session.distance) : '')
  const [time, setTime] = useState('')
  const [effort, setEffort] = useState('')
  const [notes, setNotes] = useState('')

  const timeSeconds = parseTime(time)
  const dist = parseFloat(distance)
  const pacePerMile = timeSeconds && dist ? Math.round(timeSeconds / dist) : null
  const pacePerKm = pacePerMile ? Math.round(pacePerMile / 1.60934) : null

  const recentLogs = (state.runSessionLogs || []).slice(-4).reverse()

  const handleSave = () => {
    if (!timeSeconds && !dist) return
    onSave(planDayNum, distance, timeSeconds, effort, notes)
    setTime('')
    setEffort('')
    setNotes('')
    setShow(false)
  }

  return (
    <>
      {show && (
        <div style={{ marginTop: 6 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 10 }}>
            <div className="label" style={{ marginBottom: 8 }}>Log this run</div>
            <div className="input-grid">
              <div className="ig">
                <div className="label">Distance (miles)</div>
                <input className="if" type="number" step="0.1"
                  value={distance} placeholder={session.distance || '0.0'}
                  onChange={e => setDistance(e.target.value)} />
              </div>
              <div className="ig">
                <div className="label">Time (mm:ss)</div>
                <input className="if" type="text" placeholder="45:00"
                  value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <div className="ig">
                <div className="label">Effort (RPE 1–10)</div>
                <input className="if" type="number" min="1" max="10"
                  value={effort} placeholder="7"
                  onChange={e => setEffort(e.target.value)} />
              </div>
              <div className="ig">
                <div className="label">Notes</div>
                <input className="if" type="text" placeholder="How did it feel?"
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            {pacePerMile && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '8px 10px', marginBottom: 8, display: 'flex', gap: 16 }}>
                <div>
                  <div className="label">Pace / mile</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>{fmtTime(pacePerMile)}</div>
                </div>
                <div>
                  <div className="label">Pace / km</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--amber)' }}>{fmtTime(pacePerKm)}</div>
                </div>
                {dist && timeSeconds && (
                  <div>
                    <div className="label">Distance km</div>
                    <div style={{ fontFamily: 'var(--font-m)', fontSize: 16, color: 'var(--text-dim)' }}>
                      {(dist * 1.60934).toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {recentLogs.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div className="label" style={{ marginBottom: 4 }}>Recent runs</div>
                {recentLogs.map((r, i) => (
                  <div key={i} className="log-entry">
                    <span className="log-date">{r.date}</span>
                    <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)' }}>
                      {r.distance ? `${r.distance}mi` : '—'}
                      {r.timeSeconds ? ` · ${fmtTime(r.timeSeconds)}` : ''}
                      {r.pace ? ` · ${fmtTime(r.pace)}/mi` : ''}
                      {r.effort ? ` · RPE ${r.effort}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-log" style={{ width: '100%' }} onClick={handleSave}>SAVE RUN</button>
          </div>
        </div>
      )}
      <button className="btn sec" onClick={() => setShow(s => !s)}>
        {show ? 'HIDE RUN LOG' : 'LOG THIS RUN'}
      </button>
    </>
  )
}

// ── Strava label copy button ─────────────────────────────────────────────────
function StravaLabel({ label }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(label).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div className="strava">
      <div>
        <div className="label" style={{ marginBottom: 2 }}>Strava Label</div>
        <div className="strava-text">{label}</div>
      </div>
      <button className="strava-copy" onClick={copy}>{copied ? 'COPIED' : 'COPY'}</button>
    </div>
  )
}

// ── Main Today component ────────────────────────────────────────────────────
export default function Today({ state, actions, viewDay, onViewDay, onComplete }) {
  const [noGym, setNoGym] = useState(false)
  const timer = useRestTimer()

  const planDay = viewDay || getTodayPlanDay(state)
  const d = PLAN[planDay - 1]
  if (!d) return null

  const s = d.session
  const done = isCompleted(state, d.dayNum)
  const isToday = !viewDay || viewDay === getTodayPlanDay(state)
  const missed = isToday && isTodayMissed(state)
  const hasNoGymOption = GYM_TYPES.includes(s.type)
  const exList = noGym && hasNoGymOption ? NO_GYM_EXERCISES[s.type] : EXERCISES[s.type]

  return (
    <div>
      {/* Floating rest timer */}
      <RestTimer timer={timer} />

      <div style={{ paddingTop: 8, marginBottom: 18 }}>
        <div className="phase-badge">{PN[d.phase]} — WEEK {d.phaseWeek}</div>
        <h1>{SN[s.type] || s.type}</h1>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
          DAY {d.dayNum} / {PLAN.length}{isToday ? ' \u00a0·\u00a0 TODAY' : ''}
        </div>
      </div>

      {missed && (
        <div className="missed-banner">
          ⚠ Session marked as missed. Plan pushed back 1 day — this session carries to tomorrow.
        </div>
      )}

      {/* Deload week banner */}
      {d.isDeload && (
        <div style={{
          background: 'rgba(200,168,75,.06)',
          border: '1px solid var(--amber-dim)',
          borderLeft: '3px solid var(--amber)',
          padding: '10px 12px',
          marginBottom: 10,
          fontFamily: 'var(--font-m)',
          fontSize: 11,
          color: 'var(--text-dim)',
          lineHeight: 1.6,
        }}>
          <div style={{ color: 'var(--amber)', fontWeight: 700, marginBottom: 4, letterSpacing: '.08em' }}>
            DELOAD WEEK
          </div>
          This is a structured recovery week — not a rest week. Reduced volume lets your nervous system recover and consolidates the strength and fitness you've built. Skipping deloads leads to overtraining and stalled progress. Do the work, trust the process.
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span className={`chip ${s.type}`}>{s.type.replace('_', ' ').toUpperCase()}</span>
        {hasNoGymOption && (
          <button
            onClick={() => setNoGym(g => !g)}
            style={{
              background: noGym ? 'rgba(61,158,114,.12)' : 'rgba(255,255,255,.03)',
              border: `1px solid ${noGym ? 'var(--green-dim)' : 'var(--border-hi)'}`,
              color: noGym ? 'var(--green)' : 'var(--text-muted)',
              fontFamily: 'var(--font-m)',
              fontSize: 9,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {noGym ? '✓ No Gym Mode' : 'No Gym Today'}
          </button>
        )}
      </div>

      {noGym && hasNoGymOption && (
        <div style={{
          background: 'rgba(61,158,114,.06)',
          border: '1px solid var(--green-dim)',
          borderLeft: '3px solid var(--green)',
          padding: '10px 12px',
          marginBottom: 10,
          fontFamily: 'var(--font-m)',
          fontSize: 12,
          color: 'var(--green)',
          lineHeight: 1.5,
        }}>
          Home workout — bodyweight equivalent of {SN[s.type]}.
          Same training stimulus, no equipment needed.
          Completing this still counts as today's session.
        </div>
      )}

      {(s.type === 'rest' || s.type === 'deload') && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
            Recovery Day
          </div>
          <div className="notes-box">
            Active rest. Walk, mobilise, stretch. No intensity. Eat your protein, sleep well. Adaptation happens during recovery.
          </div>
        </>
      )}

      {(s.type === 'run' || s.type === 'ruck') && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            {s.type === 'ruck' ? `Ruck March — ${s.distance || '?'} Miles` : (RTN[s.runType] || 'Run')}
          </div>
          <div className="card">
            {s.type === 'run' && (
              <>
                <div className="run-row">
                  <span style={{ color: 'var(--text-dim)' }}>Type</span>
                  <span className="run-val">{RTN[s.runType] || s.runType}</span>
                </div>
                {s.duration && (
                  <div className="run-row">
                    <span style={{ color: 'var(--text-dim)' }}>Duration</span>
                    <span className="run-val">{s.duration} min</span>
                  </div>
                )}
                {s.distance && (
                  <div className="run-row">
                    <span style={{ color: 'var(--text-dim)' }}>Distance</span>
                    <span className="run-val">{s.distance} miles</span>
                  </div>
                )}
                {s.reps && (
                  <div className="run-row">
                    <span style={{ color: 'var(--text-dim)' }}>Reps</span>
                    <span className="run-val">{s.reps}×</span>
                  </div>
                )}
                {s.runType === 'lss' && (
                  <>
                    <div className="run-row">
                      <span style={{ color: 'var(--text-dim)' }}>HR Zone</span>
                      <span className="run-val">120-150 BPM</span>
                    </div>
                    <div className="run-row">
                      <span style={{ color: 'var(--text-dim)' }}>Target Pace</span>
                      <span className="run-val">~7:00 /km</span>
                    </div>
                  </>
                )}
              </>
            )}
            {s.type === 'ruck' && (
              <>
                <div className="run-row">
                  <span style={{ color: 'var(--text-dim)' }}>Distance</span>
                  <span className="run-val">{s.distance} miles</span>
                </div>
                <div className="run-row">
                  <span style={{ color: 'var(--text-dim)' }}>Weight</span>
                  <span className="run-val">Progressive</span>
                </div>
                <div className="run-row">
                  <span style={{ color: 'var(--text-dim)' }}>Terrain</span>
                  <span className="run-val">Hilly preferred</span>
                </div>
              </>
            )}
          </div>
          {s.stravaLabel && <StravaLabel label={s.stravaLabel} />}
          {s.notes && <div className="notes-box">{s.notes}</div>}
          {s.type === 'run' && (
            <LogRunForm
              planDayNum={d.dayNum}
              session={s}
              state={state}
              onSave={actions.logRunSession}
            />
          )}
        </>
      )}

      {exList && (
        <>
          {d.isDeload && (
            <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
              DELOAD — Sets reduced, keep form sharp
            </div>
          )}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="label">Session Exercises</div>
              {!timer.active && (
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--blue)', letterSpacing: '.06em' }}>
                  TAP REST TO START TIMER
                </div>
              )}
            </div>
            <ExerciseTableWithHistory
              exList={exList}
              isDeload={d.isDeload}
              state={state}
              onStartTimer={timer.start}
            />
          </div>
          <div className="notes-box">
            Progressive overload: when you hit the top of the rep range across all sets, increase weight next session. Bicep curls + hammer curls done at home as accessory.
          </div>
          <LogForm exList={exList} planDayNum={d.dayNum} state={state} noGym={noGym} onSave={actions.saveLog} />
        </>
      )}

      {isToday && !missed && (
        <>
          {done ? (
            <button className="btn done" onClick={actions.markIncomplete}>
              ✓ COMPLETED — TAP TO UNDO
            </button>
          ) : s.type !== 'rest' && s.type !== 'deload' ? (
            <>
              <button className="btn" onClick={() => { actions.markComplete(); onComplete?.() }}>
                MARK SESSION COMPLETE
              </button>
              <button className="btn miss" onClick={actions.missSession}>
                ⚠ MISSED SESSION — PUSH BACK 1 DAY
              </button>
            </>
          ) : null}
        </>
      )}

      {viewDay && !isToday && (
        <button className="btn sec" onClick={() => actions.jumpToDay(d.dayNum)}>
          SET AS CURRENT SESSION
        </button>
      )}

      {/* Spacer so content isn't hidden behind timer */}
      <div style={{ height: timer.active ? 90 : 10 }} />
    </div>
  )
}
