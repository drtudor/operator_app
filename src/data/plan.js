export const NO_GYM_EXERCISES = {
  upper: [
    { name: 'Push Ups', sets: 4, reps: 'Max', rest: '90s', note: 'Full range — chest to floor' },
    { name: 'Wide Push Ups', sets: 3, reps: '15', rest: '60s', note: 'Chest focus' },
    { name: 'Diamond Push Ups', sets: 3, reps: '12', rest: '60s', note: 'Tricep focus' },
    { name: 'Pike Push Ups', sets: 3, reps: '12', rest: '60s', note: 'Shoulder focus — hips high' },
    { name: 'Decline Push Ups', sets: 3, reps: '12', rest: '60s', note: 'Feet on chair or sofa' },
    { name: 'Tricep Dips', sets: 3, reps: '12', rest: '60s', note: 'Use a chair or sofa edge' },
    { name: 'Superman Hold', sets: 3, reps: '15', rest: '45s', note: 'Squeeze at top, lower back + glutes' },
  ],
  lower: [
    { name: 'Bodyweight Squats', sets: 4, reps: '20', rest: '60s', note: 'Slow down, pause at bottom' },
    { name: 'Bulgarian Split Squats', sets: 3, reps: '12/leg', rest: '90s', note: 'Rear foot on chair — quad dominant' },
    { name: 'Glute Bridges', sets: 4, reps: '20', rest: '45s', note: 'Drive through heels, pause at top' },
    { name: 'Walking Lunges', sets: 3, reps: '15/leg', rest: '60s' },
    { name: 'Single Leg RDL', sets: 3, reps: '12/leg', rest: '60s', note: 'Slow and controlled, hamstring stretch' },
    { name: 'Wall Sit', sets: 3, reps: '60s', rest: '60s', note: 'Thighs parallel to floor' },
    { name: 'Calf Raises', sets: 3, reps: '25', rest: '45s', note: 'Single leg for more challenge' },
  ],
  se_upper: [
    { name: 'Push Ups', sets: 5, reps: '20', rest: '45s' },
    { name: 'Wide Push Ups', sets: 4, reps: '20', rest: '45s', note: 'Chest focus' },
    { name: 'Diamond Push Ups', sets: 4, reps: '15', rest: '45s', note: 'Tricep focus' },
    { name: 'Pike Push Ups', sets: 3, reps: '15', rest: '45s', note: 'Shoulder focus' },
    { name: 'Tricep Dips', sets: 3, reps: '15', rest: '45s', note: 'Chair or sofa edge' },
    { name: 'Superman Hold', sets: 4, reps: '20', rest: '30s' },
    { name: 'Plank', sets: 3, reps: '60s', rest: '45s' },
  ],
  se_lower: [
    { name: 'Bodyweight Squats', sets: 4, reps: '25', rest: '45s', note: 'Continuous pace' },
    { name: 'Bulgarian Split Squats', sets: 4, reps: '15/leg', rest: '45s', note: 'Rear foot elevated' },
    { name: 'Glute Bridges', sets: 4, reps: '25', rest: '30s', note: 'Pause at top' },
    { name: 'Walking Lunges', sets: 4, reps: '20/leg', rest: '45s' },
    { name: 'Single Leg RDL', sets: 3, reps: '15/leg', rest: '45s' },
    { name: 'Wall Sit', sets: 3, reps: '90s', rest: '45s' },
  ],
}

