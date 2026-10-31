import { reactive, watch } from 'vue'
import { read, write } from '@/lib/storage'

const DEFAULTS = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  senior: false,
}

export const a11y = reactive({ ...DEFAULTS, ...read('a11y', {}) })

function flags() {
  const on = []
  if (a11y.senior) on.push('senior')
  if (a11y.largeText) on.push('large-text')
  if (a11y.highContrast) on.push('high-contrast')
  if (a11y.reduceMotion) on.push('reduce-motion')
  return on.join(' ')
}

function apply() {
  const root = document.documentElement
  root.dataset.a11y = flags()
}

watch(a11y, () => {
  apply()
  write('a11y', { ...a11y })
})

apply()

export function toggle(key) {
  a11y[key] = !a11y[key]
}

export function resetA11y() {
  Object.assign(a11y, DEFAULTS)
}
