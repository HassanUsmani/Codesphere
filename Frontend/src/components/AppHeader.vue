<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import A11yMenu from '@/components/A11yMenu.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { goToSection, navigate, prefersReducedMotion, route } from '@/lib/router'
import { isDark, toggleTheme } from '@/composables/useTheme'

const nav = [
  { id: 'home', label: 'Home' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'banking', label: 'Banking' },
  { id: 'fraud-detection', label: 'Fraud Detection' },
  { id: 'ride-hailing', label: 'Ride-Hailing' },
  { id: 'foodpanda', label: 'foodpanda' },
]

const active = ref('home')
const menuOpen = ref(false)
const menuButton = ref(null)

function hrefFor(item) {
  return item.id === 'home' ? '#/practice' : `#/practice?section=${item.id}`
}

function syncActive() {
  if (route.name !== 'practice') {
    active.value = ''
    return
  }
  if (window.scrollY < 40) {
    active.value = 'home'
    return
  }
  const markers = document.querySelectorAll('[data-spy]')
  if (!markers.length) return
  const line = window.scrollY + 180
  let current = 'home'
  markers.forEach((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY
    if (top <= line) current = el.dataset.spy
  })
  active.value = current === 'modules' ? 'home' : current
}

function goHome() {
  menuOpen.value = false
  if (route.name !== 'practice') {
    navigate('practice')
    return
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  window.history.replaceState(null, '', '#/practice')
  route.params.section = ''
  active.value = 'home'
}

function go(item) {
  menuOpen.value = false
  if (item.id === 'home') {
    goHome()
    return
  }
  if (route.name === 'practice') {
    goToSection(item.id)
    active.value = item.id
  } else {
    navigate('practice', { section: item.id })
  }
}

function closeMenu({ focus = false } = {}) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (focus) nextTick(() => menuButton.value?.focus())
}

watch(
  () => route.name,
  async (name) => {
    menuOpen.value = false
    if (name === 'practice') {
      await nextTick()
      requestAnimationFrame(syncActive)
    } else {
      active.value = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('scroll', syncActive, { passive: true })
  window.addEventListener('resize', syncActive)
  nextTick(() => requestAnimationFrame(syncActive))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncActive)
  window.removeEventListener('resize', syncActive)
})
</script>

<template>
  <header class="app-header" @keydown.esc="closeMenu({ focus: true })">
    <div class="container">
      <div class="app-header__bar">
        <a class="brand" href="#/practice" aria-label="Tech Guide home" @click.prevent="goHome">
          <BrandLogo :size="34" />
        </a>

        <span class="spacer" />

        <nav class="app-nav" aria-label="Modules">
          <a
            v-for="item in nav"
            :key="item.id"
            class="app-nav__link"
            :class="{ 'is-active': active === item.id }"
            :href="hrefFor(item)"
            :aria-current="active === item.id ? 'location' : undefined"
            @click.prevent="go(item)"
          >
            {{ item.label }}
          </a>
        </nav>

        <button
          type="button"
          class="icon-btn"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
        </button>

        <A11yMenu />

        <button
          ref="menuButton"
          type="button"
          class="icon-btn menu-btn"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuOpen"
          aria-controls="header-mobile-nav"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'x' : 'menu'" :size="20" />
        </button>
      </div>

      <nav v-if="menuOpen" id="header-mobile-nav" class="mobile-nav" aria-label="Modules">
        <a
          v-for="item in nav"
          :key="item.id"
          class="mobile-nav__link"
          :class="{ 'is-active': active === item.id }"
          :href="hrefFor(item)"
          :aria-current="active === item.id ? 'location' : undefined"
          @click.prevent="go(item)"
        >
          {{ item.label }}
          <AppIcon name="chevron-right" :size="14" />
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--ink);
  border-radius: var(--r-sm);
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.app-nav__link {
  padding: 0.5rem 0.7rem;
  border-radius: var(--r-pill);
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--ink-soft);
  text-decoration: none;
  white-space: nowrap;
  transition: background 200ms var(--ease), color 200ms var(--ease);
}

.app-nav__link:hover {
  background: var(--mint-100);
  color: var(--teal-700);
}

.app-nav__link.is-active {
  background: var(--teal-700);
  color: #fff;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  flex: none;
  border-radius: 50%;
  color: var(--ink-soft);
  transition: background 200ms var(--ease), color 200ms var(--ease);
}

.icon-btn:hover {
  background: var(--mint-100);
  color: var(--teal-700);
}

.menu-btn {
  display: none;
}

.mobile-nav {
  display: grid;
  gap: 0.15rem;
  margin-top: 0.5rem;
  padding: 0.45rem;
  border-radius: var(--r-lg);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md);
}

.mobile-nav__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  border-radius: var(--r-md);
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--ink-soft);
  text-decoration: none;
}

.mobile-nav__link:hover {
  background: var(--mint-100);
  color: var(--teal-700);
}

.mobile-nav__link.is-active {
  background: var(--teal-700);
  color: #fff;
}

@media (max-width: 55.99rem) {
  .app-nav {
    display: none;
  }

  .menu-btn {
    display: grid;
  }
}

@media (max-width: 30rem) {
  .app-header__bar {
    gap: 0.35rem;
  }

  .app-header__bar :deep(.brand-logo__text) {
    font-size: 0.98rem;
  }
}
</style>
