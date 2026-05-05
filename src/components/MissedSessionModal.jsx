import { useState } from 'react'
import { PLAN, SN, NO_GYM_EXERCISES, EXERCISES, getTodayPlanDay, fmtWt, getLastLog } from '../data/plan'

const CONDENSED_SETS_REDUCTION = 1
const CONDENSED_REPS_FACTOR = 0.75

function CondensedExList({ exList, state }) {
  return (
    <div style={{ marginTop: 8 }}>
      {exList.map(ex => {
        const sets = Math.max(1, ex.sets - CONDENSED_SETS_REDUCTION)
        const reps = ex.reps.includes('-')
          ? ex.reps
          : String(Math.max(4, Math.round(parseInt(ex.reps) * CONDENSED_REPS_FACTOR)))
        const ll = getLastLog(state, ex.name)
        return (
          <div key={ex.name} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 0',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-m)',
            fontSize: 11,
          }}>
            <span style={{ color: 'var(--text-dim)' }}>{ex.name}</span>
            <span style={{ color: 'var(--text)' }}>
              {sets}×{reps}
              {ll ? <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>@ {fmtWt(ll)}</span> : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function MissedSessionModal({ state, actions, onClose }) {
  const [mode, setMode] = useState(null) // null | 'condensed'
  const planDay = getTodayPlanDay(state)
  const d = PLAN[planDay - 1]
  if (!d) return null

  const GYM_TYPES = ['upper', 'lower', 'se_upper', 'se_lower']
  const isGym = GYM_TYPES.includes(d.session.type)
  const exList = EXERCISES[d.session.type]

  const handlePushBack = () => {
    actions.missSession()
    onClose()
  }

  const handleSkip = () => {
    actions.skipSession()
    onClose()
  }

  const handleCondensedComplete = () => {
    actions.markComplete()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.75)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      padding: '0 0 60px',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderBottom: 'none',
        padding: '20px 16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-c)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '.15em',
          color: 'var(--amber)',
          marginBottom: 6,
        }}>
          MISSED SESSION?
        </div>
        <div style={{ fontFamily: 'var(--font-m)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 18, lineHeight: 1.6 }}>
          Choose how to handle today's {SN[d.session.type] || d.session.type} session.
        </div>

        {mode === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Push back */}
            <button
              onClick={handlePushBack}
              style={{
                background: 'rgba(200,168,75,.08)',
                border: '1px solid var(--amber-dim)',
                borderLeft: '3px solid var(--amber)',
                padding: '14px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 13, color: 'var(--amber)', fontWeight: 700, marginBottom: 4 }}>
                PUSH BACK 1 DAY
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                Session carries to tomorrow. Plan extends by 1 day. Best option — life happens, no shame.
              </div>
            </button>

            {/* Condensed (gym only) */}
            {isGym && (
              <button
                onClick={() => setMode('condensed')}
                style={{
                  background: 'rgba(90,150,200,.08)',
                  border: '1px solid rgba(90,150,200,.25)',
                  borderLeft: '3px solid var(--blue)',
                  padding: '14px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 13, color: 'var(--blue)', fontWeight: 700, marginBottom: 4 }}>
                  CONDENSED SESSION
                </div>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                  Short on time? Reduced sets and reps. Still counts. Something beats nothing.
                </div>
              </button>
            )}

            {/* Skip */}
            <button
              onClick={handleSkip}
              style={{
                background: 'rgba(255,255,255,.02)',
                border: '1px solid var(--border)',
                padding: '14px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 13, color: 'var(--text-dim)', fontWeight: 700, marginBottom: 4 }}>
                SKIP THIS SESSION
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Move on without logging. Plan advances normally. Use sparingly.
              </div>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-m)',
                fontSize: 11,
                padding: '8px',
                cursor: 'pointer',
                letterSpacing: '.08em',
              }}
            >
              CANCEL
            </button>
          </div>
        )}

        {mode === 'condensed' && exList && (
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--blue)', marginBottom: 8, letterSpacing: '.06em' }}>
              CONDENSED — {Math.max(1, exList[0]?.sets - 1)} sets · ~75% reps
            </div>
            <CondensedExList exList={exList} state={state} />
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1 }} onClick={handleCondensedComplete}>
                MARK COMPLETE
              </button>
              <button className="btn sec" onClick={() => setMode(null)}>
                BACK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
