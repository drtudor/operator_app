import { BADGE_DEFS, BADGE_CATEGORIES, CATEGORY_LABELS, getEarnedBadges } from '../data/badges'
import { calculateStreak } from '../data/plan'

export default function BadgesPanel({ state }) {
  const streak = calculateStreak(state)
  const earned = new Set(getEarnedBadges(state, streak).map(b => b.id))
  const earnedCount = earned.size
  const total = BADGE_DEFS.length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Awards</h2>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-dim)' }}>
          {earnedCount} / {total} unlocked
        </span>
      </div>

      <div className="prog-bar" style={{ marginBottom: 14 }}>
        <div className="prog-fill g" style={{ width: `${Math.round(earnedCount / total * 100)}%` }} />
      </div>

      {BADGE_CATEGORIES.map(cat => {
        const catBadges = BADGE_DEFS.filter(b => b.category === cat)
        const catEarned = catBadges.filter(b => earned.has(b.id)).length
        return (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: 'var(--font-c)', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {CATEGORY_LABELS[cat]}
              </span>
              <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-muted)' }}>
                {catEarned}/{catBadges.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {catBadges.map(badge => {
                const isEarned = earned.has(badge.id)
                return (
                  <div key={badge.id} style={{
                    background: isEarned ? 'rgba(61,158,114,.07)' : 'var(--surface)',
                    border: `1px solid ${isEarned ? 'var(--green-dim)' : 'var(--border)'}`,
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    opacity: isEarned ? 1 : 0.45,
                    transition: 'all .2s',
                  }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      background: isEarned ? 'var(--green-dim)' : 'var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-m)',
                      fontSize: badge.icon.length > 2 ? 8 : 10,
                      fontWeight: 700,
                      color: isEarned ? 'var(--green)' : 'var(--text-muted)',
                      letterSpacing: '.04em',
                    }}>
                      {badge.icon}
                    </div>
                    <div style={{ fontFamily: 'var(--font-c)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: isEarned ? 'var(--text)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
                      {badge.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                      {badge.desc}
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
}