export const EXERCISES = {
  upper: [
    { name: 'Pull Ups', sets: 4, reps: '6-10', rest: '90s', note: 'Assisted — reduce assist as strength builds' },
    { name: 'DB Bench Press', sets: 4, reps: '8-12', rest: '90s' },
    { name: 'DB Incline Bench', sets: 3, reps: '10-12', rest: '90s' },
    { name: 'T-Bar Row', sets: 4, reps: '8-10', rest: '90s' },
    { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '90s' },
    { name: 'Lateral Raises', sets: 3, reps: '15', rest: '60s' },
    { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s' },
    { name: 'Tricep Pushdown', sets: 3, reps: '12', rest: '60s' },
    { name: 'Tricep Extensions', sets: 3, reps: '12', rest: '60s' },
  ],
  lower: [
    { name: 'Deadlift', sets: 4, reps: '5', rest: '3min', note: 'Heavy — prioritise form' },
    { name: 'Squat', sets: 4, reps: '8', rest: '2min' },
    { name: 'Walking Lunges', sets: 3, reps: '10/leg', rest: '90s' },
    { name: 'Back Extensions', sets: 3, reps: '15', rest: '60s', note: 'Glute focus' },
    { name: 'Leg Curls', sets: 3, reps: '12', rest: '60s' },
  ],
  se_upper: [
    { name: 'Pull Ups', sets: 5, reps: '10-15', rest: '60s' },
    { name: 'DB Bench Press', sets: 4, reps: '15', rest: '60s' },
    { name: 'T-Bar Row', sets: 4, reps: '15', rest: '60s' },
    { name: 'Shoulder Press', sets: 3, reps: '15', rest: '60s' },
    { name: 'Face Pulls', sets: 4, reps: '20', rest: '45s' },
    { name: 'Lateral Raises', sets: 3, reps: '15', rest: '45s' },
  ],
  se_lower: [
    { name: 'Squat', sets: 4, reps: '15', rest: '60s' },
    { name: 'Walking Lunges', sets: 4, reps: '15/leg', rest: '60s' },
    { name: 'Back Extensions', sets: 4, reps: '20', rest: '45s' },
    { name: 'Leg Curls', sets: 3, reps: '15', rest: '45s' },
    { name: 'Step Ups', sets: 3, reps: '15/leg', rest: '60s' },
  ],
}

export const MUSCLES = {
  upper: ['Chest', 'Back', 'Shoulders', 'Triceps', 'Biceps*'],
  lower: ['Quads', 'Hamstrings', 'Glutes', 'Lower Back'],
  se_upper: ['Chest', 'Back', 'Shoulders'],
  se_lower: ['Quads', 'Hamstrings', 'Glutes'],
  run: ['Cardiovascular', 'Calves', 'Hip Flexors'],
  ruck: ['Traps', 'Core', 'Glutes', 'Quads'],
  rest: [],
  deload: [],
}

export const SN = {
  upper: 'Upper Body', lower: 'Lower Body', run: 'Run', ruck: 'Ruck March',
  rest: 'Rest Day', deload: 'Deload', se_upper: 'SE — Upper Body', se_lower: 'SE — Lower Body',
}

export const RTN = {
  lss: 'LSS Run', tempo: 'Tempo Run', hill: 'Hill Training',
  '800s': '800m Repeats', long: 'Long Run', fartlek: 'Fartlek',
}

export const PN = { capacity: 'CAPACITY', velocity: 'VELOCITY', outcome: 'OUTCOME' }

export function generatePlan() {
  const days = []
  let n = 0, cr = 0
  const add = (phase, pw, wd, session, dl = false) =>
    days.push({ dayNum: ++n, phase, phaseWeek: pw, weekDay: wd, session, isDeload: dl })

  for (let w = 1; w <= 8; w++) {
    const dl = w === 4 || w === 8
    const sd = dl ? '30' : (w <= 3 ? '30-60' : '60-90')
    const ld = dl ? '30' : (w <= 3 ? '60-90' : '90-120')
    if (dl) {
      add('capacity', w, 1, { type: 'upper', deload: true }, true)
      add('capacity', w, 2, { type: 'run', runType: 'lss', duration: sd, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Deload run. Easy effort throughout.' }, true)
      add('capacity', w, 3, { type: 'rest' }, true)
      add('capacity', w, 4, { type: 'run', runType: 'lss', duration: sd, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Easy recovery run.' }, true)
      add('capacity', w, 5, { type: 'rest' }, true)
      add('capacity', w, 6, { type: 'run', runType: 'lss', duration: ld, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Deload long run. Very easy throughout.' }, true)
      add('capacity', w, 7, { type: 'rest' }, true)
    } else {
      add('capacity', w, 1, { type: 'upper' })
      add('capacity', w, 2, { type: 'run', runType: 'lss', duration: sd, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Aerobic base run. Target 120-150 BPM. If you cannot hold a conversation, slow down.' })
      add('capacity', w, 3, { type: 'lower' })
      add('capacity', w, 4, { type: 'run', runType: 'lss', duration: sd, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Aerobic base run. Same effort as first run this week.' })
      add('capacity', w, 5, { type: 'upper' })
      add('capacity', w, 6, { type: 'run', runType: 'lss', duration: ld, stravaLabel: `Capacity — Run ${++cr}/24`, notes: 'Long aerobic run. Key session. Stay easy the entire time.' })
      add('capacity', w, 7, { type: 'rest' })
    }
  }

  const vW = [
    { ft: true, lss1: 5, spd: 'TPO', spdD: '3-5', lss2: 3, lr: 8 },
    { ft: true, lss1: 6, spd: 'Hill', lss2: 3, lr: 9 },
    { ft: true, lss1: 6, spd: '800', spdD: '3-5', lss2: 3, lr: 10 },
    { ft: false, lss1: 3, lss2: 3, lr: 3, deload: true },
    { ft: true, lss1: 6, spd: 'TPO', spdD: '3-5', lss2: 4, lr: 11 },
    { ft: true, lss1: 8, spd: 'Hill', lss2: 4, lr: 12 },
    { ft: true, lss1: 8, spd: '800', spdD: '3-5', lr: 13, lr2: 8 },
    { ft: false, lss1: 4, lss2: 4, lr: 4, deload: true },
  ]
  let vFT = 0
  vW.forEach((v, i) => {
    const w = i + 1, dl = v.deload || false
    if (v.ft) { vFT++; add('velocity', w, 1, { type: vFT % 2 === 1 ? 'upper' : 'lower' }, dl) }
    else add('velocity', w, 1, { type: 'rest' }, dl)
    add('velocity', w, 2, { type: 'run', runType: 'lss', distance: v.lss1, notes: `Easy trail/road run. ${v.lss1} miles at comfortable aerobic pace.` }, dl)
    if (v.spd === 'TPO') add('velocity', w, 3, { type: 'run', runType: 'tempo', distance: v.spdD, notes: `Tempo run ${v.spdD || ''} miles. Add 1 mile warmup + cooldown.` }, dl)
    else if (v.spd === 'Hill') add('velocity', w, 3, { type: 'run', runType: 'hill', notes: 'Hill training: 30-120 min elevation work.' }, dl)
    else if (v.spd === '800') add('velocity', w, 3, { type: 'run', runType: '800s', reps: v.spdD, notes: `800m repeats ×${v.spdD || ''}. Full recovery between reps.` }, dl)
    else add('velocity', w, 3, { type: 'rest' }, dl)
    if (v.ft) { vFT++; add('velocity', w, 4, { type: vFT % 2 === 1 ? 'upper' : 'lower' }, dl) }
    else add('velocity', w, 4, { type: 'rest' }, dl)
    if (v.lss2) add('velocity', w, 5, { type: 'run', runType: 'lss', distance: v.lss2, notes: `Easy recovery run. ${v.lss2} miles.` }, dl)
    else add('velocity', w, 5, { type: 'rest' }, dl)
    add('velocity', w, 6, { type: 'run', runType: 'long', distance: v.lr, notes: `Long Run — ${v.lr} miles. Offroad preferred.` }, dl)
    if (v.lr2) add('velocity', w, 7, { type: 'run', runType: 'long', distance: v.lr2, notes: `Back-to-Back Long Run — ${v.lr2} miles.` }, dl)
    else add('velocity', w, 7, { type: 'rest' }, dl)
  })

  const oW = [
    { ft: true, r1: 2, d5: 'FK', r2: 4 },
    { ft: true, r1: 2, d5: 'Peggy', r2: 5 },
    { ft: true, r1: 2, r2: 6, r3: 4 },
    { deload: true },
    { se: true, r1: 4, d5: 'FK', r2: 8 },
    { se: true, r1: 4, d5: 'Peggy', r2: 9 },
    { se: true, r1: 4, r2: 10, r3: 6 },
    { deload: true },
  ]
  let oFT = 0
  oW.forEach((v, i) => {
    const w = i + 1
    if (v.deload) {
      ;[1, 3, 5, 7].forEach(d => add('outcome', w, d, { type: 'rest' }, true))
      ;[2, 4, 6].forEach(d => add('outcome', w, d, { type: 'run', runType: 'lss', notes: 'Easy LSS, deload week.' }, true))
      return
    }
    const isSE = v.se || false
    oFT++
    add('outcome', w, 1, { type: isSE ? (oFT % 2 === 1 ? 'se_upper' : 'se_lower') : (oFT % 2 === 1 ? 'upper' : 'lower') })
    if (v.r1) add('outcome', w, 2, { type: 'ruck', distance: v.r1, notes: `Short Ruck — ${v.r1} miles. Start 15-20kg, build over weeks.` })
    add('outcome', w, 3, { type: 'run', runType: 'lss', notes: 'Easy LSS between rucks.' })
    oFT++
    add('outcome', w, 4, { type: isSE ? (oFT % 2 === 1 ? 'se_upper' : 'se_lower') : (oFT % 2 === 1 ? 'upper' : 'lower') })
    if (v.d5 === 'FK') add('outcome', w, 5, { type: 'run', runType: 'fartlek', distance: 5, notes: 'Fartlek 5 miles.' })
    else if (v.d5 === 'Peggy') add('outcome', w, 5, { type: 'run', runType: 'hill', notes: "Peggy's Hills — 30-60 min elevation." })
    else add('outcome', w, 5, { type: 'rest' })
    if (v.r2) add('outcome', w, 6, { type: 'ruck', distance: v.r2, notes: `Long Ruck — ${v.r2} miles. Progressive weight increase.` })
    if (v.r3) add('outcome', w, 7, { type: 'ruck', distance: v.r3, notes: `Back-to-Back Ruck — ${v.r3} miles.` })
    else add('outcome', w, 7, { type: 'rest' })
  })

  return days
}

export const PLAN = generatePlan()

// ===== HELPER FUNCTIONS =====

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000)
}

export function getTodayPlanDay(state) {
  const e = daysBetween(state.startDate, todayISO())
  return Math.max(1, Math.min(PLAN.length, e + 1 - state.skippedDays))
}

export function isTodayMissed(state) {
  return (state.missedDates || []).includes(todayISO())
}

export function getCurrentDay(state) {
  return PLAN[getTodayPlanDay(state) - 1] || PLAN[0]
}

export function isCompleted(state, n) {
  return state.completed.includes(n)
}

export function getPhaseTotal(p) {
  return PLAN.filter(d => d.phase === p).length
}

export function getPhaseStart(p) {
  return PLAN.findIndex(d => d.phase === p) + 1
}

export function dayTypeLabel(d) {
  if (!d) return ''
  const s = d.session
  if (s.type === 'run') return RTN[s.runType] || 'Run'
  if (s.type === 'ruck') return `Ruck ${s.distance || ''}mi`
  return SN[s.type] || s.type
}

export function fmtTime(s) {
  if (!s) return '--:--'
  const m = Math.floor(s / 60), ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export function parseTime(str) {
  if (!str) return null
  const p = str.split(':').map(Number)
  if (p.length === 2) return p[0] * 60 + p[1]
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2]
  return null
}

export function getLastLog(state, name) {
  const h = state.workoutHistory || []
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i].exercises && h[i].exercises[name]) return h[i].exercises[name]
  }
  return null
}

export function fmtWt(ll) {
  return ll.weightNote ? `${ll.weight}kg (${ll.weightNote})` : `${ll.weight}kg`
}

export function parseRR(r) {
  if (!r || r === 'Max') return { mn: 6, mx: 10 }
  if (r.includes('-')) {
    const [a, b] = r.split('-').map(Number)
    return { mn: a, mx: b }
  }
  const n = parseInt(r)
  return { mn: n, mx: n }
}

export function getInc(name) {
  if (name === 'Pull Ups') return -2.5
  if (['DB Bench', 'DB Incline', 'T-Bar', 'Shoulder Press', 'Squat', 'Deadlift', 'Step Up'].some(c => name.includes(c))) return 2.5
  return 1
}

export function calculateStreak(state) {
  const todayDay = getTodayPlanDay(state)
  let streak = 0
  for (let d = todayDay; d >= 1; d--) {
    const planDay = PLAN[d - 1]
    if (!planDay) break
    const isRest = planDay.session.type === 'rest' || planDay.session.type === 'deload'
    if (isRest || state.completed.includes(planDay.dayNum)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function getProgression(ex, ll) {
  if (!ll) return null
  const { mn, mx } = parseRR(ex.reps)
  const { weight: w, reps: r } = ll
  const isPU = ex.name === 'Pull Ups'
  if (r < mn) return { msg: `Keep ${w}kg${isPU ? ' assist' : ''} — aim for ${mn} reps`, color: 'var(--text-dim)' }
  if (r < mx) return { msg: `Keep ${w}kg${isPU ? ' assist' : ''} — push to ${mx} reps`, color: 'var(--amber)' }
  const nw = Math.round((w + getInc(ex.name)) * 10) / 10
  return { msg: isPU ? `Reduce assist to ${nw}kg` : `Increase to ${nw}kg — great progress`, color: 'var(--green)' }
}
