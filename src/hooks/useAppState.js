import { useState } from 'react'
import { PLAN, todayISO, daysBetween } from '../data/plan'

const DFLT = {
  startDate: '2026-05-03',
  skippedDays: 0,
  missedDates: [],
  completed: [1],
  weights: [],
  runs: [],
  pbs: {},
  ruckLogs: [],
  runSessionLogs: [],
  farmersCarryKg: 20,
  workoutHistory: [
    {
      date: '2026-05-03',
      planDay: 1,
      type: 'upper',
      exercises: {
        'Pull Ups': { weight: 77, reps: 5, sets: 2, weightNote: 'kg assist' },
        'DB Bench Press': { weight: 22, reps: 8, sets: 4, weightNote: 'kg/hand' },
        'DB Incline Bench': { weight: 16, reps: 8, sets: 3, weightNote: 'kg/hand' },
        'T-Bar Row': { weight: 40, reps: 6, sets: 3 },
        'Shoulder Press': { weight: 12, reps: 8, sets: 3, weightNote: 'kg/hand' },
        'Lateral Raises': { weight: 9, reps: 10, sets: 2 },
        'Face Pulls': { weight: 50, reps: 12, sets: 3 },
        'Tricep Pushdown': { weight: 48, reps: 8, sets: 3 },
        'Tricep Extensions': { weight: 44, reps: 8, sets: 3 },
        'Bicep Curls': { weight: 12, reps: 8, sets: 3, weightNote: 'home' },
        'Hammer Curls': { weight: 12, reps: 6, sets: 3, weightNote: 'home' },
      },
    },
  ],
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('op_v3'))
    return s ? Object.assign({}, DFLT, s) : JSON.parse(JSON.stringify(DFLT))
  } catch {
    return JSON.parse(JSON.stringify(DFLT))
  }
}

export function useAppState() {
  const [state, setState] = useState(() => loadState())

  function saveState(newState) {
    localStorage.setItem('op_v3', JSON.stringify(newState))
    setState(newState)
  }

  const getTodayPlanDay = () => {
    const e = daysBetween(state.startDate, todayISO())
    return Math.max(1, Math.min(PLAN.length, e + 1 - state.skippedDays))
  }

  const actions = {
    markComplete() {
      const pd = getTodayPlanDay()
      if (!state.completed.includes(pd)) {
        saveState({ ...state, completed: [...state.completed, pd] })
      }
    },

    markIncomplete() {
      const pd = getTodayPlanDay()
      saveState({ ...state, completed: state.completed.filter(n => n !== pd) })
    },

    missSession() {
      const t = todayISO()
      const missedDates = state.missedDates || []
      if (!missedDates.includes(t)) {
        saveState({
          ...state,
          missedDates: [...missedDates, t],
          skippedDays: state.skippedDays + 1,
        })
      }
    },

    jumpToDay(n) {
      const e = daysBetween(state.startDate, todayISO())
      saveState({ ...state, skippedDays: e + 1 - n })
    },

    logWeight(value, date) {
      if (!value) return
      saveState({
        ...state,
        weights: [...state.weights, { date, value: parseFloat(value).toFixed(1) }],
      })
    },

    logRun(dist, secs) {
      if (!secs) return
      const runs = state.runs || []
      const pbs = { ...state.pbs }
      if (!pbs[dist] || secs < pbs[dist]) pbs[dist] = secs
      saveState({
        ...state,
        runs: [...runs, { date: todayISO(), dist, secs }],
        pbs,
      })
    },

    setPB(dist, secs) {
      saveState({ ...state, pbs: { ...state.pbs, [dist]: secs } })
    },

    updateStart(date) {
      if (!date) return
      saveState({ ...state, startDate: date, skippedDays: 0, missedDates: [] })
    },

    saveLog(planDayNum, exercises, notes, rating) {
      const d = PLAN[planDayNum - 1]
      if (!d) return
      const history = state.workoutHistory || []
      saveState({
        ...state,
        workoutHistory: [
          ...history,
          { date: todayISO(), planDay: planDayNum, type: d.session.type, exercises, notes: notes || '', rating: rating || null },
        ],
      })
    },

    logRunSession(planDayNum, distance, timeSeconds, effort, notes, rating) {
      const dist = parseFloat(distance)
      const pace = timeSeconds && dist ? Math.round(timeSeconds / dist) : null
      saveState({
        ...state,
        runSessionLogs: [
          ...(state.runSessionLogs || []),
          {
            date: todayISO(),
            planDay: planDayNum,
            distance: dist || null,
            timeSeconds: timeSeconds || null,
            pace,
            effort: effort ? parseInt(effort) : null,
            notes: notes || '',
            rating: rating || null,
          },
        ],
      })
    },

    updateFarmersCarry(kg) {
      if (!kg) return
      saveState({ ...state, farmersCarryKg: parseFloat(kg) })
    },

    importData(data) {
      saveState(Object.assign({}, DFLT, data))
    },

    skipSession() {
      const pd = getTodayPlanDay(state)
      const newCompleted = state.completed.includes(pd) ? state.completed : [...state.completed, pd]
      saveState({ ...state, completed: newCompleted })
    },

    logRuck(weight, distance, date, notes) {
      if (!weight) return
      saveState({
        ...state,
        ruckLogs: [
          ...(state.ruckLogs || []),
          { date: date || todayISO(), weight: parseFloat(weight), distance: parseFloat(distance) || 0, notes: notes || '' },
        ],
      })
    },
  }

  return { state, actions }
}
