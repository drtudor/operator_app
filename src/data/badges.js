import { PLAN, getTodayPlanDay, isCompleted } from './plan'

export const BADGE_CATEGORIES = ['running', 'lifting', 'sessions', 'phase', 'streak', 'weight']

export const CATEGORY_LABELS = {
  running: 'Running',
  lifting: 'Lifting',
  sessions: 'Sessions',
  phase: 'Phase Completion',
  streak: 'Streaks',
  weight: 'Weight Loss',
}

export const BADGE_DEFS = [
  // ── Running ──
  {
    id: 'first_run', category: 'running', name: 'First Steps', icon: 'RUN',
    desc: 'Complete your first run session',
    check: (state) => state.completed.some(n => PLAN[n - 1]?.session.type === 'run'),
  },
  {
    id: 'log_5k', category: 'running', name: '5K Logged', icon: '5K',
    desc: 'Log a 5km time in the stats',
    check: (state) => Boolean(state.pbs?.['5k']),
  },
  {
    id: 'sub30_5k', category: 'running', name: 'Sub-30 5K', icon: '<30',
    desc: '5km in under 30 minutes',
    check: (state) => state.pbs?.['5k'] && state.pbs['5k'] < 1800,
  },
  {
    id: 'sub25_5k', category: 'running', name: 'Sub-25 5K', icon: '<25',
    desc: '5km in under 25 minutes',
    check: (state) => state.pbs?.['5k'] && state.pbs['5k'] < 1500,
  },
  {
    id: 'sub20_5k', category: 'running', name: 'Sub-20 5K', icon: '<20',
    desc: '5km in under 20 minutes',
    check: (state) => state.pbs?.['5k'] && state.pbs['5k'] < 1200,
  },
  {
    id: 'log_10k', category: 'running', name: '10K Logged', icon: '10K',
    desc: 'Log a 10km time in the stats',
    check: (state) => Boolean(state.pbs?.['10k']),
  },
  {
    id: 'sub60_10k', category: 'running', name: 'Sub-60 10K', icon: '<60',
    desc: '10km in under 60 minutes',
    check: (state) => state.pbs?.['10k'] && state.pbs['10k'] < 3600,
  },
  {
    id: 'sub50_10k', category: 'running', name: 'Sub-50 10K', icon: '<50',
    desc: '10km in under 50 minutes',
    check: (state) => state.pbs?.['10k'] && state.pbs['10k'] < 3000,
  },
  {
    id: 'log_15k', category: 'running', name: '15K Logged', icon: '15K',
    desc: 'Log a 15km time in the stats',
    check: (state) => Boolean(state.pbs?.['15k']),
  },

  // ── Lifting ──
  {
    id: 'first_gym', category: 'lifting', name: 'Iron Start', icon: 'GYM',
    desc: 'Log your first gym session',
    check: (state) => (state.workoutHistory || []).some(h => Object.keys(h.exercises || {}).length > 0),
  },
  {
    id: 'deadlift_100', category: 'lifting', name: 'Century Pull', icon: 'DL',
    desc: 'Deadlift 100kg or more',
    check: (state) => (state.workoutHistory || []).some(h => (h.exercises?.['Deadlift']?.weight || 0) >= 100),
  },
  {
    id: 'deadlift_140', category: 'lifting', name: 'Serious Pull', icon: '140',
    desc: 'Deadlift 140kg or more',
    check: (state) => (state.workoutHistory || []).some(h => (h.exercises?.['Deadlift']?.weight || 0) >= 140),
  },
  {
    id: 'squat_100', category: 'lifting', name: 'Century Squat', icon: 'SQ',
    desc: 'Squat 100kg or more',
    check: (state) => (state.workoutHistory || []).some(h => (h.exercises?.['Squat']?.weight || 0) >= 100),
  },
  {
    id: 'pullup_unassisted', category: 'lifting', name: 'Bodyweight Pull', icon: 'BW',
    desc: 'Log Pull Ups with 0kg assist',
    check: (state) => (state.workoutHistory || []).some(h => h.exercises?.['Pull Ups']?.weight === 0),
  },
  {
    id: 'bench_bw', category: 'lifting', name: 'Bench BW', icon: 'BP',
    desc: 'Bench press your bodyweight (96kg+)',
    check: (state) => (state.workoutHistory || []).some(h => (h.exercises?.['DB Bench Press']?.weight || 0) * 2 >= 96),
  },

  // ── Sessions ──
  {
    id: 'sessions_5', category: 'sessions', name: 'Getting Started', icon: '5',
    desc: 'Complete 5 training sessions',
    check: (state) => state.completed.length >= 5,
  },
  {
    id: 'sessions_10', category: 'sessions', name: '10 Sessions', icon: '10',
    desc: 'Complete 10 training sessions',
    check: (state) => state.completed.length >= 10,
  },
  {
    id: 'sessions_25', category: 'sessions', name: '25 Sessions', icon: '25',
    desc: 'Complete 25 training sessions',
    check: (state) => state.completed.length >= 25,
  },
  {
    id: 'sessions_50', category: 'sessions', name: '50 Sessions', icon: '50',
    desc: 'Complete 50 training sessions',
    check: (state) => state.completed.length >= 50,
  },
  {
    id: 'sessions_100', category: 'sessions', name: 'Century', icon: '100',
    desc: 'Complete 100 training sessions',
    check: (state) => state.completed.length >= 100,
  },

  // ── Phase Completion ──
  {
    id: 'capacity_done', category: 'phase', name: 'Capacity Complete', icon: 'P1',
    desc: 'Finish all 8 weeks of the Capacity phase',
    check: (state) =>
      PLAN.filter(d => d.phase === 'capacity').every(
        d => state.completed.includes(d.dayNum) || d.session.type === 'rest' || d.session.type === 'deload'
      ),
  },
  {
    id: 'velocity_done', category: 'phase', name: 'Velocity Complete', icon: 'P2',
    desc: 'Finish all 8 weeks of the Velocity phase',
    check: (state) =>
      PLAN.filter(d => d.phase === 'velocity').every(
        d => state.completed.includes(d.dayNum) || d.session.type === 'rest' || d.session.type === 'deload'
      ),
  },
  {
    id: 'outcome_done', category: 'phase', name: 'Outcome Complete', icon: 'P3',
    desc: 'Finish all 8 weeks of the Outcome phase',
    check: (state) =>
      PLAN.filter(d => d.phase === 'outcome').every(
        d => state.completed.includes(d.dayNum) || d.session.type === 'rest' || d.session.type === 'deload'
      ),
  },
  {
    id: 'operator_elite', category: 'phase', name: 'OPERATOR', icon: 'OP',
    desc: 'Complete all three phases — the full programme',
    check: (state) =>
      PLAN.every(d => state.completed.includes(d.dayNum) || d.session.type === 'rest' || d.session.type === 'deload'),
  },

  // ── Streaks ──
  {
    id: 'streak_3', category: 'streak', name: 'Getting Going', icon: '3',
    desc: '3-day training streak',
    check: (state, streak) => streak >= 3,
  },
  {
    id: 'streak_7', category: 'streak', name: 'Week Warrior', icon: '7',
    desc: '7-day training streak',
    check: (state, streak) => streak >= 7,
  },
  {
    id: 'streak_14', category: 'streak', name: 'Fortnight Strong', icon: '14',
    desc: '14-day training streak',
    check: (state, streak) => streak >= 14,
  },
  {
    id: 'streak_30', category: 'streak', name: 'Month of Pain', icon: '30',
    desc: '30-day training streak',
    check: (state, streak) => streak >= 30,
  },

  // ── Weight Loss ──
  {
    id: 'first_weigh', category: 'weight', name: 'On the Scale', icon: 'WT',
    desc: 'Log your first weight entry',
    check: (state) => (state.weights || []).length > 0,
  },
  {
    id: 'lost_2kg', category: 'weight', name: 'Down 2kg', icon: '-2',
    desc: 'Lost 2kg from starting weight',
    check: (state) => {
      if (!state.weights?.length) return false
      return (96.8 - parseFloat(state.weights[state.weights.length - 1].value)) >= 2
    },
  },
  {
    id: 'lost_5kg', category: 'weight', name: 'Down 5kg', icon: '-5',
    desc: 'Lost 5kg from starting weight',
    check: (state) => {
      if (!state.weights?.length) return false
      return (96.8 - parseFloat(state.weights[state.weights.length - 1].value)) >= 5
    },
  },
  {
    id: 'goal_weight', category: 'weight', name: 'Goal Weight', icon: '88',
    desc: 'Reach target weight of 88kg',
    check: (state) => {
      if (!state.weights?.length) return false
      return parseFloat(state.weights[state.weights.length - 1].value) <= 88
    },
  },
]

export function getEarnedBadges(state, streak = 0) {
  return BADGE_DEFS.filter(b => {
    try { return b.check(state, streak) } catch { return false }
  })
}

export function getNewBadges(prevState, nextState, prevStreak, nextStreak) {
  const prevIds = new Set(getEarnedBadges(prevState, prevStreak).map(b => b.id))
  return getEarnedBadges(nextState, nextStreak).filter(b => !prevIds.has(b.id))
}
