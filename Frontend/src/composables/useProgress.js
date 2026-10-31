import { computed, reactive, watch } from 'vue'
import { read, write } from '@/lib/storage'

const initialState = {
  missions: {},
  scams: {},
  safetyPlan: false,
  xp: 0,
}

export const progress = reactive({ ...initialState, ...read('progress', {}) })

watch(
  progress,
  (value) => write('progress', value),
  { deep: true },
)

export const completedMissions = computed(() => Object.keys(progress.missions).length)

export const completedScamLevels = computed(() => Object.keys(progress.scams).length)

export function isMissionDone(id) {
  return Boolean(progress.missions[id])
}

export function completeMission(id, { xp = 60 } = {}) {
  if (progress.missions[id]) return
  progress.missions[id] = { at: Date.now(), xp }
  progress.xp += xp
}

export function completeScamLevel(level, { correct = 0, total = 0 } = {}) {
  const previous = progress.scams[level]
  if (!previous) progress.xp += 80
  progress.scams[level] = {
    at: Date.now(),
    best: Math.max(correct, previous?.best ?? 0),
    total,
  }
}

export function markSafetyPlan() {
  if (progress.safetyPlan) return
  progress.safetyPlan = true
  progress.xp += 40
}

export function resetProgress() {
  Object.assign(progress, { missions: {}, scams: {}, safetyPlan: false, xp: 0 })
}
