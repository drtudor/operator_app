import { useState, useEffect, useRef, useCallback } from 'react'

const PRESETS = [45, 60, 90, 120, 180]

function fmt(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function useRestTimer() {
  const [active, setActive] = useState(false)
  const [total, setTotal] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [label, setLabel] = useState('')
  const intervalRef = useRef(null)

  const start = useCallback((secs, exerciseLabel = '') => {
    clearInterval(intervalRef.current)
    setTotal(secs)
    setRemaining(secs)
    setLabel(exerciseLabel)
    setActive(true)
  }, [])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setActive(false)
  }, [])

  useEffect(() => {
    if (!active) return
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setActive(false)
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200])
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [active])

  return { active, total, remaining, label, start, stop }
}

export default function RestTimer({ timer }) {
  const { active, total, remaining, label, start, stop } = timer
  if (!active) return null

  const progress = (total - remaining) / total
  const isLow = remaining <= 10

  return (
    <div style={{
      position: 'fixed',
      bottom: 60,
      left: 0,
      right: 0,
      background: 'var(--surface)',
      borderTop: `1px solid ${isLow ? 'var(--amber-dim)' : 'var(--border-hi)'}`,
      padding: '10px 16px 8px',
      zIndex: 90,
    }}>
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div>
            <div className="label" style={{ margin: 0, color: isLow ? 'var(--amber)' : 'var(--text-muted)' }}>REST</div>
            {label && <div style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '.04em', marginTop: 1 }}>{label}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div className="prog-bar">
              <div
                className="prog-fill g"
                style={{
                  width: `${progress * 100}%`,
                  transition: 'width 1s linear',
                  background: isLow ? 'var(--amber)' : 'var(--green)',
                }}
              />
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-m)',
            fontSize: 22,
            color: isLow ? 'var(--amber)' : 'var(--green)',
            minWidth: 46,
            textAlign: 'right',
            transition: 'color .3s',
          }}>
            {fmt(remaining)}
          </div>
          <button
            onClick={stop}
            style={{
              background: 'none',
              border: '1px solid var(--border-hi)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-m)',
              fontSize: 9,
              padding: '5px 8px',
              cursor: 'pointer',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
            }}
          >
            STOP
          </button>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {PRESETS.map(s => (
            <button
              key={s}
              onClick={() => start(s)}
              style={{
                flex: 1,
                padding: '5px 0',
                background: total === s ? 'rgba(61,158,114,.12)' : 'rgba(255,255,255,.03)',
                border: `1px solid ${total === s ? 'var(--green-dim)' : 'var(--border)'}`,
                color: total === s ? 'var(--green)' : 'var(--text-muted)',
                fontFamily: 'var(--font-m)',
                fontSize: 9,
                cursor: 'pointer',
                letterSpacing: '.06em',
                transition: 'all .15s',
              }}
            >
              {s < 60 ? `${s}s` : `${s / 60}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
