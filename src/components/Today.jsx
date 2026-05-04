import { useState } from 'react'
import {
  PLAN, EXERCISES, SN, RTN, PN,
  getTodayPlanDay, isTodayMissed, isCompleted,
  getLastLog, getProgression, fmtWt,
} from '../data/plan'

function ExerciseTable({ exList, isDeload }) {
  return (
    <div className="ex-list">
      <div className="ex-hdr">
        <span className="ex-hlabel">Exercise</span>
        <span className="ex-hlabel">Sets</span>
        <span className="ex-hlabel">Reps</span>
        <span className="ex-hlabel">Rest</span>
      </div>
      {exList.map(ex => {
        return (
          <ExRow key={ex.name} ex={ex} isDeload={isDeload} />
        )
      })}
    </div>
  )
}

function ExRow({ ex, isDeload, state }) {
  // state is passed via ExerciseTable but we don't have it here — handled by parent
  return (
    <div className="ex-row">
      <div>
        <div className="ex-name">{ex.name}</div>
        {ex.note && <div className="ex-note">{ex.note}</div>}
      </div>
      <div className="ex-d">{isDeload ? Math.max(2, ex.sets - 1) : ex.sets}<span>sets</span></div>
      <div className="ex-d">{ex.reps}<span>reps</span></div>
      <div className="ex-d">{ex.rest}<span>rest</span></div>
    </div>
  )
}

function ExerciseTableWithHistory({ exList, isDeload, state }) {
  return (
    <div className="ex-list">
      <div className="ex-hdr">
        <span className="ex-hlabel">Exercise</span>
        <span className="ex-hlabel">Sets</span>
        <span className="ex-hlabel">Reps</span>
        <span className="ex-hlabel">Rest</span>
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
            <div className="ex-d">{ex.rest}<span>rest</span></div>
          </div>
        )
      })}
    </div>
  )
}

function LogForm({ exList, planDayNum, state, onSave }) {
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
      if (w && r && s) exercises[ex.name] = { weight: w, reps: r, sets: s }
    })
    onSave(planDayNum, exercises, notes)
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
                <input
                  className="ls-input"
                  type="number"
                  step="0.5"
                  value={inputs[ex.name]?.weight || ''}
                  placeholder="kg"
                  onChange={e => setField(ex.name, 'weight', e.target.value)}
                />
                <input
                  className="ls-input"
                  type="number"
                  value={inputs[ex.name]?.reps || ''}
                  placeholder="reps"
                  onChange={e => setField(ex.name, 'reps', e.target.value)}
                />
                <input
                  className="ls-input"
                  type="number"
                  value={inputs[ex.name]?.sets || ''}
                  placeholder={ex.sets}
                  onChange={e => setField(ex.name, 'sets', e.target.value)}
                />
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <div className="label" style={{ marginBottom: 4 }}>Session notes</div>
              <textarea
                className="if"
                rows={2}
                placeholder="How did it feel? Any notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'none', fontFamily: 'var(--font-m)', fontSize: 13, lineHeight: 1.5 }}
              />
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

export default function Today({ state, actions, viewDay, onViewDay, onComplete }) {
  const planDay = viewDay || getTodayPlanDay(state)
  const d = PLAN[planDay - 1]
  if (!d) return null

  const s = d.session
  const done = isCompleted(state, d.dayNum)
  const isToday = !viewDay || viewDay === getTodayPlanDay(state)
  const missed = isToday && isTodayMissed(state)
  const exList = EXERCISES[s.type]

  return (
    <div>
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

      <span className={`chip ${s.type}`}>{s.type.replace('_', ' ').toUpperCase()}</span>

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
        </>
      )}

      {exList && (
        <>
          {d.isDeload && (
            <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
              DELOAD — Reduce intensity ~40%
            </div>
          )}
          <div className="card">
            <div className="label" style={{ marginBottom: 8 }}>Session Exercises</div>
            <ExerciseTableWithHistory exList={exList} isDeload={d.isDeload} state={state} />
          </div>
          <div className="notes-box">
            Progressive overload: when you hit the top of the rep range across all sets, increase weight next session. Bicep curls + hammer curls done at home as accessory.
          </div>
          <LogForm exList={exList} planDayNum={d.dayNum} state={state} onSave={actions.saveLog} />
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

      <div style={{ height: 10 }} />
    </div>
  )
}
