import { useState, useEffect, useRef } from 'react'
import { fmtTime } from '../data/plan'

const KEY_LIFTS = [
  { name: 'Deadlift', color: '#c8a84b', unit: 'kg' },
  { name: 'Squat', color: '#3d9e72', unit: 'kg' },
  { name: 'DB Bench Press', color: '#5a96c8', unit: 'kg/hand' },
  { name: 'Pull Ups', color: '#b4703c', unit: 'kg assist', invert: true },
]

function getLiftHistory(state, liftName) {
  return (state.workoutHistory || [])
    .filter(h => h.exercises?.[liftName]?.weight != null)
    .map(h => ({ date: h.date, weight: h.exercises[liftName].weight, reps: h.exercises[liftName].reps }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function drawChart(canvas, pts, color, invert) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.offsetWidth || 300
  const h = 100
  canvas.width = w
  canvas.height = h

  if (pts.length < 2) {
    ctx.fillStyle = 'rgba(26,40,48,.5)'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#334050'
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(pts.length === 1 ? 'Log more sessions to see trend' : 'No sessions logged yet', w / 2, h / 2 + 4)
    return
  }

  const vals = pts.map(p => p.weight)
  const mn = Math.min(...vals) - 2
  const mx = Math.max(...vals) + 2
  const range = mx - mn
  const pad = 12
  const pw = w - pad * 2
  const ph = h - pad * 2

  ctx.strokeStyle = '#1a2830'
  ctx.lineWidth = 1
  for (let i = 0; i <= 3; i++) {
    const y = pad + (i / 3) * ph
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke()
  }

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  pts.forEach((p, i) => {
    const x = pad + (i / (pts.length - 1)) * pw
    const pct = invert ? (p.weight - mn) / range : (mx - p.weight) / range
    const y = pad + pct * ph
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  ctx.fillStyle = color
  pts.forEach((p, i) => {
    const x = pad + (i / (pts.length - 1)) * pw
    const pct = invert ? (p.weight - mn) / range : (mx - p.weight) / range
    const y = pad + pct * ph
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
  })

  const last = pts[pts.length - 1]
  ctx.fillStyle = '#ddd5c0'
  ctx.font = '10px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(`${last.weight}kg`, w - pad, pad + 12)

  // Date range
  ctx.fillStyle = '#334050'
  ctx.font = '9px monospace'
  ctx.textAlign = 'left'
  ctx.fillText(pts[0].date.slice(5), pad, h - 2)
  ctx.textAlign = 'right'
  ctx.fillText(last.date.slice(5), w - pad, h - 2)
}

export default function LiftProgress({ state }) {
  const [selected, setSelected] = useState('Deadlift')
  const canvasRef = useRef(null)

  const lift = KEY_LIFTS.find(l => l.name === selected)
  const pts = getLiftHistory(state, selected)
  const last = pts[pts.length - 1]
  const first = pts[0]
  const change = pts.length >= 2 ? last.weight - first.weight : null

  useEffect(() => {
    drawChart(canvasRef.current, pts, lift.color, lift.invert)
  }, [pts, lift])

  return (
    <div>
      {/* Lift selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {KEY_LIFTS.map(l => {
          const lPts = getLiftHistory(state, l.name)
          const isSelected = selected === l.name
          return (
            <button
              key={l.name}
              onClick={() => setSelected(l.name)}
              style={{
                flex: 1,
                padding: '6px 4px',
                background: isSelected ? 'rgba(255,255,255,.05)' : 'var(--surface)',
                border: `1px solid ${isSelected ? l.color : 'var(--border)'}`,
                color: isSelected ? l.color : 'var(--text-muted)',
                fontFamily: 'var(--font-m)',
                fontSize: 8,
                cursor: 'pointer',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                transition: 'all .15s',
              }}
            >
              {l.name.split(' ')[0]}
              <div style={{ fontSize: 9, marginTop: 2 }}>{lPts.length > 0 ? `${lPts[lPts.length - 1].weight}kg` : '—'}</div>
            </button>
          )
        })}
      </div>

      {/* Stats row */}
      {pts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 10px', flex: 1 }}>
            <div className="label">Current</div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 18, color: lift.color }}>
              {last.weight}<span style={{ fontSize: 10, color: 'var(--text-dim)' }}>kg</span>
            </div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)' }}>{lift.unit}</div>
          </div>
          {change !== null && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 10px', flex: 1 }}>
              <div className="label">Progress</div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 18, color: (lift.invert ? change <= 0 : change >= 0) ? 'var(--green)' : 'var(--text-dim)' }}>
                {change > 0 ? '+' : ''}{change}<span style={{ fontSize: 10, color: 'var(--text-dim)' }}>kg</span>
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)' }}>{pts.length} sessions</div>
            </div>
          )}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 10px', flex: 1 }}>
            <div className="label">Last reps</div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 18, color: 'var(--text)' }}>
              {last.reps}<span style={{ fontSize: 10, color: 'var(--text-dim)' }}>r</span>
            </div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)' }}>{last.date.slice(5)}</div>
          </div>
        </div>
      )}

      {lift.invert && pts.length > 0 && (
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 6 }}>
          Pull Ups: lower assist weight = stronger. Chart shows reduction over time.
        </div>
      )}

      <canvas ref={canvasRef} height="100" style={{ width: '100%' }} />
    </div>
  )
}
