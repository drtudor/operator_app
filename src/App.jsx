import { useState, useRef } from 'react'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Today from './components/Today'
import Plan from './components/Plan'
import Stats from './components/Stats'
import Confetti from './components/Confetti'
import RestTimer, { useRestTimer } from './components/RestTimer'
import { useAppState } from './hooks/useAppState'
import { useStrava } from './hooks/useStrava'
import { calculateStreak } from './data/plan'
import { getEarnedBadges } from './data/badges'

const PAGES = ['dash', 'today', 'plan', 'stats']

export default function App() {
  const [activePage, setActivePage] = useState('dash')
  const [viewDay, setViewDay] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [newBadges, setNewBadges] = useState([])
  const { state, actions } = useAppState()
  const strava = useStrava()
  const timer = useRestTimer()
  const todayRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const navigate = (page, day = null) => {
    setActivePage(page)
    if (page === 'today') {
      setViewDay(day)
      if (todayRef.current) todayRef.current.scrollTop = 0
    }
  }

  const handleComplete = () => {
    const streak = calculateStreak(state)
    const prevBadges = new Set(getEarnedBadges(state, streak).map(b => b.id))
    actions.markComplete()
    // Check new badges after state update (next render)
    setTimeout(() => {
      const newState = JSON.parse(localStorage.getItem('op_v3') || '{}')
      const newStreak = calculateStreak({ ...state, completed: newState.completed || state.completed })
      const earned = getEarnedBadges({ ...state, ...newState }, newStreak)
      const fresh = earned.filter(b => !prevBadges.has(b.id))
      if (fresh.length) setNewBadges(fresh)
    }, 50)
    setConfettiKey(k => k + 1)
    setShowConfetti(true)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    // Only trigger swipe if horizontal movement dominates and is significant
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy * 1.5) {
      const idx = PAGES.indexOf(activePage)
      if (dx > 0 && idx < PAGES.length - 1) navigate(PAGES[idx + 1])
      else if (dx < 0 && idx > 0) navigate(PAGES[idx - 1])
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div
      style={{ display: 'contents' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Confetti key={confettiKey} active={showConfetti} onDone={() => setShowConfetti(false)} />

      {newBadges.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--green-dim)',
          borderLeft: '3px solid var(--green)', padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeInUp .3s ease',
        }}>
          <div className="label" style={{ color: 'var(--green)', marginBottom: 2 }}>Award unlocked</div>
          {newBadges.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, background: 'var(--green-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-m)', fontSize: 9, fontWeight: 700, color: 'var(--green)',
              }}>
                {b.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-c)', fontSize: 13, fontWeight: 700, letterSpacing: '.06em' }}>{b.name}</div>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-dim)' }}>{b.desc}</div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setNewBadges([])}
            style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-m)', fontSize: 11 }}
          >
            ✕
          </button>
        </div>
      )}

      <div id="pg-dash" className={`page${activePage === 'dash' ? ' active' : ''}`}>
        <Dashboard state={state} strava={strava} onViewSession={(day) => navigate('today', day || null)} />
      </div>

      <div ref={todayRef} id="pg-today" className={`page${activePage === 'today' ? ' active' : ''}`}>
        <Today
          state={state}
          actions={actions}
          viewDay={viewDay}
          onViewDay={(day) => navigate('today', day)}
          onComplete={handleComplete}
          timer={timer}
        />
      </div>

      <div id="pg-plan" className={`page${activePage === 'plan' ? ' active' : ''}`}>
        <Plan state={state} onViewDay={(day) => navigate('today', day)} />
      </div>

      <div id="pg-stats" className={`page${activePage === 'stats' ? ' active' : ''}`}>
        <Stats state={state} actions={actions} isActive={activePage === 'stats'} />
      </div>

      <RestTimer timer={timer} />
      <Nav activePage={activePage} onNavigate={navigate} />
    </div>
  )
}
