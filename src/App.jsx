import { useState, useRef } from 'react'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Today from './components/Today'
import Plan from './components/Plan'
import Stats from './components/Stats'
import { useAppState } from './hooks/useAppState'
import { useStrava } from './hooks/useStrava'

export default function App() {
  const [activePage, setActivePage] = useState('dash')
  const [viewDay, setViewDay] = useState(null)
  const { state, actions } = useAppState()
  const strava = useStrava()
  const todayRef = useRef(null)

  const navigate = (page, day = null) => {
    setActivePage(page)
    if (page === 'today') {
      setViewDay(day)
      // Scroll to top of today page
      if (todayRef.current) todayRef.current.scrollTop = 0
    }
  }

  const handleViewDay = (dayNum) => {
    navigate('today', dayNum)
  }

  return (
    <>
      <div id="pg-dash" className={`page${activePage === 'dash' ? ' active' : ''}`}>
        <Dashboard
          state={state}
          strava={strava}
          onViewSession={() => navigate('today')}
        />
      </div>

      <div ref={todayRef} id="pg-today" className={`page${activePage === 'today' ? ' active' : ''}`}>
        <Today
          state={state}
          actions={actions}
          viewDay={viewDay}
          onViewDay={handleViewDay}
        />
      </div>

      <div id="pg-plan" className={`page${activePage === 'plan' ? ' active' : ''}`}>
        <Plan
          state={state}
          onViewDay={handleViewDay}
        />
      </div>

      <div id="pg-stats" className={`page${activePage === 'stats' ? ' active' : ''}`}>
        <Stats
          state={state}
          actions={actions}
          isActive={activePage === 'stats'}
        />
      </div>

      <Nav activePage={activePage} onNavigate={navigate} />
    </>
  )
}
