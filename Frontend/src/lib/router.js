import { computed, reactive } from 'vue'

const DEFAULT_ROUTE = 'practice'
const KNOWN = new Set(['practice', 'simulator', 'scam', 'safety', 'progress'])

function parse(hash) {
  const clean = (hash || '').replace(/^#\/?/, '')
  const [path, query = ''] = clean.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))
  return { name: KNOWN.has(path) ? path : DEFAULT_ROUTE, params }
}

export const route = reactive(parse(window.location.hash))

export const currentMission = computed(() => route.params.mission || '')
export const currentLevel = computed(() => route.params.level || 'beginner')

function apply() {
  const next = parse(window.location.hash)
  route.name = next.name
  route.params = next.params
}

window.addEventListener('hashchange', apply)

export function navigate(name, params = {}, { replace = false } = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ).toString()
  const target = `#/${name}${query ? `?${query}` : ''}`
  if (replace) {
    window.history.replaceState(null, '', target)
    apply()
  } else if (window.location.hash !== target) {
    window.location.hash = target
  }
}

export function prefersReducedMotion() {
  if (document.documentElement.dataset.a11y?.includes('reduce-motion')) return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return false
  const header = document.querySelector('.app-header')
  const offset = (header?.getBoundingClientRect().height ?? 64) + 12
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset)
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  return true
}

/* In-page section jump that keeps the hash router valid. */
export function goToSection(id) {
  const found = scrollToId(id)
  window.history.replaceState(null, '', `#/practice?section=${encodeURIComponent(id)}`)
  route.params.section = id
  return found
}
