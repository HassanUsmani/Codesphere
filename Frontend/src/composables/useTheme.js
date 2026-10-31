import { computed, ref, watch } from 'vue'
import { read, write } from '@/lib/storage'

const media = window.matchMedia?.('(prefers-color-scheme: dark)')
const saved = read('theme', null)
const initial = saved === 'dark' || saved === 'light' ? saved : media?.matches ? 'dark' : 'light'

export const theme = ref(initial)
export const isDark = computed(() => theme.value === 'dark')

function apply(value) {
  document.documentElement.dataset.theme = value
}

apply(theme.value)

watch(theme, (value) => {
  apply(value)
  write('theme', value)
})

/* Until the visitor picks a theme, follow OS changes live. */
media?.addEventListener?.('change', (event) => {
  if (read('theme', null) === null) theme.value = event.matches ? 'dark' : 'light'
})

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
