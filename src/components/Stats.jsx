import { useState, useEffect, useRef } from 'react'
import { getTodayPlanDay, todayISO, fmtTime, parseTime, PLAN } from '../data/plan'
import BadgesPanel from './BadgesPanel'

function drawChart(canvas, weights) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.offsetWidth || 300
  const h = 90
  canvas.width = w
  canvas.height = h

  const pts = weights.slice(-20)
  if (pts.length < 2) {
    ctx.fillStyle = 'rgba(26,40,48,.5)'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#334050'
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Log weight to see trend', w / 2, h / 2 + 4)
    return
  }

  const vals = pts.map(p => parseFloat(p.value))
  const mn = Math.min(...vals) - 1
  const mx = Math.max(...vals) + 1
  const r = mx - mn
  const pad = 10
  const pw = w - pad * 2
  const ph = h - pad * 2

  ctx.strokeStyle = '#1a2830'
  ctx.lineWidth = 1
  for (let i = 0; i <= 3; i++) {
    const y = pad + (i / 3) * ph
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke()
  }

  ctx.strokeStyle = '#c8a84b'
  ctx.lineWidth = 2
  ctx.beginPath()
  pts.forEach((p, i) => {
    const x = pad + (i / (pts.length - 1)) * pw
    const y = pad + ((mx - parseFloat(p.value)) / r) * ph
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  ctx.fillStyle = '#c8a84b'
  pts.forEach((p, i) => {
    const x = pad + (i / (pts.length - 1)) * pw
    const y = pad + ((mx - parseFloat(p.value)) / r) * ph
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
  })

  ctx.fillStyle = '#ddd5c0'
  ctx.font = '10px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(pts[pts.length - 1].value + 'kg', w - pad, pad + 12)
}

export default function Stats({ state, actions, isActive }) {
  const canvasRef = useRef(null)
  const [wtVal, setWtVal] = useState('')
  const [wtDate, setWtDate] = useState(todayISO())
  const [runDist, setRunDist] = useState('2k')
  const [runTime, setRunTime] = useState('')
  const [startInput, setStartInput] = useState(state.startDate)
  const [ruckWeight, setRuckWeight] = useState('')
  const [ruckDist, setRuckDist] = useState('')
  const [ruckDate, setRuckDate] = useState(todayISO())
  const [ruckNotes, setRuckNotes] = useState('')

  useEffect(() => {
    if (isActive) drawChart(canvasRef.current, state.weights)
  }, [state.weights, isActive])

  const handleLogWeight = () => {
    if (!wtVal) return
    actions.logWeight(wtVal, wtDate)
    setWtVal('')
  }

  const handleLogRun = () => {
    const secs = parseTime(runTime)
    if (!secs) return
    actions.logRun(runDist, secs)
    setRunTime('')
  }

  const handleSetPB = (dist) => {
    const t = prompt(`PB for ${dist} (mm:ss):`)
    if (!t) return
    const s = parseTime(t.trim())
    if (s) actions.setPB(dist, s)
  }

  const handleUpdateStart = () => {
    actions.updateStart(startInput)
  }

  const handleLogRuck = () => {
    if (!ruckWeight) return
    actions.logRuck(ruckWeight, ruckDist, ruckDate, ruckNotes)
    setRuckWeight('')
    setRuckDist('')
    setRuckNotes('')
  }

  const { pbs, weights } = state
  const ruckLogs = state.ruckLogs || []
  const latestRuck = ruckLogs.length ? ruckLogs[ruckLogs.length - 1] : null

  return (
    <div>
      <div style={{ paddingTop: 8, marginBottom: 14 }}>
        <h1>METRICS</h1>
      </div>

      <h2>Log Weight</h2>
      <div className="card">
        <div className="input-grid">
          <div className="ig">
            <div className="label">Weight (kg)</div>
            <input className="if" type="number" step="0.1" placeholder="96.8" value={wtVal} onChange={e => setWtVal(e.target.value)} />
          </div>
          <div className="ig">
            <div className="label">Date</div>
            <input className="if" type="date" value={wtDate} onChange={e => setWtDate(e.target.value)} />
          </div>
          <button className="btn-log" onClick={handleLogWeight}>LOG WEIGHT</button>
        </div>
        <div className="log-list">
          {weights.length === 0
            ? <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-muted)', padding: '8px 0' }}>No entries yet</div>
            : [...weights].reverse().slice(0, 8).map((e, i) => (
              <div key={i} className="log-entry">
                <span className="log-date">{e.date}</span>
                <span className="log-val">{e.value} kg</span>
              </div>
            ))}
        </div>
      </div>

      <div className="card">
        <div className="label" style={{ marginBottom: 8 }}>Weight Trend</div>
        <canvas ref={canvasRef} height="90" style={{ width: '100%' }} />
      </div>

      <h2 style={{ marginTop: 14 }}>Run PBs — Tap to Update</h2>
      <div className="pb-grid">
        {['2k', '5k', '10k', '15k'].map(dist => (
          <div key={dist} className="pb-card" onClick={() => handleSetPB(dist)}>
            <div className="pb-dist">{dist}</div>
            {pbs[dist]
              ? <div className="pb-time">{fmtTime(pbs[dist])}</div>
              : <div className="pb-unset">Tap to set</div>}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 14 }}>Log Run Time</h2>
      <div className="card">
        <div className="input-grid">
          <div className="ig">
            <div className="label">Distance</div>
            <select className="if" value={runDist} onChange={e => setRunDist(e.target.value)}>
              <option value="2k">2km</option>
              <option value="5k">5km</option>
              <option value="10k">10km</option>
              <option value="15k">15km</option>
            </select>
          </div>
          <div className="ig">
            <div className="label">Time (mm:ss)</div>
            <input className="if" type="text" placeholder="25:00" value={runTime} onChange={e => setRunTime(e.target.value)} />
          </div>
          <button className="btn-log" onClick={handleLogRun}>LOG RUN</button>
        </div>
      </div>

      <h2 style={{ marginTop: 14 }}>Ruck Log</h2>
      <div className="card">
        <div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="ig">
            <div className="label">Weight (kg)</div>
            <input className="if" type="number" step="0.5" placeholder="20" value={ruckWeight} onChange={e => setRuckWeight(e.target.value)} />
          </div>
          <div className="ig">
            <div className="label">Distance (mi)</div>
            <input className="if" type="number" step="0.1" placeholder="4" value={ruckDist} onChange={e => setRuckDist(e.target.value)} />
          </div>
          <div className="ig">
            <div className="label">Date</div>
            <input className="if" type="date" value={ruckDate} onChange={e => setRuckDate(e.target.value)} />
          </div>
        </div>
        <input className="if" type="text" placeholder="Notes (optional)" value={ruckNotes} onChange={e => setRuckNotes(e.target.value)} style={{ marginBottom: 8 }} />
        <button className="btn-log" style={{ gridColumn: '1/-1' }} onClick={handleLogRuck}>LOG RUCK</button>
        {latestRuck && (
          <div style={{ marginTop: 10 }}>
            <div className="label" style={{ marginBottom: 6 }}>Recent ruck sessions</div>
            <div className="log-list">
              {[...ruckLogs].reverse().slice(0, 6).map((r, i) => (
                <div key={i} className="log-entry">
                  <span className="log-date">{r.date}</span>
                  <span style={{ color: 'var(--ruck)', fontFamily: 'var(--font-m)', fontSize: 12 }}>
                    {r.weight}kg · {r.distance}mi{r.notes ? ` · ${r.notes}` : ''}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-m)', fontSize: 11 }}>
              <span style={{ color: 'var(--text-dim)' }}>Current ruck weight</span>
              <span style={{ color: 'var(--ruck)' }}>{latestRuck.weight}kg</span>
            </div>
          </div>
        )}
      </div>

      <h2 style={{ marginTop: 14 }}>Farmers Carry</h2>
      <div className="card">
        <div className="run-row">
          <span style={{ color: 'var(--text-dim)' }}>Current</span>
          <span className="run-val">20kg / hand</span>
        </div>
        <div className="run-row">
          <span style={{ color: 'var(--text-dim)' }}>BW Goal</span>
          <span className="run-val">~48kg total / 200m</span>
        </div>
        <div className="prog-bar" style={{ marginTop: 6 }}>
          <div className="prog-fill" style={{ width: `${Math.round(40 / 48 * 100)}%` }} />
        </div>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          +2kg/hand per week
        </div>
      </div>

      <h2 style={{ marginTop: 14 }}>Plan Settings</h2>
      <div className="card">
        <div className="run-row">
          <span style={{ color: 'var(--text-dim)' }}>Start Date</span>
          <span className="run-val" style={{ fontSize: 13 }}>{state.startDate}</span>
        </div>
        <div className="run-row">
          <span style={{ color: 'var(--text-dim)' }}>Skipped Days</span>
          <span className="run-val">{state.skippedDays}</span>
        </div>
        <div className="run-row">
          <span style={{ color: 'var(--text-dim)' }}>Today = Plan Day</span>
          <span className="run-val">{getTodayPlanDay(state)}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            className="if"
            type="date"
            value={startInput}
            style={{ flex: 1, fontSize: 14 }}
            onChange={e => setStartInput(e.target.value)}
          />
          <button className="btn-log" style={{ width: 'auto', padding: '10px 14px', gridColumn: 'auto' }} onClick={handleUpdateStart}>
            UPDATE
          </button>
        </div>
      </div>

      <div style={{ height: 14 }} />
      <BadgesPanel state={state} />
      <div style={{ height: 8 }} />
    </div>
  )
}
